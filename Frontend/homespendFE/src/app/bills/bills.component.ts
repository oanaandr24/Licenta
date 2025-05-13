/*import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-bills',
  imports: [
    CardModule
  ],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.scss'
})
export class BillsComponent {
ap: any;

ngOnInit() {
  this.ap = window.history.state['ap']
  console.log('this ap', this.ap.apartmentsCode)
}
}
import { Component, OnInit } from '@angular/core';
import { BillsService } from 'src/app/bills.service';
import { Bills } from 'src/app/bills';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [[
    TableModule,
    CardModule
    ]],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {
  ap: any;
  bills: Bills[] = [];

  constructor(private billsService: BillsService) {}

  ngOnInit() {
    this.ap = window.history.state['ap'];
    console.log('AP:', this.ap);
    if (this.ap?.apartmentsCode) {
      this.loadBills(this.ap.apartmentsCode);
    }
  }

  loadBills(code: string) {
    this.billsService.getBillsByApartment(code).subscribe({
      next: (data) => {
        this.bills = data;
      },
      error: (err) => {
        console.error('Eroare la încărcarea facturilor:', err);
      }
    });
  }
}
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { BillsService } from 'src/app/bills.service';
import { Bills } from 'src/app/bills';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

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
    ButtonModule
  ],
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;

  ap: any;
  bills: Bills[] = [];

  selectedBill: Bills | null = null;
  displayModal: boolean = false;

  constructor(
    private billsService: BillsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ap = window.history.state['ap'];
    if (this.ap?.apartmentsCode) {
      this.loadBills(this.ap.apartmentsCode);
    }
  }

  loadBills(code: string) {
    this.billsService.getBillsByApartment(code).subscribe({
      next: (data) => (this.bills = data),
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
    }
    return 'success'
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

  goToStats() {
    this.router.navigate(['stats'], {
      state: {ap: this.ap}
    })
  }

  onBack() {
    this.router.navigate(['apartments'])
  }
}
