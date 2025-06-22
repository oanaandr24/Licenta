import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ApartmentService } from 'src/app/utils/services/apartments.service';

interface House {
  id: number;
  address_city: string;
  address_street: string;
  surface: number;
}

@Component({
  selector: 'app-edit-house-modal',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
  ],
  templateUrl: './edit-house-modal.component.html',
  styleUrl: './edit-house-modal.component.scss',
})
export class EditHouseModalComponent {
  @Input() displayModal: boolean = false;
  @Input() houseData: House | null = null;
  @Output() reloadTable = new EventEmitter<boolean>();
  @Output() displayModalChange = new EventEmitter<boolean>();

  houseForm!: FormGroup;

  constructor(private fb: FormBuilder, private apService: ApartmentService) {
    this.houseForm = this.fb.group({
      address_city: [''],
      address_street: [''],
      surface: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['houseData'] && changes['houseData'].currentValue) {
      if (this.houseData) {
        this.houseForm.patchValue({
          address_city: this.houseData.address_city,
          address_street: this.houseData.address_street,
          surface: this.houseData.surface,
        });
      }
    }
  }

  closeModal() {
    this.houseForm.reset();
    this.displayModal = false;
    this.displayModalChange.emit(this.displayModal);
  }

  editHouse() {
    let requestBody = {
      address_city: this.houseForm.controls['address_city'].value,
      address_street: this.houseForm.controls['address_street'].value,
      surface: this.houseForm.controls['surface'].value,
    };

    this.apService
      .editHouse(this.houseData?.id, requestBody)
      .subscribe((data) => {
        this.houseForm.reset();
        this.displayModal = false;
        this.reloadTable.emit(true);
      });
  }
}
