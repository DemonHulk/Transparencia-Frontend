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

  // Funcion para visualizar los documentos
  openPDF(id_documento_dinamico: any) {
    const encryptedName = this.encodeService.encryptData(JSON.stringify(id_documento_dinamico));
    this.ContenidocrudService.getPDF(encryptedName).subscribe({
      next: (response: any) => {
        
        // Convertir los datos a Uint8Array si no lo son ya
        const uint8Array = response.data instanceof Uint8Array ? response.data : new Uint8Array(response.data);
        
        // Crear un blob con los datos del PDF
        const blob = new Blob([uint8Array], { type: response.mime });
        
        // Crear un objeto URL para el blob
        const url = window.URL.createObjectURL(blob);
        
        // Abrir una nueva ventana con el PDF
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(`
            <html>
              <head>
                <title>${response.filename}</title>
                <style>
                  body { margin: 0; padding: 0; height: 100vh; }
                  object { width: 100%; height: 100%; }
                </style>
              </head>
              <body>
                <object data="${url}" type="${response.mime}">
                  <embed src="${url}" type="${response.mime}" />
                </object>
              </body>
            </html>
          `);
          win.document.close();
        } else {
          this.flasher.error("No se pudo abrir una nueva ventana. Asegúrate de que no esté bloqueada por el navegador.");
        }
        
        // Limpiar recursos después de un tiempo
        setTimeout(() => window.URL.revokeObjectURL(url), 60000);
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
