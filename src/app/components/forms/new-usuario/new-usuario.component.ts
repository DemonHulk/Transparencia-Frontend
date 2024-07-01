import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { markFormGroupTouched, validarCorreoUTDelacosta, validarNombre, validarPassword, validarTelefono } from '../../../services/api-config';
import { UsuariocrudService } from '../../../services/crud/usuariocrud.service';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { delay } from 'rxjs/operators';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-new-usuario',
  templateUrl: './new-usuario.component.html',
  styleUrl: './new-usuario.component.css'
})
export class NewUsuarioComponent {

  FormAltaUsuario:FormGroup;
  constructor(
    private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private UsuariocrudService: UsuariocrudService,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private AreaCrudService : AreaCrudService,
    private CryptoServiceService: CryptoServiceService,
    private el:ElementRef
  ) {
    this.FormAltaUsuario = this.formulario.group({
      correo: ['',
        [
          validarCorreoUTDelacosta(), //Aplica el validador personalizado
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100),
        ],

      ],
      password: ['',
        [
          validarPassword(true), // Aplica el validador personalizado, el true significa que require que la contraseña no este vacía
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100)
        ]
      ],
      id_area: ['',
        [
          Validators.required
        ]
      ],
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
    this.sharedService.changeTitle('Registrar un nuevo usuario');
    this.loadArea();
}

/* Variables spinner y mensaje */
porcentajeEnvio: number = 0;
mostrarSpinner: boolean = false;
mensaje = "Guardando...";

SaveUsuario(): void {
  markFormGroupTouched(this.FormAltaUsuario);

  if (this.FormAltaUsuario.valid) {
    this.mostrarSpinner = true;

    const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaUsuario.value));

    const data = {
      data: encryptedData
    };

    this.UsuariocrudService.InsertUsuarioService(data).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            break;
          case HttpEventType.UploadProgress:
            if (event.total !== undefined) {
              const percentDone = Math.round((100 * event.loaded) / event.total);
              this.porcentajeEnvio = percentDone;
            }
            break;
          case HttpEventType.Response:
            // Manejo de la respuesta encriptada
            const encryptedResponse = event.body;
            const decryptedResponse = this.CryptoServiceService.decryptData(encryptedResponse);
            if (decryptedResponse?.resultado?.data?.res) {
              this.flasher.success(decryptedResponse?.resultado?.data?.data);
              this.router.navigate(['/usuarios']);
            } else {
              this.flasher.error(decryptedResponse?.resultado?.data?.data || 'No se recibió una respuesta válida');
            }
            this.mostrarSpinner = false; // Ocultar spinner al finalizar
            break;
          default:
            this.mostrarSpinner = false; // Ocultar spinner al finalizar
            this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
            break;
        }
      },
      error => {
        this.mostrarSpinner = false; // Ocultar spinner en caso de error
        this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
      }
    );
  } else {
    this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
  }
}



  area: any[] = [];

  loadArea(): void {
    this.AreaCrudService.GetAllAreaService().subscribe(
      (resultado: any) => {
        try {
          // Desencriptar de manera segura la respuesta recibida del backend
          const decryptedData = this.CryptoServiceService.decryptData(resultado);
          const areas = decryptedData?.resultado?.data?.data || [];

          // Filtrar solo las áreas activas
          this.area = areas.filter((area: any) => area.activo === true);

          // Indicar que la carga de datos ha finalizado correctamente
          setTimeout(() => {
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        } catch (error) {
          // Manejar errores de desencriptación u otros errores inesperados
          this.sharedService.updateErrorLoading(this.el, { message: 'new-usuario' });
        }
      },
      (error: any) => {
        // Manejar errores de la suscripción al servicio
        this.sharedService.updateErrorLoading(this.el, { message: 'new-usuario' });
      }
    );
  }

}
