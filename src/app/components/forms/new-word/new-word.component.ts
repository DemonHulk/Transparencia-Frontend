import { Component, ViewChild } from '@angular/core';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SharedValuesService } from '../../../services/shared-values.service';

@Component({
  selector: 'app-new-word',
  templateUrl: './new-word.component.html',
  styleUrls: ['./new-word.component.css']
})
export class NewWordComponent {

  constructor(private sharedService: SharedValuesService) { }

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
    console.log(html);

    // Actualizar el contenido HTML anterior
    this.previousHtmlContent = html || '';

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
    const tables = tempElement.querySelectorAll('table');

    tables.forEach(table => {
      // Añadir las clases específicas a la tabla
      table.classList.add('w-full', 'table-auto');

      // Crear los nuevos div contenedores
      const outerDiv = document.createElement('div');
      outerDiv.classList.add('rounded-sm', 'border', 'border-stroke', 'bg-white', 'px-5', 'pb-2.5', 'pt-6', 'shadow-default', 'sm:px-7.5', 'xl:pb-1');

      const innerDiv = document.createElement('div');
      innerDiv.classList.add('max-w-full', 'overflow-x-auto');

      // Clonar la tabla y agregarla al innerDiv
      innerDiv.appendChild(table.cloneNode(true));

      // Agregar el innerDiv al outerDiv
      outerDiv.appendChild(innerDiv);

      // Reemplazar la tabla original con el outerDiv
      table.replaceWith(outerDiv);

      // Seleccionar todos los th dentro de la tabla clonada
      const tableHeaders = innerDiv.querySelectorAll('th');
      tableHeaders.forEach(th => {
        th.classList.add('min-w-[120px]', 'px-4', 'py-4', 'font-medium', 'text-white');
      });

      // Seleccionar el primer tr dentro de la tabla clonada y agregar clase
      const firstRow = innerDiv.querySelector('tr');
      if (firstRow) {
        firstRow.classList.add('bg-table-header-color', 'text-left');

        // Seleccionar todos los td dentro del primer tr
        const firstRowTds = firstRow.querySelectorAll('td');
        firstRowTds.forEach(td => {
          td.classList.add('min-w-[220px]', 'px-4', 'py-4', 'font-medium', 'text-white', 'xl:pl-11');
        });
      }

      // Seleccionar todos los td dentro de la tabla, excepto el primer tr
      const tableDataCells = innerDiv.querySelectorAll('tr:not(:first-child) td');
      tableDataCells.forEach(td => {
        td.classList.add('border-b', 'border-[#eee]', 'px-4', 'py-5', 'pl-9', 'xl:pl-11');
      });
    });

    // Asignar el contenido modificado a la propiedad htmlContent
    this.htmlContent = tempElement.innerHTML;
  }


}
