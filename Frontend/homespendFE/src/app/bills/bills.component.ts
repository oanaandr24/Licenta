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
}*/
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

