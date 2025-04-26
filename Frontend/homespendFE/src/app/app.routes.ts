import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ApartmentsComponent } from './apartments/apartments.component';

export const routes: Routes = [
{ path: 'apartments', component: ApartmentsComponent },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent }, // dacă ai deja pagina de register
{ path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect inițial
];
