import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';

@Component({
  selector: 'app-new-subtema',
  templateUrl: './new-subtema.component.html',
  styleUrl: './new-subtema.component.css'
})
export class NewSubtemaComponent {
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
    this.sharedService.changeTitle('Registrar un nuevo subtema para el tema: Nombre tema');
}
}
