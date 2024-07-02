import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, token } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EjerciciocrudService {

  constructor(private clientHttp:HttpClient) { }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `${token}`
    });
  }
  GetAllEjercicioService() {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "ejercicio", { headers: headers, responseType: 'text' });
  }

  GetOneEjercicioService(id: any) {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "ejercicio/" + id, { headers: headers, responseType: 'text' });
  }

  InsertEjercicioService(formulario: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('POST', API_URL + "ejercicio", formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  UpdateEjercicioService(formulario: any, id: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('PUT', API_URL + "ejercicio/" + id, formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  DeleteEjercicioService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.delete(API_URL + "ejercicio/" + id, { headers: headers, responseType: 'text' });
  }

  ActivateEjercicioService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "ejercicioAct/" + id, { headers: headers, responseType: 'text' });
  }

}
