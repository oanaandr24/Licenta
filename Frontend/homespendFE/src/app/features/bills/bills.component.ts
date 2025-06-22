import { Component, OnInit, ViewChild } from '@angular/core';
import { Bills } from 'src/app/utils/interfaces/bills';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/header/header.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BillsService } from 'src/app/utils/services/bills.service';
import { ApartmentService } from 'src/app/utils/services/apartments.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BillsModalComponent } from '../modals/bills-modal/bills-modal.component';
import { IndexesService } from 'src/app/utils/services/indexes.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    CardModule,
    DialogModule,
    HeaderComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TagModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    BillsModalComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;

  ap: any;
  selectedAp: any;
  bills: Bills[] = [];
  userCode: string = '';
  apartments: any[] = [];
  apCode: string = '';
  userRole: any = '';

  selectedBill: Bills | null = null;
  displayModal: boolean = false;
  showNoBillsMessage: boolean = false;

  displayIndexModal: boolean = false;
  selectedType: any = '';
  newIndex!: any;

  constructor(
    private billsService: BillsService,
    private router: Router,
    private apartmentService: ApartmentService,
    private indexesService: IndexesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.userRole = sessionStorage.getItem('role');
    this.userCode = localStorage.getItem('userCode')!;

    if (window.history.state['ap'] !== undefined) {
      this.ap = window.history.state['ap'];
      this.apCode = this.ap.apartmentsCode;
      if (this.ap?.apartmentsCode) {
        this.loadBills(this.ap.apartmentsCode);
      }
    }
    
    if (this.userCode) {
      if (this.userRole === 'LOCATAR') {
        this.apartmentService.getApartmentsByUserCode(this.userCode).subscribe({
          next: (response) => {
            this.apartments = response.map((apt) => ({
              label:
                apt.administratorCode === 'CASA'
                  ? apt.address_city + ', ' + apt.address_street
                  : apt.address_city +
                    ', ' +
                    apt.address_street +
                    ', ' +
                    apt.address_block,
              value: apt.apartmentsCode,
            }));
          },
          error: (error) => {
            console.error('Eroare:', error);
          },
        });
      }
      if (this.userRole === 'ADMIN') {
        this.getIndexes();
        this.apartmentService.getApartmentsByUserRole(this.userCode).subscribe({
          next: (response) => {
            this.apartments = response.map((apt) => ({
              label:
                apt.administratorCode === 'CASA'
                  ? apt.address_city + ', ' + apt.address_street
                  : apt.address_city +
                    ', ' +
                    apt.address_street +
                    ', ' +
                    apt.address_block,
              value: apt.apartmentsCode,
            }));
          },
          error: (error) => {
            console.error('Eroare:', error);
          },
        });
      }
    }
  }

  onApSelection() {
    this.apCode = this.selectedAp;
    this.loadBills(this.selectedAp);
  }

  loadBills(code: string) {
    this.billsService.getBillsByApartment(code).subscribe({
      next: (data) => {
        this.bills = data;
        console.log(this.bills);
        this.bills.length === 0
          ? (this.showNoBillsMessage = true)
          : (this.showNoBillsMessage = false);
      },
      error: (err) => console.error('Eroare la încărcarea facturilor:', err),
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'ACHITAT':
        return 'success';
      case 'NEACHITAT':
        return 'danger';
      case 'NEPLĂTIT':
        return 'danger';
    }
    return 'success';
  }

  openModal() {
    this.displayModal = true;
    console.log(this.selectedBill);
  }

  editBill(bill: any) {
    this.selectedBill = bill;
    this.openModal();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt1!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }

  addBill() {
    this.selectedBill = null;
    this.displayModal = true;
  }

  downloadPdf(base64Data: string, fileName: string = 'factura.pdf') {
    if (!base64Data) return;

    // Convert base64 to binary string
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create blob and URL
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    // Create a link and click it to download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.click();

    // Release the URL object
    URL.revokeObjectURL(blobUrl);
  }

  deleteBill(id: any) {
    this.confirmationService.confirm({
      message: 'Confirmați ștergerea facturii?',
      header: 'Confirmare',
      acceptIcon: 'none',
      acceptLabel: 'Da',
      rejectIcon: 'none',
      rejectLabel: 'Nu',
      rejectButtonStyleClass: 'p-button-text rejectButton',
      acceptButtonStyleClass: 'addButton',
      accept: () => {
        this.billsService.deleteBill(id).subscribe((data) => {
          this.reloadTable(true);
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmat',
            detail: `Factura a fost ștearsă.`,
          });
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Respins',
          detail: 'Ai anulat ștergerea facturii.',
          life: 3000,
        });
      },
    });
  }

  addIndex() {
    this.displayIndexModal = true;
  }

  getIndexes() {
    this.indexesService.getIndexes().subscribe();
  }

  sendIndex() {
    console.log(this.newIndex);
    const requestBody = {
      type: this.selectedType,
      value: this.newIndex,
      apartmentsCode: this.apCode,
    };

    this.indexesService.addIndex(requestBody).subscribe((data) => {
      this.displayIndexModal = false;
      (this.selectedType = ''), (this.newIndex = '');
    });
  }

  changeStatus(bill: any) {
    const formatStatus = (status: string) => {
      const emoji = status === 'NEPLĂTIT' ? '🔴' : '🟢';
      return `${emoji} ${status}`;
    };

    const newStatus = bill.status === 'NEPLĂTIT' ? 'ACHITAT' : 'NEPLĂTIT';
    const message = `Doriți să modificați statusul facturii din ${formatStatus(
      bill.status
    )} în ${formatStatus(newStatus)}?`;

    this.confirmationService.confirm({
      message: message,
      header: 'Confirmare',
      acceptIcon: 'none',
      acceptLabel: 'Da',
      rejectIcon: 'none',
      rejectLabel: 'Nu',
      rejectButtonStyleClass: 'p-button-text rejectButton',
      acceptButtonStyleClass: 'addButton',
      accept: () => {
        const formData = new FormData();
        formData.append(
          'bills',
          JSON.stringify({
            status: newStatus,
          })
        );

        this.billsService.updateBill(bill.id, formData).subscribe({
          next: () => {
            this.reloadTable(true);
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmat',
              detail: `Statusul facturii a fost schimbat în ${newStatus}.`,
            });
          },
          error: (err) => console.error('Update bill error:', err),
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Respins',
          detail: 'Ai anulat schimbarea statusului facturii.',
          life: 3000,
        });
      },
    });
  }

  reloadTable(event: any) {
    if (event) {
      this.loadBills(this.apCode);
    }
  }

  onBack() {
    this.router.navigate(['apartments']);
  }
}
