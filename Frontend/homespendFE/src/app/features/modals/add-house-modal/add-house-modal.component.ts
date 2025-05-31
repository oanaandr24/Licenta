import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ApartmentService } from 'src/app/utils/services/apartments.service';

@Component({
  selector: 'app-add-house-modal',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
  ],
  templateUrl: './add-house-modal.component.html',
  styleUrl: './add-house-modal.component.scss',
})
export class AddHouseModalComponent {
  @Input() displayModal: boolean = false;
  @Output() reloadTable = new EventEmitter<boolean>();
  @Output() displayModalChange = new EventEmitter<boolean>()

  houseForm!: FormGroup;

  constructor(private fb: FormBuilder, private apService: ApartmentService) {
    this.houseForm = this.fb.group({
      address_city: [''],
      address_street: [''],
      surface: [''],
    });
  }

 closeModal() {
    this.displayModal = false;
    this.displayModalChange.emit(this.displayModal);
  }

  addHouse() {
    let userEmail = sessionStorage.getItem('email')
  let requestBody = {
        address_city: this.houseForm.controls['address_city'].value,
        address_street: this.houseForm.controls['address_street'].value,
        surface: this.houseForm.controls['surface'].value,
     }

    this.apService.addHouseByEmail(userEmail, requestBody).subscribe(data => {
      console.log(data)
    })
  }
}
