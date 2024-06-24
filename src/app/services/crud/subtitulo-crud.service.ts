import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubtituloCrudService {


  constructor(private clientHttp:HttpClient) { }


  /**Inserta un Subtema dentro de un punto y un Tema que viene en el formulario*/
  InsertSubtemaService(formulario: any): Observable<any> {
    const req = new HttpRequest('POST', API_URL + 'subtema', formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  // /**extrae los datos del titulo*/
  // GetOneTemaService(id:any): Observable<any> {
  //   return this.clientHttp.get(API_URL+"titulo/" + id, { responseType: 'text' })
  // }

  /**extrae Subtemas de un tema especifico*/
  GetSubtemasDelTemaService(id:any): Observable<any> {
    return this.clientHttp.get(API_URL+"subtemasdeltema/" + id, { responseType: 'text' })
  }


  
  DeleteSubtemaService(id: any): Observable<any> {
    return this.clientHttp.delete(API_URL + "subtema/" + id, { responseType: 'text' });
  }


  ActivateSubtemaService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "subtemaact/" + id, { responseType: 'text' });
  }
    
  UpdateSubtituloService(formulario: any, id: any): Observable<any> {
    const req = new HttpRequest('PUT', API_URL + "subtema/"+ id, formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

}
