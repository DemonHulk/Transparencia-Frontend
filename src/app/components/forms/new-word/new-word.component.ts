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


}
