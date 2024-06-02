import { Component } from '@angular/core';
import { SharedValuesService } from '../../services/shared-values.service';

@Component({
  selector: 'app-articulo33',
  templateUrl: './articulo33.component.html',
  styleUrl: './articulo33.component.css'
})
export class Articulo33Component {

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
    this.sharedService.changeTitle('Articulo 33');
}
  getNumbers(): number[] {
    const numbers: number[] = [];
    for (let i = 1; i <= 48; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  isButtonListHidden = true;

  toggleButtonList() {
    this.isButtonListHidden = !this.isButtonListHidden;
  }


}
