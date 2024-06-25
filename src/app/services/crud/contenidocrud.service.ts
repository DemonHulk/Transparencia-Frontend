import { HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CryptoServiceService } from '../cryptoService/crypto-service.service';
import { AlertsServiceService } from '../alerts/alerts-service.service';

@Injectable({
  providedIn: 'root'
})
export class ContenidocrudService {

  constructor(private clientHttp:HttpClient, private encodeService: CryptoServiceService, private flasher: AlertsServiceService) { }
/***************************************************************************************************
*  CONTENIDO DINAMICO                                                                               *
***************************************************************************************************/ 
  /**EXTRAE TODO EL CONTENIDO DINAMICO ESTE ACTIVO O INACTIVO */
  GetAllContenidoDinamicoService(id:any){
    return this.clientHttp.get(API_URL+"contenidoDinamico/"+id, { responseType: 'text' })
  }

  GetOneContenidoDinamicoService(id:any){
    return this.clientHttp.get(API_URL+"onecontenidoDinamico/"+id, { responseType: 'text' });
  }
  
  InsertContenidoDinamicoService(formData: FormData): Observable<any> {
    const req = new HttpRequest('POST', API_URL + 'contenidoDinamico', formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  UpdateContenidoDinamicoService(formData: FormData, id: any): Observable<any> {
    const req = new HttpRequest('POST', API_URL + "UpdatecontentDinamico/"+ id, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  DeleteContenidoDinamicoService(id: any): Observable<any> {
    return this.clientHttp.delete(API_URL + "contenidoDinamico/" + id, { responseType: 'text' });
  }

  ActivateContenidoDinamicoService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "contenidoDinamicoAct/" + id, { responseType: 'text' });
  }


  /***************************************************************************************************
  *  CONTENIDO ESTATICO                                                                              *
  ***************************************************************************************************/
 
  GetAllContenidoEstaticoService(id:any){
    return this.clientHttp.get(API_URL+"contenidoEstatico/"+id, { responseType: 'text' })
  } 

  GetOneContenidoEstaticoService(id:any){
    return this.clientHttp.get(API_URL+"oneContenidoEstatico/"+id, { responseType: 'text' });
  }
  
  InsertContenidoEstaticoService(formulario: any): Observable<any> {
    const req = new HttpRequest('POST',API_URL + "contenidoEstatico", formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  UpdateContenidoEstaticoService(formulario: any, id: any): Observable<any> {
    const req = new HttpRequest('PUT', API_URL + "UpdatecontentEstatico/"+ id, formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  DeleteContenidoEstaticoService(id: any): Observable<any> {
    return this.clientHttp.delete(API_URL + "contenidoEstatico/" + id, { responseType: 'text' });
  }

  ActivateContenidoEstaticoService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "contenidoEstaticoAct/" + id, { responseType: 'text' });
  }

  /***************************************************************************************************
  *  Visualizar Documento                                                                            *
  ***************************************************************************************************/

  getPDF(fileName: string): Observable<any> {
    return this.clientHttp.get(API_URL + "getDocument/" + fileName, { responseType: 'text' })
      .pipe(
        map(response => {
          const decryptedResponse = this.encodeService.decryptData(response);
          if (decryptedResponse?.resultado?.res) {
            return {
              data: this.base64ToArrayBuffer(decryptedResponse.resultado.data),
              mime: decryptedResponse.resultado.mime,
              filename: decryptedResponse.resultado.filename
            };
          } else {
            throw new Error(decryptedResponse?.resultado?.data || 'Respuesta inválida del servidor');
          }
        }),
        catchError(error => this.handleError(error, fileName))
      );
  }
  
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  private handleError(error: any, fileName: string): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error instanceof HttpErrorResponse) {
      errorMessage = `Error HTTP: ${error.status}, ${error.statusText}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
  
    // Añadir información adicional
    errorMessage += ` - Archivo: ${fileName}`;
  
    return throwError(() => new Error(errorMessage));
  }

  /***************************************************************************************************
  *  Descargar Documento                                                                             *
  ***************************************************************************************************/
  getDowndloadPDF(fileName: any): Observable<Blob> {
    return this.clientHttp.get(API_URL + "getDocument/" + fileName, { responseType: 'text' })
      .pipe(
        map(response => {
          let decryptedResponse = this.encodeService.decryptData(response);
          if (decryptedResponse?.resultado?.res) {
            const byteCharacters = atob(decryptedResponse.resultado.data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: decryptedResponse.resultado.mime || 'application/pdf' });
          } else {
            throw new Error(decryptedResponse?.resultado?.data || 'Respuesta inválida del servidor');
          }
        }),
        catchError(error => this.handleError(error, fileName))
      );
  }
}
