import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address_city: ['', Validators.required],
      address_street: ['', Validators.required],
      address_block: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    const registerData = this.registerForm.value;
    console.log('Date trimise la backend:', registerData);
    this.userService.register(registerData).subscribe({
        next: (response) => {
          console.log('Înregistrare reușită');
          this.errorMessage = null;
          this.successMessage = 'Înregistrare reușită! Vei fi redirecționat către login...';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Eroare la înregistrare:', error);
          this.successMessage = null;
          this.errorMessage = 'Email-ul/Telefonul este deja folosit sau alte date sunt greșite!';
        }
      });
  }
}
