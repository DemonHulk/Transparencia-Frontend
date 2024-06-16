import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { validarTelefono } from '../../../services/api-config';

@Component({
  selector: 'app-edit-ejercicio',
  templateUrl: './edit-ejercicio.component.html',
  styleUrl: './edit-ejercicio.component.css'
})
export class EditEjercicioComponent {
  FormEditEjercicio:FormGroup;

  constructor(
    private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private CryptoServiceService: CryptoServiceService
  ) {
    this.FormEditEjercicio = this.formulario.group({
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
      this.sharedService.changeTitle('Modificar ejercicio');
  }
}
