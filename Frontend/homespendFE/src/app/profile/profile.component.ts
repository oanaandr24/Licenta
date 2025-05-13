import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    ButtonModule,
    CardModule,
    AvatarModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profileForm!: FormGroup;

  username: any = '';
  userId: any = 0;
  role: any = '';

  isEditing = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.profileForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email],],
      phone: [{ value: '', disabled: true }, Validators.required],
      password: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }],
      userCode: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    this.userId = sessionStorage.getItem('id');

    this.getUserData();
  }

  getUserData() {
    this.userService.getUserById(this.userId).subscribe({
      next: (data: any) => {
        this.username = data['name'];
        this.role = data['role'];

        const userData = {
          id: data['id'],
          name: data['name'],
          email: data['email'],
          phone: data['phone'],
          password: data['password'],
          role: data['role'],
          userCode: data['userCode'],
        };

        this.profileForm.patchValue(userData);
      },
    });
  }

  toggleEdit() {
    if (this.isEditing) {
      if (this.profileForm.valid) {
        const updatedUser: User = this.profileForm.value;

        this.userService.updateUser(updatedUser).subscribe({
          next: (response) => {
            sessionStorage.setItem('name', this.profileForm.controls['name'].value)
            console.log('User updated:', response);
            this.profileForm.disable();
            this.isEditing = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Succes',
              detail: 'Profilul a fost actualizat!',
            });
          },
          error: (err) => {
            console.error('Failed to update user:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Eroare',
              detail: 'Actualizarea profilului a eșuat.',
            });
          },
        });
      }
    } else {
      this.profileForm.enable();
      this.isEditing = true;
    }
  }

  goToApartments() {
    this.router.navigate(['apartments']);
  }

  goToStats() {
    this.router.navigate(['stats'])
  }

  onBack() {
    this.router.navigate(['apartments']);
  }
}
