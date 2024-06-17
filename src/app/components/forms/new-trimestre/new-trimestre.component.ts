import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { Router } from '@angular/router';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { markFormGroupTouched, validarTrimestre } from '../../../services/api-config';
import { EjerciciocrudService } from '../../../services/crud/ejerciciocrud.service';
import { TrimestrecrudService } from '../../../services/crud/trimestrecrud.service';
import { delay } from 'rxjs';
@Component({
  selector: 'app-new-trimestre',
  templateUrl: './new-trimestre.component.html',
  styleUrl: './new-trimestre.component.css'
})
export class NewTrimestreComponent {
  FormAltaTrimestre:FormGroup;
  isSubmitting = false;

  years: number[] = [];
  constructor(private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private EjerciciocrudService : EjerciciocrudService,
    private CryptoServiceService: CryptoServiceService,
    private TrimestrecrudService: TrimestrecrudService
    ) {
      this.FormAltaTrimestre = this.formulario.group({
        trimestre: ['',
          [
            validarTrimestre(), // Aplica el validador personalizado, el true significa que no debe estar vacio
            Validators.required,
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
    this.sharedService.loadScript("/assets/js/validations.js");
    this.loadEjercicio();

}

SaveTrimestre(): any {
  markFormGroupTouched(this.FormAltaTrimestre);
  if (this.FormAltaTrimestre.valid) {
    if (this.isSubmitting) {
      console.log('Ya hay una petición en curso. Espera a que se complete.');
      return;
    }
    this.isSubmitting = true; // Deshabilitar el botón
    const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaTrimestre.value));

    const data = {
      data: encryptedData
    };

    this.TrimestrecrudService.InsertTrimestreService(data).pipe(
      delay(1000) // Agregar un retraso de 1 segundo (1000 ms)
    ).subscribe(
      (respuesta:any) => {
        this.isSubmitting = false; // Habilitar el botón
        if (this.CryptoServiceService.decryptData(respuesta)?.resultado?.res) {
          this.flasher.success(this.CryptoServiceService.decryptData(respuesta)?.resultado?.data);
          this.router.navigate(['/trimestres']);
        } else {
          console.log('isSubmitting:', this.isSubmitting);
          this.flasher.error(this.CryptoServiceService.decryptData(respuesta)?.resultado?.data);
        }
      },
      (error:any) => {
        this.isSubmitting = false; // Habilitar el botón
        this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
      }
    );
  } else {
    this.isSubmitting = false; // Habilitar el botón
    this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
  }
}

ejercicio: any[] = [];
loadEjercicio(): void {
  this.EjerciciocrudService.GetAllEjercicioService().subscribe(
    (resultado: any) => {
      this.ejercicio = this.CryptoServiceService.decryptData(resultado)?.resultado?.data;
    },
    (error: any) => {
      console.error('Error al cargar datos:', error);
      this.ejercicio = [];
    }
  );
}




}
