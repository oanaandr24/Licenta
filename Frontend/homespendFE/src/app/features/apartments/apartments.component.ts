import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from 'src/app/core/header/header.component';
import { Apartments } from 'src/app/utils/interfaces/apartments';
import { ApartmentService } from 'src/app/utils/services/apartments.service';
import { MenuComponent } from 'src/app/core/menu/menu.component';
import { AddHouseModalComponent } from '../modals/add-house-modal/add-house-modal.component';
import { AddApartmentByAdminComponent } from '../modals/add-apartment-by-admin/add-apartment-by-admin.component';

@Component({
  selector: 'app-apartments',
  imports: [
    [
      CommonModule,
      CardModule,
      ButtonModule,
      HeaderComponent,
      MenuComponent,
      AddHouseModalComponent,
      AddApartmentByAdminComponent,
    ],
  ],
  templateUrl: './apartments.component.html',
  styleUrl: './apartments.component.scss',
})
export class ApartmentsComponent implements OnInit {
  apartments: Apartments[] = [];
  userCode!: string;
  userRole!: any;
  displayModal: boolean = false;
  displayModalAddApartment: boolean = false;

  constructor(
    private apartmentService: ApartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userCode = localStorage.getItem('userCode')!;
    this.userRole = sessionStorage.getItem('role');
    this.showApartments()
  }

  showApartments() {
    if (this.userCode && this.userRole === 'LOCATAR') {
      this.apartmentService.getApartmentsByUserCode(this.userCode).subscribe({
        next: (response) => {
          console.log('Apartamente:', response);
          this.apartments = response;
        },
        error: (error) => {
          console.error('Eroare:', error);
        },
      });
    }

    if (this.userRole === 'ADMIN') {
      this.apartmentService.getApartmentsByUserRole(this.userCode).subscribe({
        next: (response) => {
          console.log('Apartamente:', response);
          this.apartments = response;
        },
        error: (error) => {
          console.error('Eroare:', error);
        },
      });
    }
  }

  showBills(ap: any) {
    this.router.navigate(['bills'], {
      state: { ap: ap },
    });
  }

  addApartmentToUser() {
    this.displayModalAddApartment = true;
  }

  addHouse() {
    this.displayModal = true;
  }

  reloadTable(event: any) {
    if (event) {
      this.showApartments();
    }
  }
}
