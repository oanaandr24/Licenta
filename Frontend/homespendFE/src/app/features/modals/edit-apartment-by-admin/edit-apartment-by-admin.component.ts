import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Apartments } from 'src/app/utils/interfaces/apartments';
import { ApartmentService } from 'src/app/utils/services/apartments.service';

@Component({
  selector: 'app-edit-apartment-by-admin',
  imports: [
    DialogModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-apartment-by-admin.component.html',
  styleUrl: './edit-apartment-by-admin.component.scss',
})
export class EditApartmentByAdminComponent {
  @Input() displayModal: boolean = false;
  @Input() apartmentData: Apartments | null = null;
  @Output() reloadTable = new EventEmitter<boolean>();
  @Output() displayModalChange = new EventEmitter<boolean>();

  apartmentForm!: FormGroup;
  userEmail: string = '';

  constructor(private fb: FormBuilder, private apService: ApartmentService) {
    this.apartmentForm = this.fb.group({
      address_block: [''],
      address_city: [''],
      address_street: [''],
      surface: [''],
      administratorCode: [''],
      administrator: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['apartmentData'] && changes['apartmentData'].currentValue) {
      if (this.apartmentData) {
        this.apartmentForm.patchValue({
          address_block: this.apartmentData.address_block,
          address_city: this.apartmentData.address_city,
          address_street: this.apartmentData.address_street,
          surface: this.apartmentData.surface
        });
      }
    }
  }

  closeModal() {
    this.displayModal = false;
    this.displayModalChange.emit(this.displayModal);
  }

  addApartmentToUser() {
    let requestBody = {
      address_block: this.apartmentForm.controls['address_block'].value,
      address_city: this.apartmentForm.controls['address_city'].value,
      address_street: this.apartmentForm.controls['address_street'].value,
      surface: this.apartmentForm.controls['surface'].value
    };

    this.apService.editHouse(this.apartmentData?.id, requestBody).subscribe((data) => {
      this.apartmentForm.reset();
      this.userEmail = '';
      this.displayModal = false;
      this.reloadTable.emit(true);
    });
  }
}
