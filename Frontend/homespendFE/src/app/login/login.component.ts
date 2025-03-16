import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
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
    this.userService.login(loginData).subscribe({
        next: (response) => {
          console.log('Login reușit:', response);
          this.errorMessage = null;
          // Dacă login-ul este reușit, putem salva un token, de exemplu:
          localStorage.setItem('authToken',  JSON.stringify(response));  // Sau orice altceva
          this.router.navigate(['/dashboard']);  // Redirect către pagina de dashboard
        },
        error: (error) => {
          console.error('Eroare la login:', error);
          this.errorMessage = 'Email sau parolă greșite!';
        }
      });
  }
}
