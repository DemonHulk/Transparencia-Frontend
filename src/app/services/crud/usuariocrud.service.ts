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
      return this.clientHttp.get(API_URL+"usuario/usuariosaccesoarea/" + id)
    }
    
    InsertUsuarioService(formulario: any): Observable<any> {
      return this.clientHttp.post(API_URL + "usuario", formulario);
    }

    GetUsuariosArea(){
      return this.clientHttp.get(API_URL+"usuario")
    }

    DeleteUserService(id: any): Observable<any> {
      return this.clientHttp.delete(API_URL + "usuario/" + id);
    }
  
    ActivateUserService(id: any): Observable<any> {
      return this.clientHttp.get(API_URL + "usuario/activar/" + id);
    }

    GetOneUserService(id:any){
      return this.clientHttp.get(API_URL+"usuario/"+id);
    }

    UpdateUserService(formulario: any, id: any): Observable<any> {
      return this.clientHttp.put(API_URL + "usuario/"+ id, formulario);
    }
}
