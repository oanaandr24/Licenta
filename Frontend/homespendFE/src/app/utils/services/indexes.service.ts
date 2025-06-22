import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bills } from '../interfaces/bills';

@Injectable({
  providedIn: 'root',
})
export class IndexesService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  addIndex(data: { value: number; apartmentsCode: any; type: any }) {
    return this.http.post<any[]>(`${this.apiServerUrl}/index/add`, data);
  }

  getIndexes() {
    return this.http.get<any[]>(`${this.apiServerUrl}/index/all`);
  }

  getIndexesByApartmentCode(code: any) {
    return this.http.get<any[]>(
      `${this.apiServerUrl}/index/all/apartment/${code}`
    );
  }

  generateBill(index: any) {
    return this.http.post<Bills>(
      `${this.apiServerUrl}/bills/get-for-index`, index);
  }
}
