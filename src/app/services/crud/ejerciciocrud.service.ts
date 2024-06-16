import { HttpClient } from '@angular/common/http';
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
    return this.clientHttp.post(API_URL + "ejercicio", formulario, { responseType: 'text' });
  }

  UpdateEjercicioService(formulario: any, id: any): Observable<any> {
    return this.clientHttp.put(API_URL + "ejercicio/"+ id, formulario, { responseType: 'text' });
  }

  DeleteEjercicioService(id: any): Observable<any> {
    return this.clientHttp.delete(API_URL + "ejercicio/" + id, { responseType: 'text' });
  }

  ActivateEjercicioService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "ejercicioAct/" + id, { responseType: 'text' });
  }
}
