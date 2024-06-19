import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaCrudService {


  constructor(private clientHttp:HttpClient) { }

  /**EXTRAE TODAS LAS AREAS ESTEN ACTIVAS O INACTIVAS */
  GetAllAreaService(){
    return this.clientHttp.get(API_URL+"area", { responseType: 'text' })
  }

  /**EXTRAE LAS AREAS ACTIVAS */
  GetActAreaService(){
    return this.clientHttp.get(API_URL+"areaAct", { responseType: 'text' })
  }

  GetOneAreaService(id:any){
    return this.clientHttp.get(API_URL+"area/"+id, { responseType: 'text' });
  }

    /**PARA SACAR LAS AREAS QUE TIENE UN PUNTO EN ESPECIFICO EL _PUNTO DICE QUE SE ESTA FILTRANDO POR PUNTO*/
  GetAreasPunto_PuntoService(id:any){
    return this.clientHttp.get(API_URL+"areapunto_punto/"+id, { responseType: 'text' });
  }

  InsertAreaService(formulario: any): Observable<any> {
    return this.clientHttp.post(API_URL + "area", formulario, { responseType: 'text' });
  }

  UpdateAreaService(formulario: any, id: any): Observable<any> {
    return this.clientHttp.put(API_URL + "area/"+ id, formulario, { responseType: 'text' });
  }
  
  DeleteAreaService(id: any): Observable<any> {
    return this.clientHttp.delete(API_URL + "area/" + id, { responseType: 'text' });
  }

  ActivateAreaService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "areaAct/" + id, { responseType: 'text' });
  }


  
  
  
}

