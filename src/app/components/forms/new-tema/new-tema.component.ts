import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { Punto, markFormGroupTouched, validarNombre, validarTitulo } from '../../../services/api-config';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { PuntocrudService } from '../../../services/crud/puntocrud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TituloscrudService } from '../../../services/crud/tituloscrud.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-new-tema',
  templateUrl: './new-tema.component.html',
  styleUrl: './new-tema.component.css'
})
export class NewTemaComponent {

  id: any;
  idEncrypt: any;
  DataPunto: any;
  ListPunto: Punto[] = [];
  data_usuariosacceso: any;
  FormAltaTema:FormGroup;

  constructor(
    public sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private el: ElementRef,
    private activateRoute: ActivatedRoute,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private router: Router,
    private PuntocrudService: PuntocrudService,
    private TituloscrudService: TituloscrudService
  ) {

    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("punto");
    this.idEncrypt = this.id;

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de puntos
    if (this.id === null) {
      this.router.navigateByUrl("/puntos");
    }

    this.sharedService.setLoading(true);

    this.FormAltaTema = this.formulario.group({
      nombreTitulo: ['',
        [
          validarTitulo(), //Validación personalizada
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ],
      ],
      esLink: ['',
        [
        ],
      ],
      tipoContenido: ['',
        [
          Validators.required,
        ],
      ],
      punto: [this.id,
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
    this.GetOnePuntoService(this.id);
}


  /* Extraer los datos del punto que se esta visualizando el detalle */
  GetOnePuntoService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.PuntocrudService.GetOnePuntoService(encryptedID).subscribe(
      respuesta => {
        this.DataPunto = this.encodeService.decryptData(respuesta)?.resultado?.data;
        this.sharedService.changeTitle('Registrar un nuevo tema para el punto: ' + this.DataPunto?.nombre_punto);
        this.sharedService.setLoading(false);
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'new-tema/'+this.idEncrypt });
      }
    );
  }

  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }

  /* Variables spinner */
  porcentajeEnvio: number = 0;
  mostrarSpinner: boolean = false;
  mensaje = "Guardando...";
  SaveTema(): any {
    markFormGroupTouched(this.FormAltaTema);
    if (this.FormAltaTema.valid) {
      this.mostrarSpinner = true;
      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormAltaTema.value));
      const data = {
        data: encryptedData
      };
      this.TituloscrudService.InsertTitulosService(data).subscribe(
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
                this.router.navigate(['/details-punto/'+ this.encriptarId(this.id)]);
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
  // InsertTitulosService
}
