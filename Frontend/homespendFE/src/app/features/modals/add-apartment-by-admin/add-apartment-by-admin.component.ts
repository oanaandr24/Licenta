import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ApartmentService } from 'src/app/utils/services/apartments.service';

@Component({
  selector: 'app-add-apartment-by-admin',
  imports: [
    DialogModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-apartment-by-admin.component.html',
  styleUrl: './add-apartment-by-admin.component.scss',
})
export class AddApartmentByAdminComponent {
  @Input() displayModalAddApartment: boolean = false;
  @Output() reloadTable = new EventEmitter<boolean>();
  @Output() displayModalChange = new EventEmitter<boolean>();

  apartmentForm!: FormGroup;
  userEmail: string = ''

  constructor(private fb: FormBuilder, private apService: ApartmentService) {
    this.apartmentForm = this.fb.group({
      address_block: [''],
      address_city: [''],
      address_street: [''],
      surface: [''],
      administratorCode: [''],
      administrator: ['']
    });
  }

  closeModal() {
    this.displayModalAddApartment = false;
    this.displayModalChange.emit(this.displayModalAddApartment);
  }

  addApartmentToUser() {
    let requestBody = {
      address_block: this.apartmentForm.controls['address_block'].value,
      address_city: this.apartmentForm.controls['address_city'].value,
      address_street: this.apartmentForm.controls['address_street'].value,
      surface: this.apartmentForm.controls['surface'].value,
      administratorCode: localStorage.getItem('userCode'),
      administrator: sessionStorage.getItem('name')
    };

    this.apService
      .addApartmentByAdmin(this.userEmail, requestBody)
      .subscribe((data) => {
        this.apartmentForm.reset();
        this.userEmail = ''
        this.displayModalAddApartment = false;
        this.reloadTable.emit(true)
      });
  }
}
