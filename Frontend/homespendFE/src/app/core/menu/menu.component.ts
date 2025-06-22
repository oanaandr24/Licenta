import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menu',
  imports: [MenuModule, CommonModule, MenubarModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  items: MenuItem[] | undefined;
  userRole: any = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.userRole = sessionStorage.getItem('role');

    this.items = [
      {
        label: 'Locuințe',
        icon: 'pi pi-home',
        route: '/apartments',
      },
      {
        label: 'Facturi',
        icon: 'pi pi-receipt',
        route: '/bills',
      },
      ...(this.userRole === 'ADMIN'
        ? [
            {
              label: 'Indexuri',
        icon: 'pi pi-barcode',
        route: '/indexes',
            },
          ]
        : []),
      ...(this.userRole !== 'ADMIN'
        ? [
            {
              label: 'Statistici',
              icon: 'pi pi-chart-bar',
              route: '/stats',
            },
          ]
        : []),
      {
        label: 'Profil',
        icon: 'pi pi-user',
        url: '/profile',
      },
    ];
  }
}
