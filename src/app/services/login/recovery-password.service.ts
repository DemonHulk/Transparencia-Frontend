import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecoveryPasswordService {

  constructor(private clientHttp:HttpClient) { }

  recuperarPassword(formulario: any): Observable<any> {
    const req = new HttpRequest('POST',API_URL + "recuperarPassword", formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

}
