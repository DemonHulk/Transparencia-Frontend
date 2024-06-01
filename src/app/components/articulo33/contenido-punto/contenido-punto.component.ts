import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contenido-punto',
  templateUrl: './contenido-punto.component.html',
  styleUrl: './contenido-punto.component.css'
})
export class ContenidoPuntoComponent {
  @Input() title: string = 'Manual Gubernamental de Contabilidad (UTC)';
  get shortTitle(): string {
    return this.title.length > 20 ? this.title.substring(0,20) + '...' : this.title;
  }

  descripcion: string = 'El Manual Gubernamental de Contabilidad (UTC) es una guía exhaustiva destinada a estandarizar y mejorar los  procesos contables dentro de las entidades gubernamentales. Este manual establece un conjunto uniforme de principios, normas y procedimientos contables que deben seguir las instituciones públicas para garantizar la transparencia, eficiencia y precisión en la gestión financiera.';
}
