import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../api-config';
import { Observable } from 'rxjs';
import { CryptoServiceService } from '../cryptoService/crypto-service.service';

@Injectable({
  providedIn: 'root'
})
export class TrimestrecrudService {

  constructor(
    private clientHttp:HttpClient,
    private encodeService: CryptoServiceService
  ) { }

    /*extrae los usuarios que tienen un area un especifico activa*/
    GetAllTrimestreService(){
      return this.clientHttp.get(API_URL+"trimestre", { responseType: 'text' })
    }
    
    InsertTrimestreService(formulario: any): Observable<any> {
      return this.clientHttp.post(API_URL + "trimestre", formulario, { responseType: 'text' });
    }

    GetUsuariosArea(){
      return this.clientHttp.get(API_URL+"usuario",{ responseType: 'text' })
    }

    DeleteUserService(id: any): Observable<any> {
      return this.clientHttp.delete(API_URL + "usuario/" + id, { responseType: 'text' });
    }
  
    ActivateUserService(id: any): Observable<any> {
      return this.clientHttp.get(API_URL + "activarUser/" + id, { responseType: 'text' });
    }

    GetOneUserService(id:any){
      return this.clientHttp.get(API_URL+"usuario/"+id, { responseType: 'text' });
    }

    UpdateUserService(formulario: any, id: any): Observable<any> {
      return this.clientHttp.put(API_URL + "usuario/"+ id, formulario, { responseType: 'text' });
    }
}
