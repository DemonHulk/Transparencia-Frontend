import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api-config';

@Injectable({
  providedIn: 'root'
})
export class TituloscrudService {

  constructor(private clientHttp:HttpClient) { }


    /**Inserta un titulo dentro de un punto que viene en el formulario*/
  InsertTitulosService(formulario: any): Observable<any> {
    const req = new HttpRequest('POST', API_URL + 'titulos', formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  InsertSubtituloService(formulario: any): Observable<any> {
    const req = new HttpRequest('POST', API_URL + 'subtitulo', formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  /**extrae los titulos de un punto*/
  GetTitulosPunto(id:any): Observable<any> {
    return this.clientHttp.get(API_URL+"titulosdepunto/" + id, { responseType: 'text' })
  }

  GetTitulosPadre(id:any): Observable<any> {
    return this.clientHttp.get(API_URL+"tituloPadre/" + id, { responseType: 'text' })
  }

  GetSubtituloData(id:any): Observable<any> {
    return this.clientHttp.get(API_URL+"subtituloData/" + id, { responseType: 'text' })
  }

  /**extrae los datos de un titulo + nombre del punto a que pertenece e id*/
  GettitulosmaspuntoService(id:any): Observable<any> {
    return this.clientHttp.get(API_URL+"titulosmaspunto/" + id, { responseType: 'text' })
  }



  DeleteTituloService(id: any): Observable<any> {
    return this.clientHttp.delete(API_URL + "titulos/" + id, { responseType: 'text' });
  }


  ActivateTituloService(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "titulosAct/" + id, { responseType: 'text' });
  }

  UpdateTituloService(formulario: any, id: any): Observable<any> {
    const req = new HttpRequest('PUT', API_URL + "titulos/"+ id, formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  UpdateSubtituloService(formulario: any, id: any): Observable<any> {
    const req = new HttpRequest('PUT', API_URL + "subtitulo/"+ id, formulario, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.clientHttp.request(req);
  }

  GetTitulosByPunto(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "titulosCompletos/" + id, { responseType: 'text' });
  }

  GetSubtitulosByTitulo(id: any): Observable<any> {
    return this.clientHttp.get(API_URL + "subtitulosPorTema/" + id, { responseType: 'text' });
  }


  GetTituloById(id:any): Observable<any> {
    return this.clientHttp.get(API_URL+"titulo/" + id, { responseType: 'text' })
  }


}
