import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Punto, SubTema, markFormGroupTouched, validarTitulo } from '../../../services/api-config';
import { TituloscrudService } from '../../../services/crud/tituloscrud.service';
import { PuntocrudService } from '../../../services/crud/puntocrud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { SubtituloCrudService } from '../../../services/crud/subtitulo-crud.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-subtema',
  templateUrl: './edit-subtema.component.html',
  styleUrl: './edit-subtema.component.css'
})
export class EditSubtemaComponent {

  

  idtema: any;
  idsubtema: any;
  idEncrypt: any;
  data_usuariosacceso: any;

  DataPunto: any;
  DataTema: any;
  DataSubtema: any;

  ListSubtema: SubTema[] = [];
  
  FormAltaSubtema:FormGroup;

  /* Variables spinner */
  porcentajeEnvio: number = 0;
  mostrarSpinner: boolean = false;
  mensaje = "Guardando...";

  constructor(
    public sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private el: ElementRef,
    private activateRoute: ActivatedRoute,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private router: Router,
    private PuntocrudService: PuntocrudService,
    private TituloscrudService: TituloscrudService,
    private CryptoServiceService: CryptoServiceService,
    private SubtituloCrudService: SubtituloCrudService,

  ) {

    //Tomas el tema de la URL
    this.idtema = this.activateRoute.snapshot.paramMap.get("tema");
    this.idEncrypt = this.idtema;

    //Desencriptar el tema
    this.idtema = this.encodeService.decodeID(this.idtema);

    //Verificar si la ID es null, si es así, redirige a la página de puntos
    if (this.idtema === null) {
      this.router.navigateByUrl("/puntos");
    }

    //Tomas el subtema de la URL
    this.idsubtema = this.activateRoute.snapshot.paramMap.get("id");
    this.idEncrypt = this.idsubtema;

    //Desencriptar el tema
    this.idsubtema = this.encodeService.decodeID(this.idsubtema);

    //Verificar si la ID es null, si es así, redirige a la página de puntos
    if (this.idsubtema === null) {
      this.router.navigateByUrl("/puntos");
    }

    this.sharedService.setLoading(true);

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


  /**
   * Inicializa el componente y establece el título en el servicio de valores compartidos.
   *
   * @returns {void}
   */
  ngOnInit(): void {
      /**
       * Llama al método changeTitle del servicio de valores compartidos para actualizar el título.
       *
       * @param {string} newTitle - El nuevo título a establecer.
       * @memberof SharedValuesService
       */
      this.sharedService.loadScript("/assets/js/validations.js");
      this.GetOneTituloService(this.idtema);
      this.GetOneSubtituloService(this.idsubtema);

  }



  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }


  
  UpdateSubtema(): void {
    markFormGroupTouched(this.FormAltaSubtema);
    if (this.FormAltaSubtema.valid) {
      this.mostrarSpinner = true;
      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormAltaSubtema.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.idsubtema)); // Asumiendo que 'id' es tu identificador a encriptar

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
                this.router.navigate(['/details-punto/'+ this.encriptarId(this.DataSubtema.id_punto)]);
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



  /* Extraer los datos del tema que tiene el subtema a editar*/
  GetOneTituloService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.TituloscrudService.GetOneTituloService(encryptedID).subscribe(
      respuesta => {
        this.DataTema = this.encodeService.decryptData(respuesta)?.resultado?.data;
        this.sharedService.changeTitle('Modificar subtema para el tema: ' + this.DataTema?.nombre_titulo);
        this.sharedService.setLoading(false);
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'new-tema/'+this.idEncrypt });
      }
    );
  }


  /* Extraer los datos del Subtitulo en detalle */
  GetOneSubtituloService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.TituloscrudService.GetOneTituloService(encryptedID).subscribe(
      respuesta => {
        this.DataSubtema = this.encodeService.decryptData(respuesta)?.resultado?.data;
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
        this.sharedService.updateErrorLoading(this.el, { message: 'new-tema/'+this.idEncrypt });
      }
    );
  }

}
