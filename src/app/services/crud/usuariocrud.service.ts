import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, token } from '../api-config';
import { Observable } from 'rxjs';
import { CryptoServiceService } from '../cryptoService/crypto-service.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariocrudService {

  constructor(
    private clientHttp:HttpClient,
    private encodeService: CryptoServiceService
  ) { }

   /*extrae los usuarios que tienen un area un especifico activa*/
  GetUsuariosAccesoArea(id:any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "userAcces/" + id, { headers: headers, responseType: 'text' });
  }

  InsertUsuarioService(formulario: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('POST', API_URL + "usuario", formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  GetUsuariosArea(){
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "usuario", { headers: headers, responseType: 'text' });
  }

  DeleteUserService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.delete(API_URL + "usuario/" + id, { headers: headers, responseType: 'text' });
  }

  ActivateUserService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "activarUser/" + id, { headers: headers, responseType: 'text' });
  }

  GetOneUserService(id:any){
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "usuario/" + id, { headers: headers, responseType: 'text' });
  }

  UpdateUserService(formulario: any, id: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('PUT', API_URL + "usuario/" + id, formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  VerifySesion(data: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('POST', API_URL + "VerifySesion", data, {
      headers: headers,
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
