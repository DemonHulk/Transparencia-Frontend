import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SharedValuesService } from '../../../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FechaService } from '../../../../../services/format/fecha.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CryptoServiceService } from '../../../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../../../services/alerts/alerts-service.service';
import { ContenidoEstatico, PDF, SubTema, Titulo, TooltipManager } from '../../../../../services/api-config';
import { SubtituloCrudService } from '../../../../../services/crud/subtitulo-crud.service';
import { TituloscrudService } from '../../../../../services/crud/tituloscrud.service';
import { ContenidocrudService } from '../../../../../services/crud/contenidocrud.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-subtemas',
  templateUrl: './subtemas.component.html',
  styleUrl: './subtemas.component.css'
})
export class SubtemasComponent {

  @ViewChild('dtActive') dtActive: Table | undefined;
  @ViewChild('dtInactive') dtInactive: Table | undefined;

  idPunto: any;
  idPuntoEncrypt: any;
  idTema: any;
  idTemaEncrypt: any;
  Tema: any;
  ListTitulos: Titulo[] = [];
  ListSubtema: SubTema[] = [];
  ListContenidoEstatico: (ContenidoEstatico & { fecha_string: string })[] = [];

  // Varaible para almacenar el contenido dinamico
  ListPdfs: (PDF & { fecha_string: string })[] = [];
  ListpdfsActivos: (PDF & { fecha_string: string })[] = [];
  ListpdfsInactivos: (PDF & { fecha_string: string })[] = [];

  // Variable que almacenara los datos estaticos para mostrar
  htmlContent:any;

  // Funcion que actualiza los datos del contenido si se cambia de tema
  temaSeleccionado: any = 0;
  tituloSeleccionado: any = 0;
  tipoContenidoSeleccionado: any = 0;

  @Input() content: string = '';
  safeContent: SafeHtml;

  constructor(
    public sharedService: SharedValuesService,
    private el: ElementRef,
    private FechaService: FechaService,
    private activateRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private encodeService: CryptoServiceService,
    private flasher: AlertsServiceService,
    private SubtituloCrudService: SubtituloCrudService,
    private TituloscrudService: TituloscrudService,
    private ContenidocrudService: ContenidocrudService,
  ){
    this.sharedService.setLoading(true);

    // Varible para el codigo de la tabla
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml('');

     //Tomas la id de la URL
     this.idPunto = this.activateRoute.snapshot.paramMap.get("punto");
     this.idPuntoEncrypt = this.idPunto;

     this.idTema = this.activateRoute.snapshot.paramMap.get("tema");
     this.idTemaEncrypt = this.idTema;


     //Desencriptar la ID
     this.idPunto = this.encodeService.decodeID(this.idPunto);
     this.idTema = this.encodeService.decodeID(this.idTema);

     //Verificar si la ID es null, si es así, redirige a la página de puntos
     if (this.idPunto === null) {
       this.router.navigateByUrl("/puntos");
     }
     if (this.idTema === null) {
      this.router.navigateByUrl("/details-punto/"+this.idPuntoEncrypt);
    }
    this.sharedService.setLoading(false);

  }

  ngOnInit(): void {

    this.GetTitulosPunto(this.idTema);
    this.GetSubtemasDelTemaService(this.idTema);
  }


  /* extraer datos de TEMA */
  GetTitulosPunto(id: any) {
    this.sharedService.setLoading(true);
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.TituloscrudService.GetOneTituloService(encryptedID).subscribe(
      respuesta => {
        this.Tema = this.encodeService.decryptData(respuesta)?.resultado?.data || [];
        this.sharedService.setLoading(false);
        this.sharedService.changeTitle('Administrar subtemas del tema: ' + this.Tema?.nombre_titulo);
        this.sharedService.setLoading(false);
      
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'details-punto/'+encryptedID });
        this.sharedService.setLoading(false);
      }
    );
  }

  /* extrae SUBTEMAS de un TEMA */
  GetSubtemasDelTemaService(id: any) {
    this.sharedService.setLoading(true);
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.SubtituloCrudService.GetSubtemasDelTemaService(encryptedID).subscribe(
      respuesta => {
        this.ListSubtema = this.encodeService.decryptData(respuesta)?.resultado?.data || [];
        this.sharedService.setLoading(false);
        this.sharedService.setLoading(false);
      },
      error => {
        this.sharedService.updateErrorLoading(this.el, { message: 'details-punto/'+encryptedID });
        this.sharedService.setLoading(false);
      }
    );
  }

  /** Desactiva un Subtema */
  DeleteSubtema(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
      this.sharedService.setLoading(true);

        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.SubtituloCrudService.DeleteSubtemaService(encryptedID).subscribe(respuesta => {
          this.GetSubtemasDelTemaService(this.idTema);
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          setTimeout(() => {
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        });
      }
    });
  }



    /** Activa un Subtema */
    ActivateSubtema(id: any) {
      this.flasher.reactivar().then((confirmado) => {
        if (confirmado) {
          this.sharedService.setLoading(true);
  
          // Enviamos la id encriptada
          const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
          this.SubtituloCrudService.ActivateSubtemaService(encryptedID).subscribe(respuesta => {
            this.GetSubtemasDelTemaService(this.idTema);
            this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
            setTimeout(() => {
              this.sharedService.setLoading(false);
              window.HSStaticMethods.autoInit();
            }, 500);
          });
        }
      });
    }
    
  private addFormattedDate2(contenidoestatico: ContenidoEstatico): ContenidoEstatico & { fecha_string: string } {
    return {
      ...contenidoestatico,
      fecha_string: this.FechaService.formatDate(contenidoestatico.fecha_actualizado)
    };
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


  // Funcion para sanitizar el html para mostrar la tabla con el diseño de preline
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


  encriptarId(id:any){
    return this.encodeService.encodeID(id);
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

  // Funciones para los filtros y tooltips de la tabla
  filterGlobalActive(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dtActive) {
      this.dtActive.filterGlobal(input.value, 'contains');
    }
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

  filterGlobalInactive(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dtInactive) {
      this.dtInactive.filterGlobal(input.value, 'contains');
    }
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

  /**
  * Actualiza la fecha de formato YYYY-MM-DD a
  */
  FormatearDate(fecha: any) {
    if (!fecha) {
      return ''; // O cualquier valor predeterminado que prefieras
    }
    return this.FechaService.formatDate(fecha);
  }

  private addFormattedDate(pdf: PDF): PDF & { fecha_string: string } {
    return {
      ...pdf,
      fecha_string: this.FechaService.formatDate(pdf.fecha_actualizado)
    };
  }
  
}
