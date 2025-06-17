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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Bills } from 'src/app/utils/interfaces/bills';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { BillsService } from 'src/app/utils/services/bills.service';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-bills-modal',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    CommonModule,
    DropdownModule,
    CalendarModule,
  ],
  templateUrl: './bills-modal.component.html',
  styleUrl: './bills-modal.component.scss',
})
export class BillsModalComponent {
  @Input() displayModal: boolean = false;
  @Input() selectedBill: Bills | null = null;
  @Input() apCode: string = '';
  @Output() displayModalChange = new EventEmitter<boolean>();
  @Output() reloadTable = new EventEmitter<boolean>()

  uploadedFileName: string | null = null;
  billsForm!: FormGroup;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder, private billsService: BillsService) {
    this.billsForm = this.fb.group({
      type: [{ value: '', disabled: false }],
      number: [{ value: '', disabled: false }],
      oldIndex: [{ value: '', disabled: false }],
      newIndex: [{ value: '', disabled: false }],
      amountConsumed: [{ value: '', disabled: false }],
      invoiceDate: [{ value: '', disabled: false }],
      dueDate: [{ value: '', disabled: false }],
      paymentValue: [{ value: '', disabled: false }],
      apartmentsCode: [{ value: '' }],
      pdf: [],
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayModal'] && this.displayModal) {
      if (this.selectedBill) {
        this.isEditing = true;
        this.billsForm.patchValue({
          ...this.selectedBill,
          invoiceDate: new Date(this.selectedBill.invoiceDate),
          dueDate: new Date(this.selectedBill.dueDate),
        });
      } else {
        this.isEditing = false;
        this.billsForm.reset();
      }
    }
  }

  toggleEdit() {
    const raw = this.billsForm.getRawValue();

    const formData = new FormData();
    formData.append(
      'bills',
      JSON.stringify({
        type: raw.type,
        number: raw.number,
        oldIndex: raw.oldIndex,
        newIndex: raw.newIndex,
        amountConsumed: raw.amountConsumed,
        invoiceDate: this.formatDateToISODate(raw.invoiceDate),
        dueDate: this.formatDateToISODate(raw.dueDate),
        paymentValue: raw.paymentValue,
      })
    );

    if (raw.pdf) {
      formData.append('pdfFile', raw.pdf, this.uploadedFileName || 'file.pdf');
    }

    if (this.selectedBill && this.selectedBill.id) {
      this.billsService.updateBill(this.selectedBill.id, formData).subscribe({
        next: () => { this.closeModal(), this.reloadTable.emit(true) },
        error: (err) => console.error('Update bill error:', err),
      });
    } else {
      this.billsService.addBill(formData).subscribe({
        next: () => { this.closeModal(), this.reloadTable.emit(true) },
        error: (err) => console.error('Add bill error:', err),
      });
    }
  }

  formatDateToISODate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${day}/${month}/${d.getFullYear()}`;
  }

  onFileSelect(event: any) {
    const file = event.files?.[0];
    if (file && file.type === 'application/pdf') {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const arrayBuffer = fileReader.result as ArrayBuffer;
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

        this.uploadedFileName = file.name;
        this.billsForm.patchValue({ pdf: blob });
      };

      fileReader.readAsArrayBuffer(file);
    }
  }

  closeModal() {
    this.displayModal = false;
    this.uploadedFileName = ''
    this.displayModalChange.emit(this.displayModal);
  }

  onCancel() {
    this.closeModal();
  }
}
