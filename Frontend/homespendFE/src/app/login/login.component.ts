import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,         // Necesare pentru *ngIf, *ngFor etc.
    ReactiveFormsModule   // 🔑 Trebuie pentru formGroup, formControlName
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router // Injectăm router-ul pentru redirect
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = this.loginForm.value;

    // Apelăm API-ul backend
    this.http.post('http://localhost:8090/user/login', loginData, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Login reușit:', response);
          this.errorMessage = null;
          // Dacă login-ul este reușit, putem salva un token, de exemplu:
          localStorage.setItem('authToken', response);  // Sau orice altceva
          this.router.navigate(['/dashboard']);  // Redirect către pagina de dashboard
        },
        error: (error) => {
          console.error('Eroare la login:', error);
          this.errorMessage = 'Email sau parolă greșite!';
        }
      });
  }
}
