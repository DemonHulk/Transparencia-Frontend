import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContenidocrudService {

  constructor(private clientHttp:HttpClient) { }
/***************************************************************************************************
*  CONTENIDO DINAMICO                                                                               *
***************************************************************************************************/ 
  /**EXTRAE TODO EL CONTENIDO DINAMICO ESTE ACTIVO O INACTIVO */
  GetAllContenidoDinamicoService(id:any){
    return this.clientHttp.get(API_URL+"contenidoDinamico/"+id, { responseType: 'text' })
  }

  GetOneContenidoDinamicoService(id:any){
    return this.clientHttp.get(API_URL+"onecontenidoDinamico/"+id, { responseType: 'text' });
  }
  
  InsertContenidoDinamicoService(formData: FormData): Observable<any> {
    const req = new HttpRequest('POST', API_URL + 'contenidoDinamico', formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  UpdateContenidoDinamicoService(formData: FormData, id: any): Observable<any> {
    const req = new HttpRequest('POST', API_URL + "UpdatecontentDinamico/"+ id, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  DeleteContenidoDinamicoService(id: any): Observable<any> {
    return this.clientHttp.delete(API_URL + "contenidoDinamico/" + id, { responseType: 'text' });
  }

  ActivateContenidoDinamicoService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "contenidoDinamicoAct/" + id, { responseType: 'text' });
  }


  /***************************************************************************************************
  *  CONTENIDO ESTATICO                                                                              *
  ***************************************************************************************************/
 
  GetAllContenidoEstaticoService(id:any){
    return this.clientHttp.get(API_URL+"contenidoEstatico/"+id, { responseType: 'text' })
  } 

  GetOneContenidoEstaticoService(id:any){
    return this.clientHttp.get(API_URL+"oneContenidoEstatico/"+id, { responseType: 'text' });
  }
  
  InsertContenidoEstaticoService(formulario: any): Observable<any> {
    const req = new HttpRequest('POST',API_URL + "contenidoEstatico", formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  UpdateContenidoEstaticoService(formulario: any, id: any): Observable<any> {
    const req = new HttpRequest('PUT', API_URL + "UpdatecontentEstatico/"+ id, formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  DeleteContenidoEstaticoService(id: any): Observable<any> {
    return this.clientHttp.delete(API_URL + "contenidoEstatico/" + id, { responseType: 'text' });
  }

  ActivateContenidoEstaticoService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "contenidoEstaticoAct/" + id, { responseType: 'text' });
  }

}
