import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { markFormGroupTouched, validarTitulo } from '../../../services/api-config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { TituloscrudService } from '../../../services/crud/tituloscrud.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-tema',
  templateUrl: './edit-tema.component.html',
  styleUrl: './edit-tema.component.css'
})
export class EditTemaComponent {
  id: any;
  idEncrypt: any;
  ListTitulo: any;
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
    private TituloscrudService: TituloscrudService



  ) {

    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");
    this.idEncrypt = this.id;

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de puntos
    if (this.id === null) {
      this.router.navigateByUrl("/puntos");
    }

    this.sharedService.setLoading(true);

    this.FormAltaTema = this.formulario.group({
      nombreTitulo: [this.ListTitulo?.nombre_titulo,
        [
          validarTitulo(), //Validación personalizada
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ],
      ],
      esLink: [this.ListTitulo?.link,
        [
        ],
      ],
      tipoContenido: [this.ListTitulo?.tipo_contenido,
        [
          Validators.required,
        ],
      ],
      punto: [this.ListTitulo?.id_punto,
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
    this.GettitulosmaspuntoService(this.id);
  }

  /* Extraer los datos del Titulo que se esta visualizando el detalle */
  GettitulosmaspuntoService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.TituloscrudService.GettitulosmaspuntoService(encryptedID).subscribe(
      respuesta => {
        this.ListTitulo = this.encodeService.decryptData(respuesta)?.resultado?.data;
        this.sharedService.changeTitle('Modificar tema: ' + this.ListTitulo?.nombre_titulo);
        this.FormAltaTema.patchValue({
          nombreTitulo: this.ListTitulo?.nombre_titulo,
          esLink: this.ListTitulo?.link,
          tipoContenido: this.ListTitulo?.tipo_contenido,
          punto: this.ListTitulo?.id_punto,
        });
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

  UpdateTema(): void {
    markFormGroupTouched(this.FormAltaTema);

    if (this.FormAltaTema.valid) {
      this.mostrarSpinner = true;
      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormAltaTema.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id)); // Asumiendo que 'id' es tu identificador a encriptar

      const data = {
        data: encryptedData
      };

      this.TituloscrudService.UpdateTituloService(data, encryptedID).subscribe(
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
                this.router.navigate(['/details-punto/'+ this.encriptarId(this.ListTitulo?.id_punto)]);
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


}

