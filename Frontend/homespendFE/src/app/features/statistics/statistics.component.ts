import { Component } from '@angular/core';
import { HeaderComponent } from '../../core/header/header.component';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { Bills } from '../../utils/interfaces/bills';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { BillsService } from 'src/app/utils/services/bills.service';
import { ApartmentService } from 'src/app/utils/services/apartments.service';

@Component({
  selector: 'app-statistics',
  imports: [
    HeaderComponent,
    ButtonModule,
    ChartModule,
    CardModule,
    DropdownModule,
    FormsModule,
    CalendarModule,
    CommonModule,
    TableModule,
    DropdownModule,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  ap: any = [];
  bills: Bills[] = [];
  unpaidBills: Bills[] = [];
  filteredBills: Bills[] = [];

  basicData: any;
  basicOptions: any;

  chartDataCurrentMonth: any;
  chartDataFiltered: any;
  chartMonthOptions: any;
  chartFilterOptions: any;

  // Filters
  selectedType: string = '';
  selectedDates: Date[] = [];

  showChart: boolean = false;
  noData: boolean = false;
  showCharts: boolean = false;
  showNoBillsMessage: boolean = false;

  userCode: string = '';
  apartments: any[] = [];
  selectedAp: string = '';

  chartDataPaidUnpaid: any;
  chartPaidUnpaidOptions: any;

  constructor(
    private router: Router,
    private billsService: BillsService,
    private apartmentService: ApartmentService
  ) {}

  ngOnInit() {
    if (window.history.state['ap'] !== undefined) {
      this.ap = window.history.state['ap'];
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
    this.initFilterChartOptions();
  }

  onApSelection() {
    this.showCharts = false;
    this.loadBills(this.selectedAp);
  }

  loadBills(code: string) {
    this.billsService.getBillsByApartment(code).subscribe({
      next: (data) => {
        this.bills = data;
        this.unpaidBills = this.bills.filter(
          (bill) => bill.status !== 'ACHITAT'
        );
        this.loadCurrentMonthChart();
        this.bills.length === 0
          ? (this.showNoBillsMessage = true)
          : (this.showNoBillsMessage = false);
        this.bills.length === 0
          ? (this.showCharts = false)
          : (this.showCharts = true);
      },
      error: (err) => console.error('Eroare la încărcarea facturilor:', err),
    });
  }

  loadCurrentMonthChart(): void {
    this.initChartOptions();

    const now = new Date();
    const currentMonthBills = this.bills.filter((bill: any) => {
      const date = new Date(bill.invoiceDate);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });

    // Chart 1: by type (polar area)
    const groupedByType = currentMonthBills.reduce((acc: any, bill: any) => {
      const paymentValue = parseFloat(bill.paymentValue);
      acc[bill.type] = (acc[bill.type] || 0) + paymentValue;
      return acc;
    }, {} as Record<string, number>);

    this.chartDataCurrentMonth = {
      labels: Object.keys(groupedByType),
      datasets: [
        {
          data: Object.values(groupedByType),
          backgroundColor: ['#80C8F1', '#A4D8A1', '#FFB876'],
        },
      ],
    };

    let paid = 0;
    let unpaid = 0;

    for (const bill of currentMonthBills) {
      const val = parseFloat(bill.paymentValue);
      if (bill.status === 'ACHITAT') {
        paid += val;
      } else {
        unpaid += val;
      }
    }

    this.chartDataPaidUnpaid = {
      labels: ['Plătite', 'Neplătite'],
      datasets: [
        {
          data: [paid, unpaid],
          backgroundColor: ['#28a745', '#dc3545'],
        },
      ],
    };

    this.chartPaidUnpaidOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return context.label + ': ' + context.parsed + ' RON';
            },
          },
        },
      },
    };
  }

  initChartOptions() {
    this.chartMonthOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              console.log(context);
              let label = context.dataset.label || '';

              if (label) {
                label += ': ';
              }
              if (context.parsed.r !== null) {
                label += context.parsed.r + ' RON';
              }
              return label;
            },
          },
        },
      },
    };
  }

  initFilterChartOptions() {
    this.chartFilterOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: any) => {
              let label = context.dataset.label || '';

              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y + ' RON';
              }
              return label;
            },
          },
        },
      },
    };
  }

  applyFilters(): void {
    const [start, end] = this.selectedDates || [];
    this.filteredBills = this.bills.filter(
      (bill: any) =>
        bill.status === 'ACHITAT' &&
        (!this.selectedType || bill.type === this.selectedType) &&
        (!start || new Date(bill.invoiceDate) >= start) &&
        (!end || new Date(bill.invoiceDate) <= end)
    );

    const grouped = this.filteredBills.reduce((acc: any, bill: any) => {
      acc[bill.invoiceDate] = (acc[bill.invoiceDate] || 0) + bill.paymentValue;
      return acc;
    }, {} as Record<string, number>);

    if (Object.values(grouped).length === 0) {
      this.noData = true;
    }

    this.chartDataFiltered = {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: 'Suma achitată',
          backgroundColor: ['#80C8F1'],
          data: Object.values(grouped),
        },
      ],
    };
    this.showChart = true;
  }

  onChangeType() {
    this.selectedDates = [];
    this.chartDataFiltered = null;
    this.showChart = false;
    this.noData = false;
  }

  onBack() {
    this.router.navigate(['apartments']);
  }
}
