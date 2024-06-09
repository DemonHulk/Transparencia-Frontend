import {  Component,ViewChild } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { Table } from 'primeng/table';
import { Item, TooltipManager } from '../../../services/api-config';


@Component({
  selector: 'app-list-trimestres',
  templateUrl: './list-trimestres.component.html',
  styleUrl: './list-trimestres.component.css'
})
export class ListTrimestresComponent {
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
    this.sharedService.changeTitle('Trimestres registrados en el sistema');
}

@ViewChild('dt') dt: Table | undefined;

items: Item[] = [
  { nombre: 'Juan Pérez', edad: '28', direccion: 'Calle Falsa 123, Ciudad A' },
  { nombre: 'María Gómez', edad: '34', direccion: 'Avenida Siempre Viva 456, Ciudad B' },
  { nombre: 'Carlos Sánchez', edad: '45', direccion: 'Boulevard de los Sueños Rotos 789, Ciudad C' },
  { nombre: 'Laura Martínez', edad: '23', direccion: 'Calle del Sol 101, Ciudad D' },
  { nombre: 'Pedro Jiménez', edad: '52', direccion: 'Avenida de la Luna 202, Ciudad E' },
  { nombre: 'Ana Rodríguez', edad: '29', direccion: 'Calle Estrella 303, Ciudad F' },
  { nombre: 'Luis Fernández', edad: '38', direccion: 'Avenida de las Flores 404, Ciudad G' },
  { nombre: 'Marta López', edad: '41', direccion: 'Calle del Río 505, Ciudad H' },
  { nombre: 'Jorge García', edad: '33', direccion: 'Boulevard del Mar 606, Ciudad I' },
  { nombre: 'Lucía Díaz', edad: '26', direccion: 'Avenida del Bosque 707, Ciudad J' },
  { nombre: 'Raúl Hernández', edad: '49', direccion: 'Calle de la Montaña 808, Ciudad K' },
  { nombre: 'Sofía Torres', edad: '31', direccion: 'Boulevard del Valle 909, Ciudad L' },
  { nombre: 'Andrés Castro', edad: '22', direccion: 'Calle de las Rosas 111, Ciudad M' },
  { nombre: 'Patricia Morales', edad: '27', direccion: 'Avenida de los Pinos 222, Ciudad N' },
  { nombre: 'Gabriel Romero', edad: '36', direccion: 'Calle de los Álamos 333, Ciudad O' }
];

filterGlobal(event: Event) {
const input = event.target as HTMLInputElement;
if (this.dt) {
  this.dt.filterGlobal(input.value, 'contains');
}
}

  mostrar(elemento: any): void {
    // Verifica si el elemento recibido es un botón
    if (elemento.tagName.toLowerCase() === 'button') {
        const tooltipElement = elemento.querySelector('.hs-tooltip');
        if (tooltipElement) {
            tooltipElement.classList.toggle('show');
            const tooltipContent = tooltipElement.querySelector('.hs-tooltip-content');
            if (tooltipContent) {
                tooltipContent.classList.toggle('hidden');
                tooltipContent.classList.toggle('invisible');
                tooltipContent.classList.toggle('visible');
                // Ajustar la posición del tooltip
                TooltipManager.adjustTooltipPosition(elemento, tooltipContent);
            }
        }
    }
  }

}
