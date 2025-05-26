import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bills } from '../interfaces/bills';


@Injectable({ providedIn: 'root'})
export class BillsService {
   private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getBillsByApartment(code: string): Observable<Bills[]> {
    return this.http.get<Bills[]>(`${this.apiServerUrl}/bills/all/apartment/${code}`);
  }
}
