import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
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
      return this.clientHttp.get(API_URL+"userAcces/" + id, { responseType: 'text' })
    }

    InsertUsuarioService(formulario: any): Observable<any> {
      const req = new HttpRequest('POST',API_URL + "usuario", formulario, {
        reportProgress: true,
        responseType: 'text'
      });
      return this.clientHttp.request(req);
    }

    GetUsuariosArea(){
      return this.clientHttp.get(API_URL+"usuario",{ responseType: 'text' })
    }

    DeleteUserService(id: any): Observable<any> {
      return this.clientHttp.delete(API_URL + "usuario/" + id, { responseType: 'text' });
    }

    ActivateUserService(id: any): Observable<any> {
      return this.clientHttp.get(API_URL + "activarUser/" + id, { responseType: 'text' });
    }

    GetOneUserService(id:any){
      return this.clientHttp.get(API_URL+"usuario/"+id, { responseType: 'text' });
    }

    UpdateUserService(formulario: any, id: any): Observable<any> {
      const req = new HttpRequest('PUT',API_URL + "usuario/"+ id, formulario, {
        reportProgress: true,
        responseType: 'text'
      });
      return this.clientHttp.request(req);
    }


}
