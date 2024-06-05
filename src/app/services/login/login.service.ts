import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost/transpariencia/Transparencia-Backend/index.php';
  constructor(private clientHttp:HttpClient) { }

  VerificarUser(datos: any): Observable<any> {
    return this.clientHttp.post<any>(`${this.apiUrl}/verificarUser`, datos);
  }
}
