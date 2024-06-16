import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private clientHttp:HttpClient) { }

  // Función para el formulario de inicio de sesion
  VerificarUser(formulario: any): Observable<any> {
    return this.clientHttp.post(API_URL + "verificarUser", formulario, { responseType: 'text' });
  }
  
  // Función para cerrar sesión
  cerrarSesion() {
    localStorage.removeItem('user');
  }

  
}
