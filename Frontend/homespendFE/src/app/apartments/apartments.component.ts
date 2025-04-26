import { Component, OnInit } from '@angular/core';
import { Apartments } from '../apartments';
import { ApartmentService } from '../apartments.service';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';  

@Component({
  selector: 'app-apartments',
  imports: [[CommonModule]],
  templateUrl: './apartments.component.html',
  styleUrl: './apartments.component.scss'
})
export class ApartmentsComponent implements OnInit {

  apartments: Apartments[] = [];
  userCode!: string;

  constructor(private apartmentService: ApartmentService) {}

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

}
