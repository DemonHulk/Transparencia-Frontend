import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SharedValuesService } from '../../../../services/shared-values.service';
import { PuntocrudService } from '../../../../services/crud/puntocrud.service';
import { FechaService } from '../../../../services/format/fecha.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsServiceService } from '../../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../../services/cryptoService/crypto-service.service';
import { ContenidoEstatico, PDF, Punto, Titulo, TooltipManager } from '../../../../services/api-config';
import { TituloscrudService } from '../../../../services/crud/tituloscrud.service';
import { ContenidocrudService } from '../../../../services/crud/contenidocrud.service';
import { Table } from 'primeng/table';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-details-punto',
  templateUrl: './details-punto.component.html',
  styleUrl: './details-punto.component.css'
})
export class DetailsPuntoComponent {

  @ViewChild('dtActive') dtActive: Table | undefined;
  @ViewChild('dtInactive') dtInactive: Table | undefined;

  id: any;
  idEncrypt:any;
  DataPunto: any;
  ListPunto: Punto[] = [];
  ListTitulos: Titulo[] = [];
  data_usuariosacceso: any;
  // Varaible para almacenar el contenido dinamico
  ListPdfs: (PDF & { fecha_string: string })[] = [];
  ListpdfsActivos: (PDF & { fecha_string: string })[] = [];
  ListpdfsInactivos: (PDF & { fecha_string: string })[] = [];
  // Variable para almacenar el contenido estatico
  ListContenidoEstatico: (ContenidoEstatico & { fecha_string: string })[] = [];

  @Input() content: string = '';
  safeContent: SafeHtml;

  constructor(
    public sharedService: SharedValuesService,
    private el: ElementRef,
    private FechaService: FechaService,
    private activateRoute: ActivatedRoute,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private TituloscrudService: TituloscrudService,
    private router: Router,
    private PuntocrudService: PuntocrudService,
    private ContenidocrudService: ContenidocrudService,
    private sanitizer: DomSanitizer
  ) {
    // Varible para el codigo de la tabla
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml('');

    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");
    this.idEncrypt = this.id;

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de puntos
    if (this.id === null) {
      this.router.navigateByUrl("/puntos");
    }

    this.sharedService.setLoading(true);


  }

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
      this.sharedService.changeTitle('Información detallada del punto: Normativas de la institución');
      this.GetOnePuntoService(this.id);
      this.GetTitulosPunto(this.id);
  }

// GetOnePuntoService

  /* Extraer los datos del area que se esta visualizando el detalle */
  GetOnePuntoService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.PuntocrudService.GetOnePuntoService(encryptedID).subscribe(
      respuesta => {
        this.DataPunto = this.encodeService.decryptData(respuesta)?.resultado?.data;
        this.sharedService.changeTitle('Información detallada del punto: ' + this.DataPunto?.nombre_punto);
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'details-punto/'+this.idEncrypt });
      }
    );
  }


  /** Desactiva un titulo */
  DeleteTitulo(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
      this.sharedService.setLoading(true);

        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.TituloscrudService.DeleteTituloService(encryptedID).subscribe(respuesta => {
          this.GetTitulosPunto(this.id);
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          setTimeout(() => {
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        });
      }
    });
  }

    /** Activa un titulo */
    ActivateTitulo(id: any) {
      this.flasher.reactivar().then((confirmado) => {
        if (confirmado) {
      this.sharedService.setLoading(true);

          // Enviamos la id encriptada
          const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
          this.TituloscrudService.ActivateTituloService(encryptedID).subscribe(respuesta => {
            this.GetTitulosPunto(this.id);
            this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
            setTimeout(() => {
              this.sharedService.setLoading(false);
              window.HSStaticMethods.autoInit();
            }, 500);
          });
        }
      });
    }


  /* Extraer los datos del area que se esta visualizando el detalle */
  GetTitulosPunto(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.TituloscrudService.GetTitulosPunto(encryptedID).subscribe(
      respuesta => {
        this.ListTitulos = this.encodeService.decryptData(respuesta)?.resultado?.data;
        this.sharedService.setLoading(false);
        if(this.ListTitulos && this.ListTitulos.length > 0){
          if(this.tituloSeleccionado > 0){
            this.onTemaSeleccionado(this.tituloSeleccionado, this.tipoContenidoSeleccionado, this.temaSeleccionado);
          }else{
            this.onTemaSeleccionado(this.ListTitulos[0].id_titulo, this.ListTitulos[0].tipo_contenido, 0);
          }
        }
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'details-punto/'+this.idEncrypt });
      }
    );
  }



  // Funcion que actualiza los datos del contenido si se cambia de tema
  temaSeleccionado: any = 0;
  tituloSeleccionado: any = 0;
  tipoContenidoSeleccionado: any = 0;

  isActive(i: number): boolean {
    return this.temaSeleccionado === i;
  }
  // Funcion que actualiza los datos del contenido si se cambia de tema
  onTemaSeleccionado(id_titulo:any, tipo_contenido:any, i:any) {
    this.tituloSeleccionado = id_titulo;
    this.tipoContenidoSeleccionado = tipo_contenido;
    this.temaSeleccionado = i;
    // 2 Contenido dinamico(PDF)
    if( tipo_contenido == 2){
      this.cargarPDFsPorTema(id_titulo);
    }else{
      this.cargarContenidoEstaticoPorTema(id_titulo);
      this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.content);
    }
  }

  // Funcion que consigue el contenido dinamico del punto
  cargarPDFsPorTema(id_titulo: any) {
    // Encriptamos la id del titulo
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id_titulo));
    this.ContenidocrudService.GetAllContenidoDinamicoService(encryptedID).subscribe(
      respuesta => {
        /* Desencriptamos la respuesta que nos retorna el backend */
        this.ListPdfs = this.encodeService.decryptData(respuesta).resultado?.data.map((pdf: PDF) => this.addFormattedDate(pdf));
        // Filtrar el contenido activo e inactivo
        this.ListpdfsActivos = this.ListPdfs.filter(pdf => pdf.activo === true);
        this.ListpdfsInactivos = this.ListPdfs.filter(pdf => pdf.activo === false);
        // Indicar que todos los datos se han cargado
        setTimeout(() => {
          this.sharedService.setLoading(false);
          window.HSStaticMethods.autoInit();
        }, 500);
        },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'Error al cargar PDFs del título'});
      }
    );
  }
  private addFormattedDate(pdf: PDF): PDF & { fecha_string: string } {
    return {
      ...pdf,
      fecha_string: this.FechaService.formatDate(pdf.fecha_actualizado)
    };
  }

  // Funcion para desactivar un contenido dinamico
  DeleteContenidoDinamico(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.ContenidocrudService.DeleteContenidoDinamicoService(encryptedID).subscribe(respuesta => {
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          setTimeout(() => {
            if(this.tituloSeleccionado > 0){
              this.onTemaSeleccionado(this.tituloSeleccionado, this.tipoContenidoSeleccionado, this.temaSeleccionado);
            }
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        });
      }
    });
  }

  // Funcion para activar un contenido dinamico
  ActivateContenidoDinamico(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.ContenidocrudService.ActivateContenidoDinamicoService(encryptedID).subscribe(respuesta => {
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          setTimeout(() => {
            if(this.tituloSeleccionado > 0){
              this.onTemaSeleccionado(this.tituloSeleccionado, this.tipoContenidoSeleccionado, this.temaSeleccionado);
            }
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        });
      }
    });
  }

  // Funcion que consigue el contenido estatico del punto
  cargarContenidoEstaticoPorTema(id_titulo: any) {
    // Encriptamos la id del titulo
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id_titulo));
    this.ContenidocrudService.GetAllContenidoEstaticoService(encryptedID).subscribe(
      respuesta => {
        // Desencriptamos la respuesta que nos retorna el backend
        const decryptedData = this.encodeService.decryptData(respuesta);
        if (decryptedData?.resultado?.data) {
          this.ListContenidoEstatico = decryptedData.resultado.data.map((contenidoestatico: ContenidoEstatico) => this.addFormattedDate2(contenidoestatico));
          // Verifica si this.ListContenidoEstatico tiene al menos un elemento y si ese elemento tiene la propiedad contenido
          if (this.ListContenidoEstatico.length > 0 && this.ListContenidoEstatico[0].contenido) {
            this.htmlContent = this.ListContenidoEstatico[0].contenido;
          }
        } else {
          this.sharedService.updateErrorLoading(this.el, { message: 'Error al conseguir los datos del contenido estático.' });
        }
        setTimeout(() => {
          this.sharedService.setLoading(false);
          window.HSStaticMethods.autoInit();
        }, 500);
      },
      error => {
        console.error('Error en la llamada al servicio:', error);
        this.sharedService.updateErrorLoading(this.el, { message: 'Error al cargar el contenido estático del título.' });
      }
    );
  }
  private addFormattedDate2(contenidoestatico: ContenidoEstatico): ContenidoEstatico & { fecha_string: string } {
    return {
      ...contenidoestatico,
      fecha_string: this.FechaService.formatDate(contenidoestatico.fecha_actualizado)
    };
  }

  // Funcion para desactivar un contenido Estatico
  DeleteContenidoEstatico(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.ContenidocrudService.DeleteContenidoEstaticoService(encryptedID).subscribe(respuesta => {
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          setTimeout(() => {
            if(this.tituloSeleccionado > 0){
              this.onTemaSeleccionado(this.tituloSeleccionado, this.tipoContenidoSeleccionado, this.temaSeleccionado);
            }
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
          setTimeout(() => {
            if(this.tituloSeleccionado > 0){
              this.onTemaSeleccionado(this.tituloSeleccionado, this.tipoContenidoSeleccionado, this.temaSeleccionado);
            }
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        });
      }
    });
  }

  // Funcion para sanitizar el html para mostrar la tabla con el diseño de preline
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // Variable que almacenara los datos estaticos para mostrar
  htmlContent:any;



  getNumbersSubtema(): number[] {
    const numbers: number[] = [];
    for (let i = 1; i <= 3; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }

  // Funcion para visualizar los documentos
  openPDF(id_documento_dinamico: any, nombre_interno_documento: string) {
    console.log(nombre_interno_documento);
    const encryptedName = this.encodeService.encryptData(JSON.stringify(id_documento_dinamico));
    this.ContenidocrudService.getPDF(encryptedName).subscribe({
      next: (response: any) => {
        console.log(response);
        
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


  /**
  * Actualiza la fecha de formato YYYY-MM-DD a
  */
  FormatearDate(fecha: any) {
    if (!fecha) {
      return ''; // O cualquier valor predeterminado que prefieras
    }
    return this.FechaService.formatDate(fecha);
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
