import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Apartments } from '../interfaces/apartments';

@Injectable({ providedIn: 'root' })
export class ApartmentService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getApartmentsByUserCode(userCode: string): Observable<Apartments[]> {
    return this.http.get<Apartments[]>(
      `${this.apiServerUrl}/apartments/user/${userCode}`
    );
  }

  addHouseByEmail(email: any, house: any): Observable<Apartments[]> {
    return this.http.post<Apartments[]>(
      `${this.apiServerUrl}/apartments/add/${email}`,
      house
    );
  }

  getApartmentsByUserRole(adminCode: string): Observable<Apartments[]> {
    return this.http.get<Apartments[]>(
      `${this.apiServerUrl}/apartments/admin/${adminCode}`
    );
  }

    addApartmentByAdmin(email: string, apartment: any): Observable<Apartments[]> {
    return this.http.post<Apartments[]>(
      `${this.apiServerUrl}/apartments/add/${email}`, apartment
    );
  }
}
