import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoServiceService {

  constructor() { 
    this.desencriptarDatosUsuario(); 
  }

  // Función para desencriptar los datos del localStorage
  desencriptarDatosUsuario(): any | null {
    const datosEncriptados = localStorage.getItem('user');
    if (datosEncriptados) {
      const clave = 'UZ4"(fa$P9g4ñ';
      const bytes = CryptoJS.AES.decrypt(datosEncriptados, clave);
      const datosDesencriptados = bytes.toString(CryptoJS.enc.Utf8);
      try {
        const datosJSON = JSON.parse(datosDesencriptados);
        // Regresa los datos con el formato de JSON
        return datosJSON;
      } catch (e) {
        console.error('Error al parsear los datos desencriptados', e);
        return null;
      }
    }
    return null;
  }
}
