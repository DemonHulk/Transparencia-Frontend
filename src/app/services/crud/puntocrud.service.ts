import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, token } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuntocrudService {

  constructor(private clientHttp:HttpClient) { }


    /*extrae todos los puntos estan activos o desactivados */GetAllPuntosService() {
  const headers = this.createHeaders();
  return this.clientHttp.get(API_URL + "punto", { headers: headers, responseType: 'text' });
}

GetOnePuntoService(id: any) {
  const headers = this.createHeaders();
  return this.clientHttp.get(API_URL + "punto/" + id, { headers: headers, responseType: 'text' });
}

DeletePuntoService(id: any): Observable<any> {
  const headers = this.createHeaders();
  return this.clientHttp.delete(API_URL + "punto/" + id, { headers: headers, responseType: 'text' });
}

ActivatePuntoService(id: any): Observable<any> {
  const headers = this.createHeaders();
  return this.clientHttp.get(API_URL + "puntoAct/" + id, { headers: headers, responseType: 'text' });
}

InsertPuntoService(formulario: any): Observable<any> {
  const headers = this.createHeaders();
  const req = new HttpRequest('POST', API_URL + "punto", formulario, {
    headers: headers,
    reportProgress: true,
    responseType: 'text'
  });
  return this.clientHttp.request(req);
}

UpdatePuntoService(formulario: any, id: any): Observable<any> {
  const headers = this.createHeaders();
  const req = new HttpRequest('PUT', API_URL + "punto/" + id, formulario, {
    headers: headers,
    reportProgress: true,
    responseType: 'text'
  });
  return this.clientHttp.request(req);
}

/*extrae todos los puntos estan activos y tengan la area del usuario en sesión*/
GetPuntosUserService(id: any) {
  const headers = this.createHeaders();
  return this.clientHttp.get(API_URL + "puntoUser/" + id, { headers: headers, responseType: 'text' });
}

UpdateOrderService(data: any): Observable<any> {
  const headers = this.createHeaders();
  const req = new HttpRequest('POST', API_URL + "orderPuntos", data, {
    headers: headers,
    reportProgress: true,
    responseType: 'text'
  });
  return this.clientHttp.request(req);
}


    private createHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Authorization': `${token}`
      });
    }
}
