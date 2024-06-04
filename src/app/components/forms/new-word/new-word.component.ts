import { Component, ViewChild } from '@angular/core';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-new-word',
  templateUrl: './new-word.component.html',
  styleUrls: ['./new-word.component.css']
})
export class NewWordComponent {
  
  @ViewChild(EditorComponent) editorComponent!: EditorComponent;
  htmlContent: string = '';

  printHTML() {
    const html = this.editorComponent.editor?.getContent();
    console.log(html);
    this.htmlContent = html || ''; // Asignar el valor de html a la propiedad htmlContent
  }
 
}
