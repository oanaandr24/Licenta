import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Apartments } from "../interfaces/apartments";


@Injectable({ providedIn: 'root' })
export class ApartmentService {
  private apiServerUrl = environment.apiBaseUrl;
  
  constructor(private http: HttpClient) {}

  getApartmentsByUserCode(userCode: string): Observable<Apartments[]> {
    return this.http.get<Apartments[]>(`${this.apiServerUrl}/apartments/user/${userCode}`);
  }
}
