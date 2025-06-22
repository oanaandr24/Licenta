import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/user/all`);
  }

  public getUserById(userId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/user/find/${userId}`);
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user/add`, user);
  }

  public updateUserById(userId: any, user: any): Observable<User> {
    return this.http.patch<User>(`${this.apiServerUrl}/user/patch/id/${userId}`, user);
  }

  public updateUserByEmail(user: User): Observable<User> {
    return this.http.patch<User>(`${this.apiServerUrl}/user/update`, user);
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
}
