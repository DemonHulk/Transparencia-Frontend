import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { Router } from '@angular/router';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { markFormGroupTouched, validarTrimestre } from '../../../services/api-config';
import { EjerciciocrudService } from '../../../services/crud/ejerciciocrud.service';
import { TrimestrecrudService } from '../../../services/crud/trimestrecrud.service';
import { delay } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-new-trimestre',
  templateUrl: './new-trimestre.component.html',
  styleUrl: './new-trimestre.component.css'
})
export class NewTrimestreComponent {
  FormAltaTrimestre:FormGroup;
  isSubmitting = false;

  constructor(private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private EjerciciocrudService : EjerciciocrudService,
    private CryptoServiceService: CryptoServiceService,
    private TrimestrecrudService: TrimestrecrudService,
    private el: ElementRef
    ) {
      this.FormAltaTrimestre = this.formulario.group({
        trimestre: ['',
          [
            validarTrimestre(), // Aplica el validador personalizado, el true significa que no debe estar vacio
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(25)
          ],
        ],
        ejercicio: ['',
          [
            Validators.required
          ]
        ],
    }
  )}

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
    this.sharedService.changeTitle('Registrar un nuevo trimestre');
    this.loadEjercicio();

}

  /* Variables spinner */
  porcentajeEnvio: number = 0;
  mostrarSpinner: boolean = false;
  mensaje = "Guardando...";
  SaveTrimestre(): void {
    markFormGroupTouched(this.FormAltaTrimestre);

    if (this.FormAltaTrimestre.valid) {
      this.mostrarSpinner = true; // Mostrar spinner de carga
      const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaTrimestre.value));
      const data = {
        data: encryptedData
      };
      this.TrimestrecrudService.InsertTrimestreService(data).subscribe(
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
                this.router.navigate(['/trimestres']);
              } else {
                this.flasher.error(decryptedResponse?.resultado?.data);
              }
              this.mostrarSpinner = false; // Ocultar spinner al finalizar
              break;
            default:
              this.mostrarSpinner = false;
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


ejercicio: any[] = [];
loadEjercicio(): void {
  this.EjerciciocrudService.GetAllEjercicioService().subscribe(
    (resultado: any) => {
      try {
        // Desencriptar de manera segura la respuesta recibida del backend
        const decryptedData = this.CryptoServiceService.decryptData(resultado)?.resultado?.data;

        // Filtrar los ejercicios activos
        this.ejercicio = decryptedData?.filter((ejercicio: any) => ejercicio.activo === true);

        // Indicar que la carga de datos ha finalizado correctamente
        setTimeout(() => {
          this.sharedService.setLoading(false);
          window.HSStaticMethods.autoInit();
        }, 500);
      } catch (error) {
        // Manejar errores de desencriptación u otros errores inesperados
        this.sharedService.updateErrorLoading(this.el, { message: 'new-trimestre' });
      }
    },
    (error: any) => {
      // Manejar errores de la suscripción al servicio
      this.sharedService.updateErrorLoading(this.el, { message: 'new-trimestre' });
    }
  );
}




}
