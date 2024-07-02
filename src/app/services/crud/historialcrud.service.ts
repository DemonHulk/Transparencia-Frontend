import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, token } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialcrudService {

  constructor(private clientHttp:HttpClient) { }
  GetAllHistorialNoVistoService(): Observable<any> {
    const headers = this.createHeaders(); // Obtener los encabezados con el token de autorización
    return this.clientHttp.get(API_URL + "historial", { headers: headers, responseType: 'text' });
  }

  VerMensajeService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "verHistorial/" + id, { headers: headers, responseType: 'text' });
  }

  DeleteHistorialService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.delete(API_URL + "historial/" + id, { headers: headers, responseType: 'text' });
  }

  ActivateHistorialService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "historialAct/" + id, { headers: headers, responseType: 'text' });
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `${token}`
    });
  }

}

