import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from './utils/interfaces/user';
import { UserService } from './utils/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
  //templateUrl: './app.component.html',
  //styleUrl: './app.component.scss'
})
 export class AppComponent {
 }
/*export class AppComponent implements OnInit {
  public users: User[] = [];
  constructor(private userService: UserService){}

  ngOnInit() {
    this.getUsers();
  }

public getUsers(): void {
  this.userService.getUsers().subscribe(
    (response: User[]) => {
      this.users = response;
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}
}
*/


