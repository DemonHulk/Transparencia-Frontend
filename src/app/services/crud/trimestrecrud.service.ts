import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, token } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrimestrecrudService {

  constructor(private clientHttp:HttpClient) { }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `${token}`
    });
  }

  GetAllTrimestreService() {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "trimestre", { headers: headers, responseType: 'text' });
  }

  InsertTrimestreService(formulario: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('POST', API_URL + "trimestre", formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  GetUsuariosArea() {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "usuario", { headers: headers, responseType: 'text' });
  }

  DeleteTrimestreService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.delete(API_URL + "trimestre/" + id, { headers: headers, responseType: 'text' });
  }

  ActivateTrimestreService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "trimestreAct/" + id, { headers: headers, responseType: 'text' });
  }

  GetOneTrimestreService(id: any) {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "trimestre/" + id, { headers: headers, responseType: 'text' });
  }

  UpdateTrimestreService(formulario: any, id: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('PUT', API_URL + "trimestre/" + id, formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

}
