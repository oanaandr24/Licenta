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
  ],
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

  selectedBill: Bills | null = null;
  displayModal: boolean = false;
  showNoBillsMessage: boolean = false;

  constructor(
    private billsService: BillsService,
    private router: Router,
    private apartmentService: ApartmentService
  ) {}

  ngOnInit() {
    if (window.history.state['ap'] !== undefined) {
      this.ap = window.history.state['ap'];
      this.apCode = this.ap.apartmentsCode;
      if (this.ap?.apartmentsCode) {
        this.loadBills(this.ap.apartmentsCode);
      }
    }
    this.userCode = localStorage.getItem('userCode')!;
    if (this.userCode) {
      this.apartmentService.getApartmentsByUserCode(this.userCode).subscribe({
        next: (response) => {
          console.log('Apartamente:', response);

          this.apartments = response.map((apt) => ({
            label: apt.apartmentsCode,
            value: apt.apartmentsCode,
          }));
        },
        error: (error) => {
          console.error('Eroare:', error);
        },
      });
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
      case 'SCADENT':
        return 'warning';
      case 'NEACHITAT':
        return 'danger';
      case 'NEPLATIT':
        return 'danger';
    }
    return 'success';
  }

  openModal() {
    this.displayModal = true;
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

  reloadTable(event: any) {
    if(event) {
       this.loadBills(this.apCode);
    }
  }

  onBack() {
    this.router.navigate(['apartments']);
  }
}
