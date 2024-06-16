import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import {  markFormGroupTouched, validarTextoNormal } from '../../../services/api-config';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';

@Component({
  selector: 'app-new-area',
  templateUrl: './new-area.component.html',
  styleUrl: './new-area.component.css'
})
export class NewAreaComponent {

  FormAltaArea:FormGroup;

  constructor(
    private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private AreaCrudService: AreaCrudService,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private CryptoServiceService: CryptoServiceService
  ) {
    this.FormAltaArea = this.formulario.group({
      nombreArea: ['',
        [
          validarTextoNormal(), //Validación personalizada
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
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
      this.sharedService.changeTitle('Registrar una nueva área');


  }


  SaveArea(): any {
    markFormGroupTouched(this.FormAltaArea);
    if (this.FormAltaArea.valid) {
      
      const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaArea.value));

      const data = {
        data: encryptedData
      };
      this.AreaCrudService.InsertAreaService(data).subscribe(
        respuesta => {
          if (this.CryptoServiceService.decryptData(respuesta)?.resultado?.res) {
            this.flasher.success(this.CryptoServiceService.decryptData(respuesta)?.resultado?.data);
            this.router.navigate(['/areas']);
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
