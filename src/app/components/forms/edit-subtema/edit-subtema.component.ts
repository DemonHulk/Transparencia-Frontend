import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';

@Component({
  selector: 'app-edit-subtema',
  templateUrl: './edit-subtema.component.html',
  styleUrl: './edit-subtema.component.css'
})
export class EditSubtemaComponent {
  constructor(private sharedService: SharedValuesService) { }

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
    this.sharedService.changeTitle('Modificar subtema para el tema: Nombre tema');
    this.sharedService.loadScript("/assets/js/validations.js");
}
}
