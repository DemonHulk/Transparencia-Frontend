import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FechaService } from '../../../../../services/format/fecha.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CryptoServiceService } from '../../../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../../../services/alerts/alerts-service.service';

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
  ){
    this.sharedService.setLoading(true);
    this.sharedService.changeTitle('Administrar subtemas del tema: ');

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




  
}
