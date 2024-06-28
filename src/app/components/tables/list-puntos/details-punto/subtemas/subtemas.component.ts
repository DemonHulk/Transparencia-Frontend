import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FechaService } from '../../../../../services/format/fecha.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CryptoServiceService } from '../../../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../../../services/alerts/alerts-service.service';
import { TituloscrudService } from '../../../../../services/crud/tituloscrud.service';
import { finalize } from 'rxjs';
import { Titulo } from '../../../../../services/api-config';

@Component({
  selector: 'app-subtemas',
  templateUrl: './subtemas.component.html',
  styleUrl: './subtemas.component.css'
})
export class SubtemasComponent {

  idPunto: any;
  idPuntoEncrypt: any;
  idTema: any;
  idTemaEncrypt: any;

  constructor(
    public sharedService: SharedValuesService,
    private el: ElementRef,
    private FechaService: FechaService,
    private activateRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private encodeService: CryptoServiceService,
    private flasher: AlertsServiceService,
    private TituloscrudService: TituloscrudService,

  ){
    this.sharedService.setLoading(true);

     //Tomas la id de la URL
     this.idPunto = this.activateRoute.snapshot.paramMap.get("punto");
     this.idPuntoEncrypt = this.idPunto;

     this.idTema = this.activateRoute.snapshot.paramMap.get("tema");
     this.idTemaEncrypt = this.idTema;

     //Desencriptar la ID
     this.idPunto = this.encodeService.decodeID(this.idPunto);
     this.idTema = this.encodeService.decodeID(this.idTema);

     //Verificar si la ID es null, si es así, redirige a la página de puntos
     if (this.idPunto === null) {
       this.router.navigateByUrl("/puntos");
     }
     if (this.idTema === null) {
      this.router.navigateByUrl("/details-punto/"+this.idPuntoEncrypt);
    }
    this.sharedService.setLoading(false);
  }

  ngOnInit(){
    this.getTitulosByPunto();
  }

  titulo: any;
  subtitulos: any = [];

  getTitulosByPunto() {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.idTema));
    this.TituloscrudService.GetSubtitulosByTitulo(encryptedID)
      .pipe(
        finalize(() => {
          // Código que se ejecuta siempre, independientemente de si hubo éxito o error
          this.sharedService.setLoading(false);
        })
      )
      .subscribe(
        (respuesta: any) => {
          const parsedData = this.encodeService.decryptData(respuesta).subtitulos;
          this.titulo = this.encodeService.decryptData(respuesta).titulo;
          /* Desencriptamos la respuesta que nos retorna el backend */
          this.subtitulos = Array.isArray(parsedData) ? parsedData.map(item => this.createTituloInstance(item)) : [this.createTituloInstance(parsedData)]
          window.HSStaticMethods.autoInit();
          this.sharedService.changeTitle('Administrar subtemas de '+this.titulo?.nombre_titulo);

        },
        (error) => {
          // Manejo de errores si es necesario
          this.sharedService.updateErrorLoading(this.el, { message: "/administrar-subtemas/"+this.idPuntoEncrypt+"/"+this.idTema });
        }
      );
  }
  private createTituloInstance(data: any): Titulo {
    return Object.assign(new Titulo(), data);
  }
}
