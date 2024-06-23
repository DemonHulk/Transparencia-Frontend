import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FechaService } from '../../../../services/format/fecha.service';

@Component({
  selector: 'app-contenido-item',
  templateUrl: './contenido-item.component.html',
  styleUrl: './contenido-item.component.css'
})
export class ContenidoItemComponent {

  constructor(private sanitizer: DomSanitizer,
    private fechaService: FechaService
  ) { }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  @Input() titulo: any;
  @Input() title: string = 'Manual Gubernamental de Contabilidad (UTC)';

  get shortTitle(): string {
    return this.title.length > 20 ? this.title.substring(0, 20) + '...' : this.title;
  }
  descripcion: string = 'El Manual Gubernamental de Contabilidad (UTC) es una guía exhaustiva destinada a estandarizar y mejorar los  procesos contables dentro de las entidades gubernamentales. Este manual establece un conjunto uniforme de principios, normas y procedimientos contables que deben seguir las instituciones públicas para garantizar la transparencia, eficiencia y precisión en la gestión financiera.';


  addFormattedDate(fecha: any): any {
    return this.fechaService.formatDate(fecha)
  }

}
