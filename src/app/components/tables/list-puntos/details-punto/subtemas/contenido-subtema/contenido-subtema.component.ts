import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, input } from '@angular/core';
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
  htmlContent:any;

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

  ){
    window.HSStaticMethods.autoInit();

     //Tomas la id de la URL
     this.idPunto = this.activateRoute.snapshot.paramMap.get("punto");
     this.idPuntoEncrypt = this.idPunto;
  }

  ListPdfs: (PDF & { fecha_string: string })[] = [];
  ListpdfsActivos: (PDF & { fecha_string: string })[] = [];
  ListpdfsInactivos: (PDF & { fecha_string: string })[] = [];

  ngOnInit() {
    window.HSStaticMethods.autoInit();

    // Verificar que this.subtitulo no sea undefined antes de asignar valores
    if (this.subtitulo) {
        this.idTema = this.subtitulo.id_titulo;
        this.idTemaEncrypt = this.encodeService.encodeID(this.subtitulo.id_titulo);
    }
   if(this.subtitulo.tipo_contenido == 2){
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

  encriptarId(id:any){
    return  this.encodeService.encodeID(id  );
  }


  ActivateTitulo(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {


        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.TituloscrudService.ActivateTituloService(encryptedID).subscribe(respuesta => {
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          setTimeout(() => {
          this.sharedService.sendData({key:'cargarInfo', bool: true});

            this.sharedService.setLoading(false);
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
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          setTimeout(() => {
            this.sharedService.sendData({key:'cargarInfo', bool: true});
            this.sharedService.setLoading(false);
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


  // Funcion para descargar el documento
  downloadPDF(id_documento_interno: any, nombre_interno_documento:string) {
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
          this.sharedService.sendData({key:'cargarInfo', bool: true});

          setTimeout(() => {

            this.sharedService.setLoading(false);
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
          this.sharedService.sendData({key:'cargarInfo', bool: true});

          setTimeout(() => {

            this.sharedService.setLoading(false);
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
          this.sharedService.sendData({key:'cargarInfo', bool: true});

            setTimeout(() => {
              this.sharedService.setLoading(false);
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
          this.sharedService.sendData({key:'cargarInfo', bool: true});

            setTimeout(() => {
              this.sharedService.setLoading(false);
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
