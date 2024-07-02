import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, token } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaCrudService {


  constructor(private clientHttp:HttpClient) { }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `${token}`
    });
  }

  /**EXTRAE TODAS LAS AREAS ESTEN ACTIVAS O INACTIVAS */
  GetAllAreaService(){
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "area", { headers: headers, responseType: 'text' });
  }

  /**EXTRAE LAS AREAS ACTIVAS */
  GetActAreaService(){
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "areaAct", { headers: headers, responseType: 'text' });
  }

  GetOneAreaService(id:any){
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "area/" + id, { headers: headers, responseType: 'text' });
  }

  /**PARA SACAR LAS AREAS QUE TIENE UN PUNTO EN ESPECIFICO EL _PUNTO DICE QUE SE ESTA FILTRANDO POR PUNTO*/
  GetAreasPunto_PuntoService(id:any){
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "areapunto_punto/" + id, { headers: headers, responseType: 'text' });
  }

  InsertAreaService(formulario: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('POST', API_URL + 'area', formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  UpdateAreaService(formulario: any, id: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('PUT', API_URL + "area/" + id, formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  DeleteAreaService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.delete(API_URL + "area/" + id, { headers: headers, responseType: 'text' });
  }

  ActivateAreaService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "areaAct/" + id, { headers: headers, responseType: 'text' });
  }





}

