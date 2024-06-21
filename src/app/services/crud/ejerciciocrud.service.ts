import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EjerciciocrudService {

  constructor(private clientHttp:HttpClient) { }

  GetAllEjercicioService(){
    return this.clientHttp.get(API_URL+"ejercicio", { responseType: 'text' })
  }

  GetOneEjercicioService(id:any){
    return this.clientHttp.get(API_URL+"ejercicio/"+id, { responseType: 'text' });
  }

  InsertEjercicioService(formulario: any): Observable<any> {
    const req = new HttpRequest('POST',API_URL + "ejercicio", formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  UpdateEjercicioService(formulario: any, id: any): Observable<any> {
    const req = new HttpRequest('PUT',API_URL + "ejercicio/"+ id, formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  DeleteEjercicioService(id: any): Observable<any> {
    return this.clientHttp.delete(API_URL + "ejercicio/" + id, { responseType: 'text' });
  }

  ActivateEjercicioService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "ejercicioAct/" + id, { responseType: 'text' });
  }
}
