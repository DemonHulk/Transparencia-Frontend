import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrimestrecrudService {

  constructor(private clientHttp:HttpClient) { }

    /*extrae los usuarios que tienen un area un especifico activa*/
    GetAllTrimestreService(){
      return this.clientHttp.get(API_URL+"trimestre", { responseType: 'text' })
    }

    InsertTrimestreService(formulario: any): Observable<any> {
      const req = new HttpRequest('POST',API_URL + "trimestre", formulario, {
        reportProgress: true,
        responseType: 'text'
      });
      return this.clientHttp.request(req);
    }

    GetUsuariosArea(){
      return this.clientHttp.get(API_URL+"usuario",{ responseType: 'text' })
    }

    DeleteTrimestreService(id: any): Observable<any> {
      return this.clientHttp.delete(API_URL + "trimestre/" + id, { responseType: 'text' });
    }

    ActivateTrimestreService(id: any): Observable<any> {
      return this.clientHttp.get(API_URL + "trimestreAct/" + id, { responseType: 'text' });
    }

    GetOneTrimestreService(id:any){
      return this.clientHttp.get(API_URL+"trimestre/"+id, { responseType: 'text' });
    }

    UpdateTrimestreService(formulario: any, id: any): Observable<any> {
      const req = new HttpRequest('PUT',API_URL + "trimestre/"+ id, formulario, {
        reportProgress: true,
        responseType: 'text'
      });
      return this.clientHttp.request(req);
    }
}
