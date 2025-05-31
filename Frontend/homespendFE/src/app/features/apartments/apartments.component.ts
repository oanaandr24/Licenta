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

@Component({
  selector: 'app-apartments',
  imports: [[
    CommonModule,
    CardModule,
    ButtonModule,
    HeaderComponent,
    MenuComponent,
    AddHouseModalComponent
  ]],
  templateUrl: './apartments.component.html',
  styleUrl: './apartments.component.scss'
})
export class ApartmentsComponent implements OnInit {

  apartments: Apartments[] = [];
  userCode!: string;
  displayModal: boolean = false

  constructor(
    private apartmentService: ApartmentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userCode = localStorage.getItem('userCode')!;
    if (this.userCode) {
      this.apartmentService.getApartmentsByUserCode(this.userCode).subscribe({
        next: (response) => {
          console.log('Apartamente:', response);
          this.apartments = response
        },
        error: (error) => {
          console.error('Eroare:', error);
        }
      })
    }
  }

  showBills(ap: any) {
    this.router.navigate(['bills'], {
      state: {ap: ap}
    })
  }

  addHouse() {
    this.displayModal = true;
  }
}
