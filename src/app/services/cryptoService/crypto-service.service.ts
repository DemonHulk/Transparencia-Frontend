import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import Hashids from 'hashids';

@Injectable({
  providedIn: 'root'
})
export class CryptoServiceService {

  // Clave de encriptacion
  secretKey = "ea2df1a3c1540005189bb447bd15e80f";

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

  static getDataUsuarioToken() {
    const datosEncriptados = localStorage.getItem('user');
    if (datosEncriptados) {
      const clave = 'UZ4"(fa$P9g4ñ';
      const bytes = CryptoJS.AES.decrypt(datosEncriptados, clave);
      const datosDesencriptados = bytes.toString(CryptoJS.enc.Utf8);
      try {
        const datosJSON = JSON.stringify(JSON.parse(datosDesencriptados));
        // Regresa los datos con el formato de JSON
        try {
          const iv = CryptoJS.lib.WordArray.random(16); // Genera un IV aleatorio
          const encrypted = CryptoJS.AES.encrypt(datosJSON, CryptoJS.enc.Utf8.parse("ea2df1a3c1540005189bb447bd15e80f"), {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          });
          // Concatenar IV y datos cifrados, ambos en base64
          const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
          const encryptedBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
          return ivBase64 + ':' + encryptedBase64; // Usa ':' como delimitador
        } catch (error) {
          return null;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  }



  // La sal y la longitud mínima del hash
  hashids: Hashids = new Hashids('chichantastico', 5);

  encodeID(id: number): string {
    return this.hashids.encode(id);
  }

  decodeID(encodedID: string): any | null {
    const decoded = this.hashids.decode(encodedID);
    if (decoded.length === 0) {
      return null;
    }
    return decoded[0];
  }

  // Metodo de encriptación (Angular->PHP)
  encryptData(data: string): string {
    const iv = CryptoJS.lib.WordArray.random(16); // Genera un IV aleatorio
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(this.secretKey), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    // Concatenar IV y datos cifrados, ambos en base64
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const encryptedBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    return ivBase64 + ':' + encryptedBase64; // Usa ':' como delimitador
  }

  // Metodo de desencriptación (PHP->Angular)
  decryptData(encryptedData: string): any {
    const [ivBase64, encryptedBase64] = encryptedData.split(':'); // Separa el IV y los datos cifrados
    const iv = CryptoJS.enc.Base64.parse(ivBase64); // Convierte el IV de base64 a WordArray
    const encrypted = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(encryptedBase64) // Convierte los datos cifrados de base64 a WordArray
    });

    const decrypted = CryptoJS.AES.decrypt(
      encrypted,
      CryptoJS.enc.Utf8.parse(this.secretKey),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)); // Devuelve los datos descifrados como string
  }

}
