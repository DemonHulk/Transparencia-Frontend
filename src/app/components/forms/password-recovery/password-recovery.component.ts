import { Component } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { markFormGroupTouched, validarCorreoUTDelacosta, validarTelefono } from '../../../services/api-config';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedValuesService } from '../../../services/shared-values.service';
import { Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { RecoveryPasswordService } from '../../../services/login/recovery-password.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent {
  FormRecuperarPassword:FormGroup;

  constructor(
    private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private CryptoServiceService: CryptoServiceService,
    private RecoveryPasswordService: RecoveryPasswordService
  ) {
    this.FormRecuperarPassword = this.formulario.group({
      correo: ['',
        [
          validarCorreoUTDelacosta(), //Validación personalizada
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100),
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
      this.sharedService.changeTitle('Recuperar Contraseña');
  }
  /* Variables spinner */
  porcentajeEnvio: number = 0;
  mostrarSpinner: boolean = false;
  mensaje = "Guardando...";
  recuperarPassword(): void {
    markFormGroupTouched(this.FormRecuperarPassword);

    if (this.FormRecuperarPassword.valid) {
      this.mostrarSpinner = true; // Mostrar spinner de carga

      const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormRecuperarPassword.value));

      const data = {
        data: encryptedData
      };

      this.RecoveryPasswordService.recuperarPassword(data).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.UploadProgress:
              if (event.total !== undefined) {
                const percentDone = Math.round((100 * event.loaded) / event.total);
                this.porcentajeEnvio = percentDone; // Actualizar el porcentaje de envío
              }
              break;
            case HttpEventType.Response:
              // Manejo de la respuesta encriptada
              const encryptedResponse = event.body;
              const decryptedResponse = this.CryptoServiceService.decryptData(encryptedResponse);
              if (decryptedResponse?.resultado?.res) {
                this.flasher.success(decryptedResponse?.resultado?.data);
                this.router.navigate(['/login']);
              } else {
                this.flasher.error(decryptedResponse?.resultado?.data || 'No se recibió una respuesta válida');
              }
              this.mostrarSpinner = false; // Ocultar spinner al finalizar
              break;
            default:
              this.mostrarSpinner = false;
              this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico primero.");
              break;
          }
        },
        error => {
          this.mostrarSpinner = false; // Ocultar spinner en caso de error
          this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico segundo.");
        }
      );
    } else {
      this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
    }
  }
}
