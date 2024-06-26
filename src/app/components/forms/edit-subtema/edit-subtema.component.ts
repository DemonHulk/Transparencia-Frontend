import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FechaService } from '../../../services/format/fecha.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { SubtituloCrudService } from '../../../services/crud/subtitulo-crud.service';
import { TituloscrudService } from '../../../services/crud/tituloscrud.service';
import { SubTema, Titulo, markFormGroupTouched, validarTitulo } from '../../../services/api-config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-subtema',
  templateUrl: './edit-subtema.component.html',
  styleUrl: './edit-subtema.component.css'
})
export class EditSubtemaComponent {


  IdSubtema: any;
  IdSubtemaEncrypt: any;
  idTema: any;
  idTemaEncrypt: any;
  Tema: any;
  ListTitulos: Titulo[] = [];
  ListSubtema: SubTema[] = [];

  data_usuariosacceso: any;

  DataPunto: any;
  DataTema: any;
  DataSubtema: any;

  /* Variables spinner */
  porcentajeEnvio: number = 0;
  mostrarSpinner: boolean = false;
  mensaje = "Guardando...";

  FormAltaSubtema:FormGroup ;


  constructor(
    public sharedService: SharedValuesService,
    private el: ElementRef,
    public formulario: FormBuilder,
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
     this.IdSubtema = this.activateRoute.snapshot.paramMap.get("id");
     this.IdSubtemaEncrypt = this.IdSubtema;

     this.idTema = this.activateRoute.snapshot.paramMap.get("tema");
     this.idTemaEncrypt = this.idTema;

     //Desencriptar la ID
     this.IdSubtema = this.encodeService.decodeID(this.IdSubtema);
     this.idTema = this.encodeService.decodeID(this.idTema);

     //Verificar si la ID es null, si es así, redirige a la página de puntos
     if (this.IdSubtema === null) {
       this.router.navigateByUrl("/puntos");
     }
     if (this.idTema === null) {
      this.router.navigateByUrl("/details-punto/"+this.IdSubtemaEncrypt);
    }
    this.sharedService.setLoading(false);




    /**FORMULARIO */
    this.FormAltaSubtema = this.formulario.group({
      nombreSubtema: ['',
        [
          validarTitulo(), //Validación personalizada
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ],
      ],
      tipoContenido: [1,
        [
          Validators.required,
        ],
      ],
      punto: ['',
        [
          Validators.required,
        ],
      ],
      titulo: ['',
        [
          Validators.required,
        ],
      ]
    });
  }

  ngOnInit(): void {

    this.GetOneTituloService(this.idTema);
    this.GetSubtemasDelTemaService(this.idTema);
    this.GetOneSubtituloService(this.IdSubtema);
  }

  UpdateSubtema(): void {
    markFormGroupTouched(this.FormAltaSubtema);
    if (this.FormAltaSubtema.valid) {
      this.mostrarSpinner = true;
      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormAltaSubtema.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.IdSubtema)); // Asumiendo que 'id' es tu identificador a encriptar

      const data = {
        data: encryptedData
      };

      this.SubtituloCrudService.UpdateSubtituloService(data, encryptedID).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.UploadProgress:
              if (event.total !== undefined) {
                const percentDone = Math.round((100 * event.loaded) / event.total);
                this.porcentajeEnvio = percentDone;
                this.mostrarSpinner = true;
              }
              break;
            case HttpEventType.Response:
              // Manejo de la respuesta encriptada
              const encryptedResponse = event.body;
              const decryptedResponse = this.encodeService.decryptData(encryptedResponse);
              if (decryptedResponse?.resultado?.res) {
                this.flasher.success(decryptedResponse?.resultado?.data);
                this.router.navigate(['/administrar-subtemas/'+ this.encriptarId(this.DataSubtema.id_punto)+"/"+this.encriptarId(this.DataSubtema.fk_titulos)]);
              } else {
                this.mostrarSpinner = false;
                this.flasher.error(decryptedResponse?.resultado?.data || 'No se recibió una respuesta válida');
              }
              break;
            default:
              this.mostrarSpinner = false;
              break;
          }
        },
        error => {
          this.mostrarSpinner = false;
          this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
        }
      );
    } else {
      this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
    }
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


  /* Extraer los datos del tema que tiene el subtema a editar*/
  GetOneTituloService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.TituloscrudService.GetOneTituloService(encryptedID).subscribe(
      respuesta => {
        this.DataTema = this.encodeService.decryptData(respuesta)?.resultado?.data;
        this.sharedService.changeTitle('Modificar subtema para el tema: '  + this.Tema?.nombre_titulo);
        this.sharedService.setLoading(false);
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'new-tema/'+this.IdSubtemaEncrypt });
      }
    );
  }

  /* Extraer los datos del Subtitulo en detalle */
  GetOneSubtituloService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.TituloscrudService.GetOneTituloService(encryptedID).subscribe(
      respuesta => {
        this.DataSubtema = this.encodeService.decryptData(respuesta)?.resultado?.data || [];
        this.FormAltaSubtema.patchValue({
          nombreSubtema: this.DataSubtema?.nombre_titulo,
          titulo: this.DataSubtema?.fk_titulos,
          punto: this.DataSubtema?.id_punto,
          tipoContenido: this.DataSubtema?.tipo_contenido
        });
        this.sharedService.changeTitle('Modificar subtema para el tema: ' + this.DataSubtema?.nombre_titulo);
        this.sharedService.setLoading(false);
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'new-tema/'+this.IdSubtemaEncrypt });
      }
    );
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