import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, token } from '../api-config';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PuntosAreasCrudService {

  constructor(private clientHttp:HttpClient) { }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `${token}`
    });
  }

    /*extrae los puntos de acceso de un area en especifico*//*extrae los puntos de acceso de un area en especifico*/
    GetPuntosAccesoArea(id: any): Observable<any> {
      const headers = this.createHeaders();
      return this.clientHttp.get(API_URL + "puntosareas/allpuntosaccesoarea/" + id, { headers: headers, responseType: 'text' });
    }

    InsertOrActivate_PuntoArea(formulario: any): Observable<any> {
      const headers = this.createHeaders();
      return this.clientHttp.post(API_URL + "puntosareas/insertoractivate_puntoArea", formulario, { headers: headers, responseType: 'text' });
    }

    Desactivate_PuntoArea(formulario: any): Observable<any> {
      const headers = this.createHeaders();
      return this.clientHttp.post(API_URL + "puntosareas/desactivate_puntoarea", formulario, { headers: headers, responseType: 'text' });
    }

    /**PARA SACAR LAS AREAS QUE TIENE UN PUNTO EN ESPECIFICO EL _PUNTO DICE QUE SE ESTA FILTRANDO POR PUNTO*/
    GetAreasPunto_PuntoService(id: any) {
      const headers = this.createHeaders();
      return this.clientHttp.get(API_URL + "areapunto_punto/" + id, { headers: headers, responseType: 'text' });
    }



}
