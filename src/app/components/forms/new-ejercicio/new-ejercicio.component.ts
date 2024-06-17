import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedValuesService } from '../../../services/shared-values.service';
import { Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { markFormGroupTouched, validarNombre, validarTelefono } from '../../../services/api-config';
import { EjerciciocrudService } from '../../../services/crud/ejerciciocrud.service';

@Component({
  selector: 'app-new-ejercicio',
  templateUrl: './new-ejercicio.component.html',
  styleUrl: './new-ejercicio.component.css'
})
export class NewEjercicioComponent {
  FormAltaEjercicio:FormGroup;

  constructor(
    private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private CryptoServiceService: CryptoServiceService,
    private EjercicioCrudServuce: EjerciciocrudService
  ) {
    this.FormAltaEjercicio = this.formulario.group({
      ejercicio: ['',
        [
          validarTelefono(), //Validación personalizada
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4)
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
      this.sharedService.changeTitle('Registrar un nuevo ejercicio');
  }

  SaveEjercicio(): any {
    markFormGroupTouched(this.FormAltaEjercicio);
    if (this.FormAltaEjercicio.valid) {

      const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaEjercicio.value));

      const data = {
        data: encryptedData
      };
      this.EjercicioCrudServuce.InsertEjercicioService(data).subscribe(
        respuesta => {
          if (this.CryptoServiceService.decryptData(respuesta)?.resultado?.res) {
            this.flasher.success(this.CryptoServiceService.decryptData(respuesta)?.resultado?.data);
            this.router.navigate(['/ejercicios']);
          } else {
            this.flasher.error(this.CryptoServiceService.decryptData(respuesta)?.resultado?.data);
          }
        },
        error => {
          this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
        }
      );
    } else {
      this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
    }
  }
}
