import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuntocrudService {

  constructor(private clientHttp:HttpClient) { }


    /*extrae todos los puntos estan activos o desactivados */
    GetAllPuntosService(){
      return this.clientHttp.get(API_URL+"punto", { responseType: 'text' })
    }

    GetOnePuntoService(id:any){
      return this.clientHttp.get(API_URL+"punto/"+id, { responseType: 'text' });
    }

    DeletePuntoService(id: any): Observable<any> {
      return this.clientHttp.delete(API_URL + "punto/" + id, { responseType: 'text' });
    }

    ActivatePuntoService(id: any): Observable<any> {
      return this.clientHttp.get(API_URL + "puntoAct/" + id, { responseType: 'text' });
    }

    InsertPuntoService(formulario: any): Observable<any> {
      const req = new HttpRequest('POST',API_URL + "punto", formulario, {
        reportProgress: true,
        responseType: 'text'
      });
      return this.clientHttp.request(req);
    }

    UpdatePuntoService(formulario: any, id: any): Observable<any> {
      const req = new HttpRequest('PUT',API_URL + "punto/"+ id, formulario, {
        reportProgress: true,
        responseType: 'text'
      });
      return this.clientHttp.request(req);
    }

    /*extrae todos los puntos estan activos y tengan la area del usuario en sesión*/
    GetPuntosUserService(id:any){
      return this.clientHttp.get(API_URL+"puntoUser/"+ id, { responseType: 'text' })
    }

    UpdateOrderService(data:any): Observable<any> {
      const req = new HttpRequest('POST',API_URL + "orderPuntos", data, {
        reportProgress: true,
        responseType: 'text'
      });
      return this.clientHttp.request(req);
    }
}
