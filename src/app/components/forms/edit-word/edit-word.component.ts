import { Component, ElementRef, ViewChild } from '@angular/core';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { SharedValuesService } from '../../../services/shared-values.service';
import { ContenidoEstatico, markFormGroupTouched } from '../../../services/api-config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { ContenidocrudService } from '../../../services/crud/contenidocrud.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FechaService } from '../../../services/format/fecha.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TituloscrudService } from '../../../services/crud/tituloscrud.service';

@Component({
  selector: 'app-edit-word',
  templateUrl: './edit-word.component.html',
  styleUrl: './edit-word.component.css'
})
export class EditWordComponent {
  FormAltaContent: FormGroup;
  id_contenido_estatico: any;
  id_punto: any;
  datosUsuario: any;
  es_tema: boolean = false;
  id_tema: any;
  idTemaEncrypt: any;

  constructor(
    public sharedService: SharedValuesService,
    private formulario: FormBuilder,
    private activateRoute: ActivatedRoute,
    private CryptoServiceService: CryptoServiceService,
    private ContenidocrudService: ContenidocrudService,
    private FechaService: FechaService,
    private flasher: AlertsServiceService,
    private el: ElementRef,
    private router: Router,
    private sanitizer: DomSanitizer,
    private TituloscrudService: TituloscrudService

  ) {
    //Tomas la id de la URL
    this.id_contenido_estatico = this.activateRoute.snapshot.paramMap.get("contenido");
    this.id_punto = this.activateRoute.snapshot.paramMap.get("punto");

    if (this.activateRoute.snapshot.paramMap.has('subtema')) {
      this.id_tema = this.activateRoute.snapshot.paramMap.get("subtema");
      this.id_tema = this.CryptoServiceService.decodeID(this.id_tema);

      this.TituloscrudService.GetTitulosPadre(this.CryptoServiceService.encryptData(JSON.stringify(this.id_tema))).subscribe(
        respuesta => {
          this.idTemaEncrypt = this.CryptoServiceService.encodeID(this.CryptoServiceService.decryptData(respuesta)?.resultado.id_titulo);
        },
        error => {
        }
      );

      this.es_tema = true;
      console.log("es tema ")
    }

    //Desencriptar la ID
    this.id_contenido_estatico = this.CryptoServiceService.decodeID(this.id_contenido_estatico);
    this.id_punto = this.CryptoServiceService.decodeID(this.id_punto);
    this.datosUsuario = this.CryptoServiceService.desencriptarDatosUsuario()
    //Verificar si la ID es null, si es así, redirige a la página de puntos
    if (this.id_contenido_estatico === null) {
      this.router.navigateByUrl("/puntos");
    }
    this.FormAltaContent = this.formulario.group({
      htmlContent: ['', [Validators.required, Validators.minLength(10)]],
      id_usuario: [this.datosUsuario?.id_usuario,
      [
        Validators.required,
      ],
      ],
      orden: [''
      ]
    });
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
    this.sharedService.changeTitle('Modificar el contenido');
    this.cargarContenidoEstaticoPorTema();
  }

  ListContenidoEstatico: (ContenidoEstatico & { fecha_string: string })[] = [];

  cargarContenidoEstaticoPorTema() {
    this.sharedService.setLoading(true);
    const encryptedID = this.CryptoServiceService.encryptData(JSON.stringify(this.id_contenido_estatico));
    this.ContenidocrudService.GetOneContenidoEstaticoService(encryptedID).subscribe({
      next: (respuesta) => {
        const decryptedData = this.CryptoServiceService.decryptData(respuesta);
        this.ListContenidoEstatico = decryptedData?.resultado?.data?.map((contenidoestatico: any) => this.addFormattedDate2(contenidoestatico));
        if (this.ListContenidoEstatico.length > 0) {
          this.FormAltaContent.patchValue({
            htmlContent: this.removeCustomFormatting(this.ListContenidoEstatico[0].contenido),
            orden: this.ListContenidoEstatico[0].orden
          });
          this.printHTML(this.removeCustomFormatting(this.ListContenidoEstatico[0].contenido));
        }
        setTimeout(() => {
          this.sharedService.setLoading(false);
          window.HSStaticMethods.autoInit();
        }, 500);
      },
      error: (error) => {
        this.sharedService.updateErrorLoading(this.el, { message: 'Error al cargar el contenido estatico' });
      }
    });
  }
  private addFormattedDate2(contenidoestatico: ContenidoEstatico): ContenidoEstatico & { fecha_string: string } {
    return {
      ...contenidoestatico,
      fecha_string: this.FechaService.formatDate(contenidoestatico.fecha_actualizado)
    };
  }


  @ViewChild(EditorComponent) editorComponent!: EditorComponent;
  htmlContent: string = '';
  private previousHtmlContent: string = ''; // Almacenar el contenido HTML anterior

  ngAfterViewInit() {
    setTimeout(() => {
      this.printHTML(null); // Ejecuta printHTML después de que Angular haya completado su ciclo de detección de cambios
    });
  }

  ngAfterViewChecked() {
    if (this.editorComponent && this.editorComponent.editor) {
      const currentContent = this.editorComponent.editor.getContent();
      if (currentContent !== this.previousHtmlContent) {
        setTimeout(() => {
          this.printHTML(null);
        });
      }
    }
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }


  printHTML(html: any) {

    if (html != null) {
      if (this.editorComponent && this.editorComponent.editor) {
        this.editorComponent.editor.setContent(html);
        this.htmlContent = html;
        this.previousHtmlContent = html;
      }
    } else {
      if (this.editorComponent && this.editorComponent.editor) {
        html = this.editorComponent.editor.getContent();
      }
    }
    html = this.removeCustomFormatting(html);

    // Crear un elemento temporal para manipular el contenido HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html || '';

    // Función para agregar clase sin espacios en blanco
    const addClassWithoutSpaces = (element: Element, className: string) => {
      element.classList.add(className.trim());
    };

    // Buscar todos los elementos con estilo "text-align: center" y agregarles la clase "text-center"
    const elementsWithCenterAlign = tempElement.querySelectorAll('[style*="text-align: center;"]');
    elementsWithCenterAlign.forEach(element => {
      addClassWithoutSpaces(element, 'text-center');
    });

    const elementsWithLeftAlign = tempElement.querySelectorAll('[style*="text-align: left;"]');
    elementsWithLeftAlign.forEach(element => {
      addClassWithoutSpaces(element, 'text-left');
    });

    const elementsWithRightAlign = tempElement.querySelectorAll('[style*="text-align: right;"]');
    elementsWithRightAlign.forEach(element => {
      addClassWithoutSpaces(element, 'text-right');
    });

    const elementsWithUnderline = tempElement.querySelectorAll('[style*="text-decoration: underline;"]');
    elementsWithUnderline.forEach(element => {
      addClassWithoutSpaces(element, 'underline');
    });

    const ulElements = tempElement.querySelectorAll('ul');
    ulElements.forEach(ul => {
      addClassWithoutSpaces(ul, 'contenido-lista');
    });

    const aElements = tempElement.querySelectorAll('a');
    aElements.forEach(a => {
      addClassWithoutSpaces(a, 'contenido-link');
    });

    // Seleccionar todas las tablas dentro del contenido HTML
    const tables = tempElement.querySelectorAll('table');

    tables.forEach(table => {
      // Añadir las clases específicas a la tabla
      addClassWithoutSpaces(table, 'w-full');
      addClassWithoutSpaces(table, 'table-auto');
      addClassWithoutSpaces(table, 'table-satic');

      // Crear el contenedor principal (flexDiv) y asignar las clases correspondientes
      const flexDiv = document.createElement('div');
      addClassWithoutSpaces(flexDiv, 'flex');
      addClassWithoutSpaces(flexDiv, 'flex-col');
      addClassWithoutSpaces(flexDiv, 'mb-5');

      // Crear el primer div (outerDiv) y asignar las clases correspondientes
      const outerDiv = document.createElement('div');
      addClassWithoutSpaces(outerDiv, '-m-1.5');
      addClassWithoutSpaces(outerDiv, 'overflow-x-auto');

      // Crear el segundo div (innerDiv1) y asignar las clases correspondientes
      const innerDiv1 = document.createElement('div');
      addClassWithoutSpaces(innerDiv1, 'p-1.5');
      addClassWithoutSpaces(innerDiv1, 'min-w-full');
      addClassWithoutSpaces(innerDiv1, 'inline-block');
      addClassWithoutSpaces(innerDiv1, 'align-middle');

      // Crear el tercer div (innerDiv2) y asignar las clases correspondientes
      const innerDiv2 = document.createElement('div');
      addClassWithoutSpaces(innerDiv2, 'border');
      addClassWithoutSpaces(innerDiv2, 'rounded-lg');
      addClassWithoutSpaces(innerDiv2, 'overflow-hidden');
      addClassWithoutSpaces(innerDiv2, 'my-2');

      // Clonar la tabla original y asignarle la clase correspondiente
      const clonedTable: any = table.cloneNode(true);
      addClassWithoutSpaces(clonedTable, 'min-w-full');
      addClassWithoutSpaces(clonedTable, 'divide-y');

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
        addClassWithoutSpaces(firstRow, 'bg-table-header-color');
        addClassWithoutSpaces(firstRow, 'text-left');
        addClassWithoutSpaces(firstRow, 'divide-x');
        addClassWithoutSpaces(firstRow, 'divide-y');
        addClassWithoutSpaces(firstRow, 'divide-gray-200');
        addClassWithoutSpaces(firstRow, 'rounded-lg');

        // Seleccionar todos los td dentro del primer tr
        const firstRowTds = firstRow.querySelectorAll('td');
        firstRowTds.forEach(td => {
          addClassWithoutSpaces(td, 'px-6');
          addClassWithoutSpaces(td, 'text-start');
          addClassWithoutSpaces(td, 'py-3');
          addClassWithoutSpaces(td, 'text-xs');
          addClassWithoutSpaces(td, 'text-white');
          addClassWithoutSpaces(td, 'uppercase');
        });
      }

      // Seleccionar los demás tr
      const tableTRCells = innerDiv2.querySelectorAll('tr:not(:first-child)');
      tableTRCells.forEach(tr => {
        addClassWithoutSpaces(tr, 'divide-x');
        addClassWithoutSpaces(tr, 'divide-y');
        addClassWithoutSpaces(tr, 'divide-gray-200');
      });

      // Seleccionar todos los td dentro de la tabla, excepto el primer tr
      const tableDataCells = innerDiv2.querySelectorAll('tr:not(:first-child) td');
      tableDataCells.forEach(td => {
        addClassWithoutSpaces(td, 'text-gray-800');
        addClassWithoutSpaces(td, 'text-sm');
        addClassWithoutSpaces(td, 'px-3');
        addClassWithoutSpaces(td, 'py-2');
      });
    });

    // Asignar el contenido modificado a la propiedad htmlContent
    this.htmlContent = tempElement.innerHTML;
  }

  removeCustomFormatting(htmlR: any) {
    const html = htmlR;

    // Crear un elemento temporal para manipular el contenido HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html || '';

    // Eliminar los divs creados por la función printHTML
    const flexDivs = tempElement.querySelectorAll('.flex.mb-5');

    flexDivs.forEach(flexDiv => {
      // Encontrar la tabla original dentro del flexDiv
      const clonedTable = flexDiv.querySelector('table.min-w-full.divide-y');

      if (clonedTable) {
        // Reemplazar el flexDiv por la tabla original
        flexDiv.replaceWith(clonedTable);

        // Remover clases específicas de la tabla
        clonedTable.classList.remove('w-full', 'table-auto', 'table-satic', 'min-w-full', 'divide-y');

        // Remover clases de las celdas y filas de la tabla
        const rows = clonedTable.querySelectorAll('tr');
        rows.forEach(row => {
          row.classList.remove('bg-table-header-color', 'text-left', 'divide-x', 'divide-y', 'divide-gray-200', 'rounded-lg');

          const cells = row.querySelectorAll('td');
          cells.forEach(cell => {
            cell.classList.remove('px-6', 'text-start', 'py-3', 'text-xs', 'text-white', 'uppercase', 'text-gray-800', 'text-sm', 'px-3', 'py-2');
          });
        });
      }
    });

    // Eliminar clases de alineación de texto y otras personalizaciones
    const elementsWithClasses = tempElement.querySelectorAll('.text-center, .text-left, .text-right, .underline, .contenido-lista, .contenido-link');
    elementsWithClasses.forEach(element => {
      element.classList.remove('text-center', 'text-left', 'text-right', 'underline', 'contenido-lista', 'contenido-link');
    });

    // Asignar el contenido modificado a la propiedad htmlContent
    return tempElement.innerHTML;
  }


  /* Variables spinner */
  porcentajeEnvio: number = 0;
  mostrarSpinner: boolean = false;
  mensaje = "Actualizando...";
  updateContent(): any {
    this.FormAltaContent.patchValue({
      htmlContent: this.htmlContent
    });
    markFormGroupTouched(this.FormAltaContent);
    if (this.FormAltaContent.valid) {
      this.mostrarSpinner = true;
      const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaContent.value));
      const encryptedID = this.CryptoServiceService.encryptData(JSON.stringify(this.id_contenido_estatico));

      const data = {
        data: encryptedData
      };
      this.ContenidocrudService.UpdateContenidoEstaticoService(data, encryptedID).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.ResponseHeader:
              break;
            case HttpEventType.UploadProgress:
              if (event.total !== undefined) {
                const percentDone = Math.round((100 * event.loaded) / event.total);
                this.porcentajeEnvio = percentDone;
                this.mostrarSpinner = true;
              }
              break;
            case HttpEventType.Response:
              // Manejo de la respuesta encriptada
              const encryptedResponse = event.body;
              const decryptedResponse = this.CryptoServiceService.decryptData(encryptedResponse);
              if (decryptedResponse?.resultado?.res) {
                this.flasher.success(decryptedResponse?.resultado?.data);
                if(this.es_tema){
                  this.router.navigateByUrl('/administrar-subtemas/' + this.encriptarId(this.id_punto) + '/' + this.idTemaEncrypt);
                }else{
                  this.router.navigate(['/details-punto/' + this.encriptarId(this.id_punto)]);

                }
              } else {
                this.mostrarSpinner = false;
                this.flasher.error(decryptedResponse?.resultado?.data);
              }
              break;
            default:
              this.mostrarSpinner = false;
              break;
          }
        },
        error => {
          this.mostrarSpinner = false;
          this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
        }
      );
    } else {
      this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
    }
  }

  encriptarId(id: any) {
    return this.CryptoServiceService.encodeID(id);
  }

}
