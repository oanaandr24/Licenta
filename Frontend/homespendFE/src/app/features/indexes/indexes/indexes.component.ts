import { Component, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
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
import { HeaderComponent } from 'src/app/core/header/header.component';
import { IndexesService } from 'src/app/utils/services/indexes.service';
import { Bills } from 'src/app/utils/interfaces/bills';
import { BillsModalComponent } from '../../modals/bills-modal/bills-modal.component';

@Component({
  selector: 'app-indexes',
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
        BillsModalComponent
  ],
  templateUrl: './indexes.component.html',
  styleUrl: './indexes.component.scss'
})
export class IndexesComponent {
 @ViewChild('dt1') dt1: Table | undefined;

  ap: any;
  selectedAp: any;
  indexes: any[] = [];
  userCode: string = '';
  apartments: any[] = [];
  apCode: string = '';
  userRole: any = '';

  selectedIndex: any | null = null;
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
    private indexesService: IndexesService
  ) {}

  ngOnInit() {
    this.userRole = sessionStorage.getItem('role');

    if (window.history.state['ap'] !== undefined) {
      this.ap = window.history.state['ap'];
      this.apCode = this.ap.apartmentsCode;
      if (this.ap?.apartmentsCode) {
        this.loadIndexes(this.ap.apartmentsCode);
      }
    }
    this.userCode = localStorage.getItem('userCode')!;
    if (this.userCode) {
      if (this.userRole === 'ADMIN') {
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
    this.loadIndexes(this.selectedAp);
  }

  loadIndexes(code: string) {
    this.indexesService.getIndexesByApartmentCode(code).subscribe({
      next: (data) => {
        this.indexes = data;
        this.indexes.length === 0
          ? (this.showNoBillsMessage = true)
          : (this.showNoBillsMessage = false);
      },
      error: (err) => console.error('Eroare la încărcarea indexurilor:', err),
    });
  }

  generateBill(index: any) {
    const requestBody = {
      id: index.id,
      type: index.type,
      value: index.value,
      apartmentsCode: index.apartmentsCode
    }

    console.log('req', requestBody)
    this.indexesService.generateBill(requestBody).subscribe((data: Bills) => {
      this.displayModal = true;
      this.selectedBill = data
      this.apCode = data.apartmentsCode
    })
  }


  applyFilterGlobal($event: any, stringVal: any) {
    this.dt1!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }


  deleteBill(id: any) {
    this.billsService.deleteBill(id).subscribe((data) => {
      this.reloadTable(true);
    });
  }

  addIndex() {
    this.displayIndexModal = true;
  }

  reloadTable(event: any) {
    if (event) {
      this.loadIndexes(this.apCode);
    }
  }

  onBack() {
    this.router.navigate(['apartments']);
  }
}
