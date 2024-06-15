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

  

  // Metodo de encriptacion de prueba
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

  // decryptData(encryptedData: string): any {
  //   const [ivBase64, encryptedBase64] = encryptedData.split(':');
  //   const iv = CryptoJS.enc.Base64.parse(ivBase64);
  //   const encrypted = CryptoJS.enc.Base64.parse(encryptedBase64);
  
  //   // Convertir la clave secreta a WordArray desde hexadecimal
  //   const keyHex = CryptoJS.enc.Hex.parse(this.secretKey);
  
  //   // Desencriptar
  //   const decrypted = CryptoJS.AES.decrypt(
  //     { ciphertext: encrypted, iv: iv },
  //     keyHex,
  //     { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  //   );
  
  //   const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
  //   return JSON.parse(decryptedData);
  // }

  decryptData(encryptedResponse: string): string {
    try {
      const [ivBase64, encryptedDataBase64] = encryptedResponse.split(':');
      const iv = CryptoJS.enc.Base64.parse(ivBase64); // Convertir IV a WordArray
      const encryptedData = CryptoJS.enc.Base64.parse(encryptedDataBase64); // Convertir datos encriptados a WordArray
      
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedData } as any,
        CryptoJS.enc.Hex.parse(this.secretKey), // Convertir clave a WordArray desde hexadecimal
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      
      const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error during decryption:', error);
      throw new Error('Failed to decrypt data');
    }
  }
  
  

}
