import { HttpClient } from '@angular/common/http';
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
      return this.clientHttp.post(API_URL + "punto", formulario, { responseType: 'text' });
    }

    UpdatePuntoService(formulario: any, id: any): Observable<any> {
      return this.clientHttp.put(API_URL + "punto/"+ id, formulario, { responseType: 'text' });
    }
    
    
}
