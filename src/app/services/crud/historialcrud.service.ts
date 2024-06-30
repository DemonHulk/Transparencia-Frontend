import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialcrudService {

  constructor(private clientHttp:HttpClient) { }

  GetAllHistorialNoVistoService(){
    return this.clientHttp.get(API_URL+"historial", { responseType: 'text' })
  }

  // Marca un mensaje como visto
  VerMensajeService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "verHistorial/" + id, { responseType: 'text' });
  }

  DeleteHistorialService(id: any): Observable<any> {
    return this.clientHttp.delete(API_URL + "historial/" + id, { responseType: 'text' });
  }

  ActivateHistorialService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "historialAct/" + id, { responseType: 'text' });
  }

}

