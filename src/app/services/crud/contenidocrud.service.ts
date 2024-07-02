import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, token } from '../api-config';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CryptoServiceService } from '../cryptoService/crypto-service.service';
import { AlertsServiceService } from '../alerts/alerts-service.service';

@Injectable({
  providedIn: 'root'
})
export class ContenidocrudService {

  constructor(private clientHttp:HttpClient, private encodeService: CryptoServiceService, private flasher: AlertsServiceService) { }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `${token}`
    });
  }
/***************************************************************************************************
*  CONTENIDO DINAMICO                                                                               *
***************************************************************************************************/
  /**EXTRAE TODO EL CONTENIDO DINAMICO ESTE ACTIVO O INACTIVO */
  GetAllContenidoDinamicoService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "contenidoDinamico/" + id, { headers: headers, responseType: 'text' });
  }

  GetOneContenidoDinamicoService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "onecontenidoDinamico/" + id, { headers: headers, responseType: 'text' });
  }

  InsertContenidoDinamicoService(formData: FormData): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('POST', API_URL + 'contenidoDinamico', formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  UpdateContenidoDinamicoService(formData: FormData, id: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('POST', API_URL + "UpdatecontentDinamico/" + id, formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  DeleteContenidoDinamicoService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.delete(API_URL + "contenidoDinamico/" + id, { headers: headers, responseType: 'text' });
  }

  ActivateContenidoDinamicoService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "contenidoDinamicoAct/" + id, { headers: headers, responseType: 'text' });
  }



  /***************************************************************************************************
  *  CONTENIDO ESTATICO                                                                              *
  ***************************************************************************************************/

  GetAllContenidoEstaticoService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "contenidoEstatico/" + id, { headers: headers, responseType: 'text' });
  }

  GetOneContenidoEstaticoService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "oneContenidoEstatico/" + id, { headers: headers, responseType: 'text' });
  }

  InsertContenidoEstaticoService(formulario: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('POST', API_URL + "contenidoEstatico", formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  UpdateContenidoEstaticoService(formulario: any, id: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('PUT', API_URL + "UpdatecontentEstatico/" + id, formulario, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  DeleteContenidoEstaticoService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.delete(API_URL + "contenidoEstatico/" + id, { headers: headers, responseType: 'text' });
  }

  ActivateContenidoEstaticoService(id: any): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "contenidoEstaticoAct/" + id, { headers: headers, responseType: 'text' });
  }

  /***************************************************************************************************
  *  Visualizar Documento                                                                            *
  ***************************************************************************************************/

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

  getPDF(fileName: string): Observable<any> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "getDocument/" + fileName, { headers: headers, responseType: 'text' })
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

  getDowndloadPDF(fileName: any): Observable<Blob> {
    const headers = this.createHeaders();
    return this.clientHttp.get(API_URL + "getDocument/" + fileName, { headers: headers, responseType: 'text' })
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

  searchPDF(data: any): Observable<any> {
    const headers = this.createHeaders();
    const req = new HttpRequest('POST', API_URL + "buscarPDF", data, {
      headers: headers,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }


}
