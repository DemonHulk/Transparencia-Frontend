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
    
    
    
}
