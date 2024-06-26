import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PuntosAreasCrudService {

  constructor(private clientHttp:HttpClient) { }


    /*extrae los puntos de acceso de un area en especifico*/
    GetPuntosAccesoArea(id:any): Observable<any> {
      return this.clientHttp.get(API_URL+"puntosareas/allpuntosaccesoarea/" + id, { responseType: 'text' })
    }

    InsertOrActivate_PuntoArea(formulario: any): Observable<any> {
      return this.clientHttp.post(API_URL + "puntosareas/insertoractivate_puntoArea", formulario, { responseType: 'text' });
    }

    Desactivate_PuntoArea(formulario: any): Observable<any> {
      return this.clientHttp.post(API_URL + "puntosareas/desactivate_puntoarea", formulario, { responseType: 'text' });
    }

    /**PARA SACAR LAS AREAS QUE TIENE UN PUNTO EN ESPECIFICO EL _PUNTO DICE QUE SE ESTA FILTRANDO POR PUNTO*/
    GetAreasPunto_PuntoService(id:any){
      return this.clientHttp.get(API_URL+"areapunto_punto/"+id, { responseType: 'text' });
    }
    

}
