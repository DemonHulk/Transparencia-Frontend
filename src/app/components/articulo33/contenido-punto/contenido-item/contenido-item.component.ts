import { Component, ElementRef, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FechaService } from '../../../../services/format/fecha.service';
import { SharedValuesService } from '../../../../services/shared-values.service';
import { CryptoServiceService } from '../../../../services/cryptoService/crypto-service.service';
import { ContenidocrudService } from '../../../../services/crud/contenidocrud.service';
import { AlertsServiceService } from '../../../../services/alerts/alerts-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contenido-item',
  templateUrl: './contenido-item.component.html',
  styleUrl: './contenido-item.component.css'
})
export class ContenidoItemComponent  implements OnInit {
  @Input() titulo: any;
  @Input() buscar: any = null;

  constructor(private sanitizer: DomSanitizer,
    private fechaService: FechaService,
    public sharedService: SharedValuesService,
    private encodeService: CryptoServiceService,
    private ContenidocrudService: ContenidocrudService,
    private el:ElementRef,
    private flasher: AlertsServiceService
  ) {
    window.HSStaticMethods.autoInit();

   }
  private subscription!: Subscription;
   ngOnInit(){
      setTimeout(() => {
        window.HSStaticMethods.autoInit();
        if(this.buscar != null){
          this.scrollToTitle(this.buscar);
        }
      });
   }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

   shortTitle(titulo:any): string {
    return titulo.length > 20 ? titulo.substring(0, 20) + '...' : titulo;
  }

  addFormattedDate(fecha: any): any {
    return this.fechaService.formatDate(fecha)
  }

  enviarDatos(titulo: any) {
    const datos = {key:'titulo',titulo:titulo};
    this.sharedService.sendData(datos);
  }

  volver(punto: any) {
    const datos = {key:'punto',punto:punto};
    this.sharedService.sendData(datos);
  }

  openPDF(id_documento_dinamico: any) {
    const encryptedName = this.encodeService.encryptData(JSON.stringify(id_documento_dinamico));
    this.ContenidocrudService.getPDF(encryptedName).subscribe({
      next: (response: any) => {
        const blob = new Blob([response.data], { type: response.mime });
        const url = window.URL.createObjectURL(blob);

        // Crear un elemento <a> oculto para la descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = response.filename || 'documento.pdf';
        link.style.display = 'none';
        document.body.appendChild(link);

        // Abrir el PDF en una nueva pestaña para visualización
        window.open(url, '_blank');

        // Agregar un botón o enlace visible para la descarga
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Descargar PDF';
        downloadButton.onclick = () => {
          link.click();
        };
        document.body.appendChild(downloadButton);

        // Limpiar recursos después de un tiempo
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
          document.body.removeChild(downloadButton);
        }, 100);
      },
      error: (error: Error) => {
        this.flasher.error("No se encontró el archivo");
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes['buscar']){
        const buscarChange: SimpleChange = changes['buscar'];

            this.scrollToTitle(this.buscar);
        }


  }

  scrollToTitle(texto: string) {
    setTimeout(() => {
      // Seleccionar elementos 'h2' y 'h4'
      const headings = this.el.nativeElement.querySelectorAll('h2, h4');

      headings.forEach((heading: HTMLElement) => {
        if (heading.textContent && heading.textContent.trim() === texto) {
          // Obtener las coordenadas del elemento
          const rect = heading.getBoundingClientRect();
          // Calcular la posición de scroll
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = rect.top + scrollTop;

          // Ajustar para el header fijo (ajusta este valor según tu diseño)
          const headerHeight = 60; // Por ejemplo, si tu header tiene 60px de alto

          // Calcular la posición final de scroll
          const targetScrollPosition = elementTop - headerHeight - 40; // 20px de margen adicional

          // Realizar el scroll
          window.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }


}
