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
        if(this.tituloSeleccionado > 0){
          this.onTemaSeleccionado(this.tituloSeleccionado, this.tipoContenidoSeleccionado, this.temaSeleccionado);
        }else{
          this.onTemaSeleccionado(this.ListTitulos[0].id_titulo, this.ListTitulos[0].tipo_contenido, 0);
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
            this.printHTML(this.ListContenidoEstatico[0].contenido);
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
  printHTML(contenido:any) {
    const html = contenido || '';

    // Crear un elemento temporal para manipular el contenido HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html || '';

    // Buscar todos los elementos con estilo "text-align: center" y agregarles la clase "text-center"
    const elementsWithCenterAlign = tempElement.querySelectorAll('[style*="text-align: center;"]');
    elementsWithCenterAlign.forEach(element => {
      element.classList.add('text-center');
    });

    const elementsWithLeftAlign = tempElement.querySelectorAll('[style*="text-align: left;"]');
    elementsWithLeftAlign.forEach(element => {
      element.classList.add('text-left');
    });

    const elementsWithRightAlign = tempElement.querySelectorAll('[style*="text-align: right;"]');
    elementsWithRightAlign.forEach(element => {
      element.classList.add('text-right');
    });

    const elementsWithUnderline = tempElement.querySelectorAll('[style*="text-decoration: underline;"]');
    elementsWithUnderline.forEach(element => {
      element.classList.add('underline');
    });

    // Seleccionar todas las tablas dentro del contenido HTML
   // Seleccionar todas las tablas en tempElement
  const tables = tempElement.querySelectorAll('table');

  tables.forEach(table => {
    // Añadir las clases específicas a la tabla
    table.classList.add('w-full', 'table-auto', 'table-satic');

    // Crear el contenedor principal (flexDiv) y asignar las clases correspondientes
    const flexDiv = document.createElement('div');
    flexDiv.classList.add('flex', 'flex-col', 'mb-5');

    // Crear el primer div (outerDiv) y asignar las clases correspondientes
    const outerDiv = document.createElement('div');
    outerDiv.classList.add('-m-1.5', 'overflow-x-auto');

    // Crear el segundo div (innerDiv1) y asignar las clases correspondientes
    const innerDiv1 = document.createElement('div');
    innerDiv1.classList.add('p-1.5', 'min-w-full', 'inline-block', 'align-middle');

    // Crear el tercer div (innerDiv2) y asignar las clases correspondientes
    const innerDiv2 = document.createElement('div');
    innerDiv2.classList.add('border', 'rounded-lg', 'overflow-hidden', 'my-2');

    // Clonar la tabla original y asignarle la clase correspondiente
    const clonedTable:any = table.cloneNode(true);
    clonedTable.classList.add('min-w-full', 'divide-y');

    // Agregar la tabla clonada a innerDiv2
    innerDiv2.appendChild(clonedTable);

    // Anidar los divs
    innerDiv1.appendChild(innerDiv2);
    outerDiv.appendChild(innerDiv1);
    flexDiv.appendChild(outerDiv);

    // Reemplazar la tabla original con flexDiv
    table.replaceWith(flexDiv);

    // Seleccionar todos los th dentro de la tabla clonada

    // Seleccionar el primer tr dentro de la tabla clonada y agregar clase
    const firstRow = innerDiv2.querySelector('tr');
    if (firstRow) {
      firstRow.classList.add('bg-table-header-color', 'text-left','divide-x','divide-y', 'divide-gray-200','rounded-lg');

      // Seleccionar todos los td dentro del primer tr
      const firstRowTds = firstRow.querySelectorAll('td');
      firstRowTds.forEach(td => {
        td.classList.add('px-6', 'text-start', 'py-3', 'text-xs', 'text-white', 'uppercase');
      });
    }

    //Sleeccionas los demas tr
    const tableTRCells = innerDiv2.querySelectorAll('tr:not(:first-child)');
    tableTRCells.forEach(tr => {
      tr.classList.add('divide-x','divide-y', 'divide-gray-200');
    });

    // Seleccionar todos los td dentro de la tabla, excepto el primer tr
    const tableDataCells = innerDiv2.querySelectorAll('tr:not(:first-child) td');
    tableDataCells.forEach(td => {
      td.classList.add('text-gray-800', 'text-sm', 'px-3', 'py-2');
    });

  });


    // Asignar el contenido modificado a la propiedad htmlContent
    this.htmlContent = tempElement.innerHTML;
  }


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
  openPDF(nombre_interno_documento: any) {
    const encryptedName = this.encodeService.encryptData(JSON.stringify(nombre_interno_documento));
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
