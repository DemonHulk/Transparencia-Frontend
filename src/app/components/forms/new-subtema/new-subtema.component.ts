import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { SubTema, Titulo, markFormGroupTouched, validarNombre, validarTitulo } from '../../../services/api-config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PuntocrudService } from '../../../services/crud/puntocrud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { SubtituloCrudService } from '../../../services/crud/subtitulo-crud.service';
import { TituloscrudService } from '../../../services/crud/tituloscrud.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-new-subtema',
  templateUrl: './new-subtema.component.html',
  styleUrls: ['./new-subtema.component.css']
})

export class NewSubtemaComponent {

  DataTema: any;
  id: any;
  idEncrypt: any;

  FormAltaSubtema:FormGroup;
  ListSubtema: SubTema[] = [];
  
  /* Variables spinner */
  porcentajeEnvio: number = 0;
  mostrarSpinner: boolean = false;
  mensaje = "Guardando...";

  constructor(
    private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private activateRoute: ActivatedRoute,
    private PuntocrudService: PuntocrudService,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private CryptoServiceService: CryptoServiceService,
    private encodeService: CryptoServiceService,
    private el:ElementRef,
    private SubtituloCrudService: SubtituloCrudService,
    private TituloscrudService: TituloscrudService

  ) { 


    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("tema");
    this.idEncrypt = this.id;

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de puntos
    if (this.id === null) {
      this.router.navigateByUrl("/puntos");
    }

    this.sharedService.setLoading(true);

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
   * Inicializa el componente y establece el subtitulo en el servicio de valores compartidos.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    /**
    * Llama al método changeTitle del servicio de valores compartidos para actualizar el subtitulo.
    *
    * @param {string} newTitle - El nuevo subtitulo a establecer.
    * @memberof SharedValuesService
    */
    this.sharedService.loadScript("/assets/js/validations.js");
    this.GetOneTituloService(this.id);
  }


  encriptarId(id:any){
    return this.encodeService.encodeID(id);
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
                this.router.navigate(['/details-punto/'+ this.encriptarId(this.DataTema.id_punto)]);
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
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
    this.TituloscrudService.GetOneTituloService(encryptedID).subscribe(
      respuesta => {
        this.DataTema = this.encodeService.decryptData(respuesta)?.resultado?.data;
        this.FormAltaSubtema.patchValue({
          titulo: this.DataTema.id_titulo,
          punto: this.DataTema.id_punto
        });
        this.sharedService.changeTitle('Registrar un nuevo subtema para el tema: ' + this.DataTema?.nombre_titulo);
        this.sharedService.setLoading(false);
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'new-tema/'+this.idEncrypt });
      }
    );
  }



}