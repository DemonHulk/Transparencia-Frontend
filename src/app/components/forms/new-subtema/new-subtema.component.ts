import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FechaService } from '../../../services/format/fecha.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { SubtituloCrudService } from '../../../services/crud/subtitulo-crud.service';
import { TituloscrudService } from '../../../services/crud/tituloscrud.service';
import { SubTema, Titulo, markFormGroupTouched, validarTitulo } from '../../../services/api-config';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-new-subtema',
  templateUrl: './new-subtema.component.html',
  styleUrl: './new-subtema.component.css'
})
export class NewSubtemaComponent {


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

  FormAltaSubtema:FormGroup;

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

     this.idTema = this.activateRoute.snapshot.paramMap.get("tema");
     this.idTemaEncrypt = this.idTema;

     //Desencriptar la ID
     this.idTema = this.encodeService.decodeID(this.idTema);

     //Verificar si la ID es null, si es así, redirige a la página de puntos
     if (this.idTema === null) {
      this.router.navigateByUrl("/puntos");
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
      /**
       * Llama al método changeTitle del servicio de valores compartidos para actualizar el título.
       *
       * @param {string} newTitle - El nuevo título a establecer.
       * @memberof SharedValuesService
       */
      this.GetOneTituloService(this.idTema);
  }


  SaveSubtema(): any {
    markFormGroupTouched(this.FormAltaSubtema);

    if (this.FormAltaSubtema.valid) {
      this.mostrarSpinner = true;
      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormAltaSubtema.value));
      const data = {
        data: encryptedData
      };
      this.SubtituloCrudService.InsertSubtemaService(data).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.ResponseHeader:
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
                this.router.navigate(['/administrar-subtemas/'+ this.encriptarId(this.DataTema.id_punto) +"/" + this.encriptarId(this.DataTema.id_titulo)]);
              } else {
                this.mostrarSpinner = false;
                this.flasher.error(decryptedResponse?.resultado?.data);
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

  /* Extraer los datos del punto que se esta visualizando el detalle */
  GetOneTituloService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.TituloscrudService.GetOneTituloService(encryptedID).subscribe(
      respuesta => {
        this.DataTema = this.encodeService.decryptData(respuesta)?.resultado?.data || [];
        this.FormAltaSubtema.patchValue({
          titulo: this.DataTema.id_titulo,
          punto: this.DataTema.id_punto
        });
        this.sharedService.changeTitle('Registrar un nuevo subtema para el tema: ' + this.DataTema?.nombre_titulo);
        this.sharedService.setLoading(false);
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'new-tema/'+this.idTemaEncrypt });
      }
    );
  }


  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }
}