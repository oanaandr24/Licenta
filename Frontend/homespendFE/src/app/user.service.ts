import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient){}

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/user/all`);
  }

  public getUserById(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/user/find/${userId}`);
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user/add`, user);
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}/user/update`, user);
  }

  public deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/user/delete/${userId}`);
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user/register`, user); 
  }

  public login(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user/login`, user);
  }

  //public getUserApartments(userId: number): Observable<any[]> {
  //  return this.http.get<any[]>(`${this.apiServerUrl}/apartments/user/${userId}`);
  //}

}
