import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../core/header/header.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/utils/services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/auth.service';

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
    CommonModule,
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profileForm!: FormGroup;

  username: string = '';
  userId: any = 0;
  role: string = '';
  userRole: string = '';
  isEditing = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: [{ value: '', disabled: true }, Validators.required],
      password: [{ value: '', disabled: true }],
      confirmPassword: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }],
      userCode: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    this.userId = sessionStorage.getItem('id');
    this.userRole = sessionStorage.getItem('role') ?? '';
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
          password: '',
          confirmPassword: '',
          role: data['role'],
          userCode: data['userCode'],
        };

        this.profileForm.patchValue(userData);
      },
      error: (err) => {
        console.error('Eroare la preluarea datelor utilizatorului:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Eroare',
          detail: 'Nu s-au putut încărca datele utilizatorului.',
        });
      },
    });
  }

  toggleEdit() {
    if (this.isEditing) {
      if (this.profileForm.valid) {
        const password = this.profileForm.controls['password'].value;
        const confirmPassword = this.profileForm.controls['confirmPassword'].value;

        if (password || confirmPassword) {
          if (password !== confirmPassword) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Parolele nu coincid',
              detail: 'Câmpurile Parola Nouă și Rescrie Parola trebuie să fie identice.',
            });
            return;
          }

          const passwordValid = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);
          if (!passwordValid) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Parolă invalidă',
              detail: 'Parola trebuie să aibă cel puțin 6 caractere, o literă mică și o literă mare.',
            });
            return;
          }
        }

        const updatedUser: any = {
          name: this.profileForm.controls['name'].value,
          email: this.profileForm.controls['email'].value,
          phone: this.profileForm.controls['phone'].value,
        };

        if (password && password.trim() !== '') {
          updatedUser.password = password;
        }

        this.userService.updateUserById(this.userId, updatedUser).subscribe({
          next: () => {
            sessionStorage.setItem('name', updatedUser.name);
            this.profileForm.disable();
            this.isEditing = false;
            this.profileForm.controls['password'].setValue('');
            this.profileForm.controls['confirmPassword'].setValue('');

            this.messageService.add({
              severity: 'success',
              summary: 'Succes',
              detail: 'Profilul a fost actualizat!',
            });

            window.location.reload();
          },
          error: (err) => {
            console.error('Actualizarea profilului a eșuat:', err);
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
      this.profileForm.controls['password'].setValue('');
      this.profileForm.controls['confirmPassword'].setValue('');
    }
  }

  goToApartments() {
    this.router.navigate(['apartments']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  onBack() {
    this.router.navigate(['apartments']);
  }
}
