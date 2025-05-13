import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ApartmentsComponent } from './apartments/apartments.component';
import { BillsComponent } from './bills/bills.component';
import { AuthGuard } from './core/auth-guard';
import { ProfileComponent } from './profile/profile.component';
import { StatisticsComponent } from './statistics/statistics.component';

export const routes: Routes = [
{ path: 'apartments', component: ApartmentsComponent},
{ path: 'bills', component: BillsComponent},
{ path: 'stats', component: StatisticsComponent }, 
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent }, 
{ path: 'profile', component: ProfileComponent }, 
{ path: '', redirectTo: 'login', pathMatch: 'full' }, 
];
