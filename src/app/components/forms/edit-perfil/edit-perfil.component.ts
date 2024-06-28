import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { UsuariocrudService } from '../../../services/crud/usuariocrud.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markFormGroupTouched, validarCorreoUTDelacosta, validarNombre, validarPassword, validarTelefono } from '../../../services/api-config';
import { delay } from 'rxjs';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-perfil',
  templateUrl: './edit-perfil.component.html',
  styleUrl: './edit-perfil.component.css'
})
export class EditPerfilComponent {

  id: any;
  FormEditPerfil: FormGroup;
  data_user: any;
  isSubmitting: boolean = false;
  response: any;

  constructor(
    public sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    public formulario: FormBuilder,
    private flasher: AlertsServiceService,
    private UsuariocrudService: UsuariocrudService,
    private router: Router,
    private encodeService: CryptoServiceService,
    private el: ElementRef,

  ) {
    this.FormEditPerfil = this.formulario.group({
      correo: ['',
        [
          validarCorreoUTDelacosta(), // Aplica el validador personalizado
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100),
        ],

      ],
      password: ['',
        [
          validarPassword(false), // Aplica el validador personalizado, el false significa que la contraseña puede estar vacia
          Validators.minLength(6),
          Validators.maxLength(100)
        ]
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
    this.sharedService.changeTitle('Modificar mi información');
    
    this.sharedService.setLoading(true);
    this.GetOneUserService();
  }


/* Extraer los datos del usuario mediante su id e ingresarlos en su respectivo campo*/
decryptedData:any;
GetOneUserService() {
  this.data_user = this.encodeService.desencriptarDatosUsuario()
  const encryptedID = this.encodeService.encryptData(JSON.stringify(this.data_user?.id_usuario));
  this.UsuariocrudService.GetOneUserService(encryptedID).subscribe(
    (respuesta: any) => {
      /* Enviamos los datos de la respuesta al servicio para desencripatarla */
      this.decryptedData = this.encodeService.decryptData(respuesta).resultado?.data?.data[0];

      // Asegúrate de que la data_user sea del tipo Usuario
      this.FormEditPerfil.patchValue({
        correo: this.decryptedData?.correo,
      });

      this.sharedService.changeTitle('Modificar usuario: ' + this.data_user?.nombreCompleto);

      /*Indicar que todos los datos se han cargado */
        this.sharedService.setLoading(false);
        window.HSStaticMethods.autoInit();
    },
    error => {
      this.sharedService.updateErrorLoading(this.el, { message: 'edit-perfil' });
    }
  );
}




  /* Variables spinner */
 porcentajeEnvio: number = 0;
 mostrarSpinner: boolean = false;
 mensaje = "Actualizando...";
  UpdatePerfilService(): void {
    markFormGroupTouched(this.FormEditPerfil);

    if (this.FormEditPerfil.valid) {
      this.mostrarSpinner = true;

      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormEditPerfil.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.data_user?.id_usuario));

      const data = {
        data: encryptedData
      };

      this.UsuariocrudService.UpdateUserService(data, encryptedID).subscribe(
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
              if (decryptedResponse?.resultado?.data?.res) {
                this.flasher.success(decryptedResponse?.resultado?.data?.data);
                this.router.navigate(['/myprofile/' + this.encriptarId(this.id)]);
              } else {
                this.flasher.error(decryptedResponse?.resultado?.data?.data || 'No se recibió una respuesta válida');
              }
              this.mostrarSpinner = false;
              break;
            default:
              this.mostrarSpinner = false;
              this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
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


  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }
}
