import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    AvatarModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  username: any = ''

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.username = sessionStorage.getItem('name')
  }

  goToProfile() {
    this.router.navigate(['profile'])
  }
}
