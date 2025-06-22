import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/core/header/header.component';
import { Apartments } from 'src/app/utils/interfaces/apartments';
import { ApartmentService } from 'src/app/utils/services/apartments.service';
import { AddHouseModalComponent } from '../modals/add-house-modal/add-house-modal.component';
import { AddApartmentByAdminComponent } from '../modals/add-apartment-by-admin/add-apartment-by-admin.component';
import { EditHouseModalComponent } from '../modals/edit-house-modal/edit-house-modal.component';
import { EditApartmentByAdminComponent } from '../modals/edit-apartment-by-admin/edit-apartment-by-admin.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

interface House {
  id: number,
  address_city: string;
  address_street: string;
  surface: number;
}

@Component({
  selector: 'app-apartments',
  imports: [
    [
      CommonModule,
      CardModule,
      ButtonModule,
      HeaderComponent,
      AddHouseModalComponent,
      AddApartmentByAdminComponent,
      EditHouseModalComponent,
      EditApartmentByAdminComponent,
      ConfirmDialogModule,
      ToastModule
    ],
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './apartments.component.html',
  styleUrl: './apartments.component.scss',
})
export class ApartmentsComponent implements OnInit {
  apartments: Apartments[] = [];
  userCode!: string;
  userRole!: any;
  displayModal: boolean = false;
  displayModalAddApartment: boolean = false;
  displayEditHouse: boolean = false;
  displayEditApartment: boolean = false;

  houseData: House | null = null
  apartmentData: Apartments | null = null

  constructor(
    private apartmentService: ApartmentService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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

  openEditHouseModal(ap: any) {
    this.houseData = ap;
    this.displayEditHouse = true
  }

  openEditApartmentModal(ap: any) {
    this.apartmentData = ap;
    this.displayEditApartment = true
  }

  deleteHome(ap: any) {
    this.apartmentService.deletHome(ap.apartmentsCode).subscribe(data => {
      this.reloadTable(true)
      this.messageService.add({
              severity: 'success',
              summary: 'Confirmat',
              detail: `Locuința a fost ștearsă.`,
            });
    })
  }

  deleteHomeConfirm(ap: any) {

    this.confirmationService.confirm({
      message: 'Confirmați ștergerea locuinței?',
      header: 'Confirmare',
      acceptIcon: 'none',
      acceptLabel: 'Da',
      rejectIcon: 'none',
      rejectLabel: 'Nu',
      rejectButtonStyleClass: 'p-button-text rejectButton',
      acceptButtonStyleClass: 'addButton',
      accept: () => {
        this.deleteHome(ap)
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Respins',
          detail: 'Ai anulat ștergerea locuinței.',
          life: 3000,
        });
      },
    });
  }


  reloadTable(event: any) {
    if (event) {
      this.showApartments();
    }
  }
}
