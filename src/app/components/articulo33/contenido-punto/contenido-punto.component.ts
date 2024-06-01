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
}
