import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ApartmentsComponent } from './apartments/apartments.component';
import { BillsComponent } from './bills/bills.component';
import { AuthGuard } from './core/auth-guard';

export const routes: Routes = [
{ path: 'apartments', component: ApartmentsComponent, canActivate: [AuthGuard]},
{ path: 'bills', component: BillsComponent, canActivate: [AuthGuard] },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent }, 
{ path: '', redirectTo: 'login', pathMatch: 'full' }, 
];
