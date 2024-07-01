import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markFormGroupTouched, validarTitulo } from '../../../services/api-config';
import { PuntocrudService } from '../../../services/crud/puntocrud.service';
import { TituloscrudService } from '../../../services/crud/tituloscrud.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';

@Component({
  selector: 'app-new-subtema',
  templateUrl: './new-subtema.component.html',
  styleUrl: './new-subtema.component.css'
})
export class NewSubtemaComponent {
  idPunto: any;
  idPuntoEncrypt: any;
  idTema: any;
  idTemaEncrypt: any;
  FormAltaSubtema: FormGroup;
  porcentajeEnvio: number = 0;
  mostrarSpinner: boolean = false;
  mensaje = "Guardando...";
  datosUsuario: any;
  constructor(private sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    public formulario: FormBuilder,
    private PuntocrudService: PuntocrudService,
    private el: ElementRef,
    private TituloscrudService: TituloscrudService,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService
  ) {
    this.datosUsuario = this.encodeService.desencriptarDatosUsuario();
    this.FormAltaSubtema = this.formulario.group({
      nombreTitulo: ['',
        [
          validarTitulo(), //Validación personalizada
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ],
      ],
      tipoContenido: ['',
        [
          Validators.required,
        ],
      ],
      punto: [this.idPunto,
      [
        Validators.required,
      ],
      
      ],
      titulo: [this.idTema,
      [
        Validators.required,
      ],
      ],
      id_usuario: [this.datosUsuario?.id_usuario,
        [
          Validators.required,
        ],
      ],
    });
  }

  /**
 * Inicializa el componente y establece el título en el servicio de valores compartidos.
 *
 * @returns {void}
 */
  ngOnInit(): void {
    this.sharedService.setLoading(true);

    /**
     * Llama al método changeTitle del servicio de valores compartidos para actualizar el título.
     *
     * @param {string} newTitle - El nuevo título a establecer.
     * @memberof SharedValuesService
     */
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
      this.router.navigateByUrl("/details-punto/" + this.idPuntoEncrypt);
    }

    this.FormAltaSubtema.patchValue({
      titulo: this.idTema,
      punto: this.idPunto
    });
    this.getTituloData();
  }

  dataTitulo: any;
  getTituloData() {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.idTema));
    this.TituloscrudService.GetTituloById(encryptedID).subscribe(
      respuesta => {
        this.dataTitulo = this.encodeService.decryptData(respuesta)?.resultado;
        this.sharedService.changeTitle('Registrar un nuevo subtema para ' + this.dataTitulo?.nombre_titulo);
        this.sharedService.setLoading(false);
        const encryptedID = this.encodeService.encryptData(JSON.stringify(this.idTema));
        this.TituloscrudService.GetTitulosPadre(encryptedID).subscribe(
          respuesta => {
            this.idTemaEncrypt = this.encodeService.encodeID(this.encodeService.decryptData(respuesta)?.resultado.id_titulo);

          },
          error => {
            this.sharedService.updateErrorLoading(this.el, { message: 'new-subtema/' + this.idPuntoEncrypt + "/" + this.idTemaEncrypt });
          }
        );
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'new-subtema/' + this.idPuntoEncrypt + "/" + this.idTemaEncrypt });
      }
    );
  }


  saveSubtema(): any {
    markFormGroupTouched(this.FormAltaSubtema);
    if (this.FormAltaSubtema.valid) {
      this.mostrarSpinner = true;
      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormAltaSubtema.value));
      const data = {
        data: encryptedData
      };
      this.TituloscrudService.InsertSubtituloService(data).subscribe(
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
                this.router.navigate(['/administrar-subtemas/' + this.idPuntoEncrypt + '/' + this.idTemaEncrypt]);

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
}
