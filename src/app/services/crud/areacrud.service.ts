import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaCrudService {


  constructor(private clientHttp:HttpClient) { }

  GetAllAreaService(){
    return this.clientHttp.get(API_URL+"area")
  }

  GetOneAreaService(id:any){
    return this.clientHttp.get(API_URL+"area/"+id);
  }


  InsertAreaService(formulario: any): Observable<any> {
    return this.clientHttp.post(API_URL + "area", formulario);
  }

  UpdateAreaService(formulario: any, id: any): Observable<any> {
    return this.clientHttp.put(API_URL + "area/"+ id, formulario);
  }
  
  DeleteAreaService(id: any): Observable<any> {
    return this.clientHttp.delete(API_URL + "area/" + id);
  }

  ActivateAreaService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "area/activar/" + id);
  }


  
  
  
}

