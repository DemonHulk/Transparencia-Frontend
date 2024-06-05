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


  InsertAreaService(formulario: any): Observable<any> {
    return this.clientHttp.post(API_URL + "area", formulario);
  }


}
