import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariocrudService {

  constructor(private clientHttp:HttpClient) { }

    /*extrae los usuarios que tienen un area un especifico activa*/
    GetUsuariosAccesoArea(id:any): Observable<any> {
      return this.clientHttp.get(API_URL+"usuario/usuariosaccesoarea/" + id, { responseType: 'text' })
    }
    
    InsertUsuarioService(formulario: any): Observable<any> {
      return this.clientHttp.post(API_URL + "usuario", formulario, { responseType: 'text' });
    }

    GetUsuariosArea(){
      return this.clientHttp.get(API_URL+"usuario",{ responseType: 'text' })
    }

    DeleteUserService(id: any): Observable<any> {
      return this.clientHttp.delete(API_URL + "usuario/" + id, { responseType: 'text' });
    }
  
    ActivateUserService(id: any): Observable<any> {
      return this.clientHttp.get(API_URL + "usuario/activar/" + id, { responseType: 'text' });
    }

    GetOneUserService(id:any){
      return this.clientHttp.get(API_URL+"usuario/"+id,{ responseType: 'text' });
    }

    UpdateUserService(formulario: any, id: any): Observable<any> {
      return this.clientHttp.put(API_URL + "usuario/"+ id, formulario, { responseType: 'text' });
    }
}
