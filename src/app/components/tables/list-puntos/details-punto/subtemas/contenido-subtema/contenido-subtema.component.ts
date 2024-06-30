import { Component, ElementRef, EventEmitter, Input, Output, SimpleChange, SimpleChanges, ViewChild, input } from '@angular/core';
import { SharedValuesService } from '../../../../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoServiceService } from '../../../../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../../../../services/alerts/alerts-service.service';
import { TituloscrudService } from '../../../../../../services/crud/tituloscrud.service';
import { Table } from 'primeng/table';
import { FechaService } from '../../../../../../services/format/fecha.service';
import { ContenidoEstatico, PDF, TooltipManager } from '../../../../../../services/api-config';
import { ContenidocrudService } from '../../../../../../services/crud/contenidocrud.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-contenido-subtema',
  templateUrl: './contenido-subtema.component.html',
  styleUrl: './contenido-subtema.component.css'
})
export class ContenidoSubtemaComponent {
  @ViewChild('dtActive') dtActive: Table | undefined;
  @ViewChild('dtInactive') dtInactive: Table | undefined;
  @Input() subtitulo: any;
  idPunto: any;
  idPuntoEncrypt: any;
  idTema: any;
  idTemaEncrypt: any;
  ListContenidoEstatico: (ContenidoEstatico & { fecha_string: string })[] = [];
  htmlContent: any;

  constructor(
    public sharedService: SharedValuesService,
    private el: ElementRef,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private flasher: AlertsServiceService,
    private TituloscrudService: TituloscrudService,
    private FechaService: FechaService,
    private ContenidocrudService: ContenidocrudService,
    private sanitizer: DomSanitizer,

    private encodeService: CryptoServiceService,

  ) {
    window.HSStaticMethods.autoInit();

    //Tomas la id de la URL
    this.idPunto = this.activateRoute.snapshot.paramMap.get("punto");
    this.idPuntoEncrypt = this.idPunto;
  }

  ListPdfs: (PDF & { fecha_string: string })[] = [];
  ListpdfsActivos: (PDF & { fecha_string: string })[] = [];
  ListpdfsInactivos: (PDF & { fecha_string: string })[] = [];


  ngOnChanges(changes: SimpleChanges) {
    if (changes['subtitulo']){
      const subtituloChange: SimpleChange = changes['subtitulo'];
      this.subtitulo = subtituloChange.currentValue;
      this.calcularPdf();
      this.idTema = this.subtitulo.id_titulo;
      this.idTemaEncrypt = this.encodeService.encodeID(this.subtitulo.id_titulo);
      setTimeout(() => {
        window.HSStaticMethods.autoInit();
        });
      }
}
  ngOnInit() {
    setTimeout(() => {
    window.HSStaticMethods.autoInit();
    });
    // Verificar que this.subtitulo no sea undefined antes de asignar valores
    if (this.subtitulo) {
      this.idTema = this.subtitulo.id_titulo;
      this.idTemaEncrypt = this.encodeService.encodeID(this.subtitulo.id_titulo);
    }
  }

  calcularPdf(){
    if (this.subtitulo?.tipo_contenido == 2) {
      this.ListPdfs = this.subtitulo.contenido.map((pdf: PDF) => this.addFormattedDate(pdf));
      // Filtrar el contenido activo e inactivo
      this.ListpdfsActivos = this.ListPdfs.filter(pdf => pdf.activo === true);
      this.ListpdfsInactivos = this.ListPdfs.filter(pdf => pdf.activo === false);
    }
  }
  private addFormattedDate(pdf: PDF): PDF & { fecha_string: string } {
    return {
      ...pdf,
      fecha_string: this.FechaService.formatDate(pdf.fecha_actualizado)
    };
  }

  encriptarId(id: any) {
    return this.encodeService.encodeID(id);
  }


  ActivateTitulo(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {



        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.TituloscrudService.ActivateTituloService(encryptedID).subscribe(respuesta => {
          this.flasher.success("Subtema activado");
          setTimeout(() => {
            this.sharedService.sendData({ key: 'cargarInfo', bool: true });

                window.HSStaticMethods.autoInit();

          }, 500);
        });
      }
    });
  }

  DeleteTitulo(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {



        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.TituloscrudService.DeleteTituloService(encryptedID).subscribe(respuesta => {
          this.flasher.success("Subtema desactivado");
          setTimeout(() => {
            this.sharedService.sendData({ key: 'cargarInfo', bool: true });
                window.HSStaticMethods.autoInit();

          }, 500);
        });
      }
    });
  }

  // Funciones para los filtros y tooltips de la tabla
  filterGlobalActive(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dtActive) {
      this.dtActive.filterGlobal(input.value, 'contains');
    }
  }

  filterGlobalInactive(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dtInactive) {
      this.dtInactive.filterGlobal(input.value, 'contains');
    }
  }

  FormatearDate(fecha: any) {
    if (!fecha) {
      return ''; // O cualquier valor predeterminado que prefieras
    }
    return this.FechaService.formatDate(fecha);
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


  // Funcion para descargar el documento
  downloadPDF(id_documento_interno: any, nombre_interno_documento: string) {
    const encryptedName = this.encodeService.encryptData(JSON.stringify(id_documento_interno));
    this.ContenidocrudService.getDowndloadPDF(encryptedName).subscribe({
      next: (blob: Blob) => {
        // Crear un objeto URL para el blob
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace temporal para forzar la descarga del archivo
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre_interno_documento;  // O el nombre que desees para el archivo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revocar la URL del objeto después de un corto tiempo
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      },
      error: (error: Error) => {
        this.flasher.error("No se encontró el archivo");
      }
    });
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



  DeleteContenidoEstatico(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.ContenidocrudService.DeleteContenidoEstaticoService(encryptedID).subscribe(respuesta => {
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          this.sharedService.sendData({ key: 'cargarInfo', bool: true });

          setTimeout(() => {

                window.HSStaticMethods.autoInit();

          }, 500);
        });
      }
    });
  }

  // Funcion para activar un contenido Estatico
  ActivateContenidoEstatico(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.ContenidocrudService.ActivateContenidoEstaticoService(encryptedID).subscribe(respuesta => {
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          this.sharedService.sendData({ key: 'cargarInfo', bool: true });

          setTimeout(() => {

                window.HSStaticMethods.autoInit();

          }, 500);
        });
      }
    });
  }


  // Funcion para desactivar un contenido dinamico
  DeleteContenidoDinamico(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.ContenidocrudService.DeleteContenidoDinamicoService(encryptedID).subscribe(respuesta => {
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          this.sharedService.sendData({ key: 'cargarInfo', bool: true });

          setTimeout(() => {
                window.HSStaticMethods.autoInit();

          }, 500);
        });
      }
    });
  }

  ActivateContenidoDinamico(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.ContenidocrudService.ActivateContenidoDinamicoService(encryptedID).subscribe(respuesta => {
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          this.sharedService.sendData({ key: 'cargarInfo', bool: true });

          setTimeout(() => {
                window.HSStaticMethods.autoInit();

          }, 500);
        });
      }
    });
  }


  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
