import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL, token } from '../api-config';

@Injectable({
  providedIn: 'root'
})
export class TituloscrudService {

  constructor(private clientHttp:HttpClient) { }


  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `${token}`
    });
  }

  InsertTitulosService(formulario: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('POST', API_URL + 'titulos', formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  InsertSubtituloService(formulario: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('POST', API_URL + 'subtitulo', formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  /**extrae los titulos de un punto*/
  GetTitulosPunto(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "titulosdepunto/" + id, { headers: headers, responseType: 'text' });
  }

  GetTitulosPadre(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "tituloPadre/" + id, { headers: headers, responseType: 'text' });
  }

  GetSubtituloData(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "subtituloData/" + id, { headers: headers, responseType: 'text' });
  }

  /**extrae los datos de un titulo + nombre del punto a que pertenece e id*/
  GettitulosmaspuntoService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "titulosmaspunto/" + id, { headers: headers, responseType: 'text' });
  }

  DeleteTituloService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.delete(API_URL + "titulos/" + id, { headers: headers, responseType: 'text' });
  }

  ActivateTituloService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "titulosAct/" + id, { headers: headers, responseType: 'text' });
  }

  UpdateTituloService(formulario: any, id: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('PUT', API_URL + "titulos/" + id, formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  UpdateSubtituloService(formulario: any, id: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('PUT', API_URL + "subtitulo/" + id, formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  GetTitulosByPunto(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "titulosCompletos/" + id, { headers: headers, responseType: 'text' });
  }

  GetSubtitulosByTitulo(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "subtitulosPorTema/" + id, { headers: headers, responseType: 'text' });
  }

  GetTituloById(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "titulo/" + id, { headers: headers, responseType: 'text' });
  }


    /**Inserta un titulo dentro de un punto que viene en el formulario*/


}
