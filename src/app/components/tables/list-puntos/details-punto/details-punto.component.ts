import { Component } from '@angular/core';
import { SharedValuesService } from '../../../../services/shared-values.service';

@Component({
  selector: 'app-details-punto',
  templateUrl: './details-punto.component.html',
  styleUrl: './details-punto.component.css'
})
export class DetailsPuntoComponent {
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
    this.sharedService.changeTitle('Información detallada del punto: Normativas de la institución');
}

getNumbers(): number[] {
  const numbers: number[] = [];
  for (let i = 1; i <= 6; i++) {
    numbers.push(i);
  }
  return numbers;
}

getNumbersSubtema(): number[] {
  const numbers: number[] = [];
  for (let i = 1; i <= 3; i++) {
    numbers.push(i);
  }
  return numbers;
}
}
