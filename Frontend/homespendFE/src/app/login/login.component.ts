import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  //encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    InputTextModule,
    FloatLabelModule
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private authService: AuthService 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.authService.setAuthenticated(false); 
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = this.loginForm.value;

    // Apelăm API-ul backend
    this.userService.login(loginData).subscribe({
        next: (response) => {
          this.authService.setAuthenticated(true); 
          console.log('Login reușit:', response);

          sessionStorage.setItem('id', JSON.stringify(response.id))
          sessionStorage.setItem('name', response.name)
          sessionStorage.setItem('role', response.role)
          sessionStorage.setItem('phone', response.phone)
          sessionStorage.setItem('email', response.email)

          this.errorMessage = null;
          // Dacă login-ul este reușit, putem salva un token, de exemplu:
          localStorage.setItem('authToken',  JSON.stringify(response));
          if (response.userCode) {
            localStorage.setItem('userCode', response.userCode);
          }
          this.router.navigate(['/apartments']);
          //this.router.navigate(['/dashboard']);  // Redirect către pagina de dashboard
        },
        error: (error) => {
          this.authService.setAuthenticated(false); 
          console.error('Eroare la login:', error);
          this.errorMessage = 'Email sau parolă greșite!';
        }
      });
  }
}
