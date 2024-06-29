import { Component, ViewChild } from '@angular/core';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { SharedValuesService } from '../../../services/shared-values.service';
import { markFormGroupTouched } from '../../../services/api-config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { ContenidocrudService } from '../../../services/crud/contenidocrud.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TituloscrudService } from '../../../services/crud/tituloscrud.service';

@Component({
  selector: 'app-new-word',
  templateUrl: './new-word.component.html',
  styleUrls: ['./new-word.component.css']
})
export class NewWordComponent {

  FormAltaContent: FormGroup;
  id_tema: any;
  id_punto: any;
  datosUsuario: any;
  id_subtema:any;
  id_temaEnviar: any;
  es_tema : boolean = false;
  idTemaEncrypt : any;

  constructor(
    private sharedService: SharedValuesService,
    private formulario: FormBuilder,
    private activateRoute: ActivatedRoute,
    private CryptoServiceService: CryptoServiceService,
    private ContenidocrudService: ContenidocrudService,
    private flasher: AlertsServiceService,
    private router: Router, // Inyecta el Router
    private TituloscrudService: TituloscrudService
  ) {
    // Obtener el parámetro 'punto' de ambas rutas
    this.id_punto = this.activateRoute.snapshot.paramMap.get('punto');

    // Verificar si estamos en la ruta con 'tema' o con 'subtema'
    if (this.activateRoute.snapshot.paramMap.has('tema') && !this.activateRoute.snapshot.paramMap.has('subtema')) {
      this.id_tema = this.activateRoute.snapshot.paramMap.get('tema');
      // Desencriptar ID de tema y punto
      this.id_tema = this.CryptoServiceService.decodeID(this.id_tema);
      this.id_punto = this.CryptoServiceService.decodeID(this.id_punto);
      this.datosUsuario = this.CryptoServiceService.desencriptarDatosUsuario();

      this.id_temaEnviar = this.id_tema;
      this.es_tema = true;

      // Verificar si la ID es null, si es así, redirige a la página de puntos
      if (this.id_tema === null) {
        this.router.navigateByUrl('/puntos');
      }
    } else if (this.activateRoute.snapshot.paramMap.has('subtema') &&  this.activateRoute.snapshot.paramMap.has('tema')) {
      this.id_subtema = this.activateRoute.snapshot.paramMap.get('subtema');
      this.id_tema = this.activateRoute.snapshot.paramMap.get('tema');
      // Desencriptar ID de tema y punto
      this.id_tema = this.CryptoServiceService.decodeID(this.id_tema);
      // Desencriptar ID de subtema y punto
      this.id_subtema = this.CryptoServiceService.decodeID(this.id_subtema);
      this.id_punto = this.CryptoServiceService.decodeID(this.id_punto);
      this.datosUsuario = this.CryptoServiceService.desencriptarDatosUsuario();
      this.id_temaEnviar = this.id_subtema;
      // Verificar si la ID es null, si es así, redirige a la página de puntos
       //Verificar si la ID es null, si es así, redirige a la página de puntos
        if (this.id_punto === null) {
          this.router.navigateByUrl("/puntos");
        }
        if (this.id_tema === null) {
          this.router.navigateByUrl("/details-punto/" + this.encriptarId(this.id_punto));
        }

        if (this.id_subtema === null) {
          this.router.navigateByUrl("/details-punto/" + this.encriptarId(this.id_punto));
          this.router.navigateByUrl('/administrar-subtemas/' + this.encriptarId(this.id_punto) + '/' + this.encriptarId(this.id_tema));
        }

        this.TituloscrudService.GetTitulosPadre(this.CryptoServiceService.encryptData(JSON.stringify(this.id_tema))).subscribe(
          respuesta => {
            this.idTemaEncrypt = this.CryptoServiceService.encodeID(this.CryptoServiceService.decryptData(respuesta)?.resultado.id_titulo);

          },
          error => {

          }
        );
    }

    this.FormAltaContent = this.formulario.group({
      htmlContent: ['', [Validators.required, Validators.minLength(10)]],
      id_titulo: [this.id_temaEnviar,
      [
        Validators.required,
      ],
      ],
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
    this.sharedService.changeTitle('Registrar nuevo contenido');
  }


  @ViewChild(EditorComponent) editorComponent!: EditorComponent;
  htmlContent: string = '';
  private previousHtmlContent: string = ''; // Almacenar el contenido HTML anterior

  ngAfterViewInit() {
    setTimeout(() => {
      this.printHTML(); // Ejecuta printHTML después de que Angular haya completado su ciclo de detección de cambios
    });
  }

  ngAfterViewChecked() {
    // Verifica si editorComponent ha cambiado
    if (this.editorComponent.editor?.getContent() !== this.previousHtmlContent) {
      setTimeout(() => {
        this.printHTML(); // Si ha cambiado, ejecuta printHTML después de que Angular haya completado su ciclo de detección de cambios
      });
    }
  }

  printHTML() {
    const html = this.editorComponent.editor?.getContent();

    // Actualizar el contenido HTML anterior
    this.previousHtmlContent = html || '';

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



  /* Variables spinner */
  porcentajeEnvio: number = 0;
  mostrarSpinner: boolean = false;
  mensaje = "Guardando...";
  insertContent(): any {
    this.FormAltaContent.patchValue({
      htmlContent: this.htmlContent
    });
    markFormGroupTouched(this.FormAltaContent);
    if (this.FormAltaContent.valid) {
      this.mostrarSpinner = true;
      const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaContent.value));
      const data = {
        data: encryptedData
      };
      this.ContenidocrudService.InsertContenidoEstaticoService(data).subscribe(
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
                  this.router.navigate(['/details-punto/' + this.encriptarId(this.id_punto)]);
                }else{
                  this.router.navigateByUrl('/administrar-subtemas/' + this.encriptarId(this.id_punto) + '/' + this.idTemaEncrypt);
                }

              } else {
                this.mostrarSpinner = false;
                this.flasher.error(decryptedResponse?.resultado?.data?.data);
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
