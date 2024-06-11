import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
@Component({
  selector: 'app-new-trimestre',
  templateUrl: './new-trimestre.component.html',
  styleUrl: './new-trimestre.component.css'
})
export class NewTrimestreComponent {

  years: number[] = [];
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
    this.sharedService.changeTitle('Registrar un nuevo trimestre');
    this.sharedService.loadScript("/assets/js/validations.js");

    this.generateYears();
}

generateYears(): void {
  const startYear = 2014;
  const currentYear = new Date().getFullYear();
  for (let year = startYear; year <= currentYear; year++) {
    this.years.push(year);
  }
}


}
