import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FechaService } from '../../../../../services/format/fecha.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CryptoServiceService } from '../../../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../../../services/alerts/alerts-service.service';
import { SubTema, Titulo } from '../../../../../services/api-config';
import { SubtituloCrudService } from '../../../../../services/crud/subtitulo-crud.service';
import { TituloscrudService } from '../../../../../services/crud/tituloscrud.service';

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
  Tema: any;
  ListTitulos: Titulo[] = [];
  ListSubtema: SubTema[] = [];

  constructor(
    public sharedService: SharedValuesService,
    private el: ElementRef,
    private FechaService: FechaService,
    private activateRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private encodeService: CryptoServiceService,
    private flasher: AlertsServiceService,
    private SubtituloCrudService: SubtituloCrudService,
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

  ngOnInit(): void {

    this.GetTitulosPunto(this.idTema);
    this.GetSubtemasDelTemaService(this.idTema);

  }


  /* extraer datos de TEMA */
  GetTitulosPunto(id: any) {
    this.sharedService.setLoading(true);
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.TituloscrudService.GetOneTituloService(encryptedID).subscribe(
      respuesta => {
        this.Tema = this.encodeService.decryptData(respuesta)?.resultado?.data || [];
        this.sharedService.setLoading(false);
        this.sharedService.changeTitle('Administrar subtemas del tema: ' + this.Tema?.nombre_titulo);
        this.sharedService.setLoading(false);
      
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'details-punto/'+encryptedID });
        this.sharedService.setLoading(false);
      }
    );
  }

  /* extrae SUBTEMAS de un TEMA */
  GetSubtemasDelTemaService(id: any) {
    this.sharedService.setLoading(true);
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.SubtituloCrudService.GetSubtemasDelTemaService(encryptedID).subscribe(
      respuesta => {
        this.ListSubtema = this.encodeService.decryptData(respuesta)?.resultado?.data || [];
        this.sharedService.setLoading(false);
        this.sharedService.setLoading(false);
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'details-punto/'+encryptedID });
        this.sharedService.setLoading(false);
      }
    );
  }

  /** Desactiva un Subtema */
  DeleteSubtema(id: any) {
    console.log(id)
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
      this.sharedService.setLoading(true);

        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.SubtituloCrudService.DeleteSubtemaService(encryptedID).subscribe(respuesta => {
          this.GetSubtemasDelTemaService(this.idTema);
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          setTimeout(() => {
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        });
      }
    });
  }



    /** Activa un Subtema */
    ActivateSubtema(id: any) {
      this.flasher.reactivar().then((confirmado) => {
        if (confirmado) {
          this.sharedService.setLoading(true);
  
          // Enviamos la id encriptada
          const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
          this.SubtituloCrudService.ActivateSubtemaService(encryptedID).subscribe(respuesta => {
            this.GetSubtemasDelTemaService(this.idTema);
            this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
            setTimeout(() => {
              this.sharedService.setLoading(false);
              window.HSStaticMethods.autoInit();
            }, 500);
          });
        }
      });
    }



  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }


  /**
  * Actualiza la fecha de formato YYYY-MM-DD a
  */
  FormatearDate(fecha: any) {
    if (!fecha) {
      return ''; // O cualquier valor predeterminado que prefieras
    }
    return this.FechaService.formatDate(fecha);
  }
  
}
