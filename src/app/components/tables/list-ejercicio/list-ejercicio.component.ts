import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';

@Component({
  selector: 'app-list-ejercicio',
  templateUrl: './list-ejercicio.component.html',
  styleUrl: './list-ejercicio.component.css'
})
export class ListEjercicioComponent {
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
    this.sharedService.changeTitle('Ejercicios registrados en el sistema');
  }

  getNumbers(): number[] {
    const numbers: number[] = [];
    for (let i = 1; i <= 6; i++) {
      numbers.push(i);
    }
    return numbers;
  }
}
