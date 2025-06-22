import { Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { RegisterComponent } from './core/register/register.component';
import { BillsComponent } from './features/bills/bills.component';
import { AuthGuard } from './core/auth-guard';
import { ProfileComponent } from './features/profile/profile.component';
import { StatisticsComponent } from './features/statistics/statistics.component';
import { ApartmentsComponent } from './features/apartments/apartments.component';
import { LayoutComponent } from './core/layout/layout.component';
import { IndexesComponent } from './features/indexes/indexes/indexes.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'apartments', component: ApartmentsComponent, canActivate: [AuthGuard] },
      { path: 'bills', component: BillsComponent, canActivate: [AuthGuard] },
      { path: 'indexes', component: IndexesComponent, canActivate: [AuthGuard] },
      { path: 'stats', component: StatisticsComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'login' },
];
