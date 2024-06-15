export const API_URL = 'http://localhost/Transparencia-Backend/index.php/';

export class TooltipManager {
  static adjustTooltipPosition(button: HTMLElement, tooltip: HTMLElement): void {
      // Obtener dimensiones del botón y del tooltip
      const buttonRect = button.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      // Obtener dimensiones de la ventana
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calcular la posición preferida del tooltip
      const preferredLeft = buttonRect.left - tooltipRect.width / 2 + buttonRect.width / 2;
      const preferredTop = buttonRect.top - tooltipRect.height - 10; // Espacio entre el botón y el tooltip

      // Ajustar la posición si se sale de la pantalla hacia la izquierda
      let left = Math.max(preferredLeft, 0);

      // Ajustar la posición si se sale de la pantalla hacia arriba
      let top = Math.max(preferredTop, 0);

      // Ajustar la posición si el tooltip se sale de la pantalla hacia la derecha
      if (left + tooltipRect.width > windowWidth) {
          left = windowWidth - tooltipRect.width;
      }

      // Ajustar la posición si el tooltip se sale de la pantalla hacia abajo
      if (top + tooltipRect.height > windowHeight) {
          top = windowHeight - tooltipRect.height;
      }

      // Aplicar posición al tooltip
      tooltip.style.position = 'fixed';
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
  }
}

export  interface Item {
  nombre: string;
  edad: string;
  direccion: string;
}

export class Area {
  id_area!:string;
  nombre_area!: string;
  total_puntos!: string;
  fecha_creacion!: string;
  activo!: boolean;
}


export class Punto {
  id_punto!:string;
  nombre_punto!: string;
  fecha_creacion!: string;
  activo!: boolean;
}

export class Usuario {
  id_punto!: string;
  nombre!: string;
  apellido1!: string;
  apellido2!: string;
  correo!: string;
  activo!: boolean;

  constructor(
    id_punto: string,
    nombre: string,
    apellido1: string,
    apellido2: string,
    correo: string,
    activo: boolean
  ) {
    this.id_punto = id_punto;
    this.nombre = nombre;
    this.apellido1 = apellido1;
    this.apellido2 = apellido2;
    this.correo = correo;
    this.activo = activo;
  }

  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido1} ${this.apellido2}`;
  }
}



import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validarTextoNormal(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) {
      return { 'textoVacio': true };
    }
    // Limpiar el texto
    let textoLimpiado = valor
      .replace(/ {2,}/g, " ") // Reemplazar varios espacios en blanco seguidos por uno solo
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+/g, "") // Eliminar caracteres no permitidos
      .replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+|[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+$/g, ""); // Eliminar caracteres no permitidos al principio o final

      textoLimpiado = capitalizeWords(textoLimpiado);

    if (textoLimpiado !== valor) {
      control.setValue(textoLimpiado.trim()); // Actualizar el valor del control con el texto limpiado
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }
    return null; // No hay errores, el texto es válido y está limpiado correctamente
  };
}

export function validarCorreoUTDelacosta(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (!valor) {
      return { 'correoVacio': true };
    }


    // Formatear el correo electrónico según las reglas necesarias
    let partes = valor.split('@');
    if (partes.length > 1) {
      partes[1] = partes[1].replace(/[^a-zA-Z0-9.-]+/g, ""); // Eliminar caracteres no permitidos
      if (partes[1] !== "utdelacosta.edu.mx") {
        partes[1] = "utdelacosta.edu.mx";
      }
    }

    const emailFormateado = partes.join('@')
      .replace(/[^a-zA-Z0-9@._-]+/g, "") // Permitir solo letras, números y los caracteres @, ._, y -
      .replace(/\.{2,}/g, ".") // Reemplazar puntos consecutivos con un solo punto
      .replace(/\.@|@\./g, "@"); // Evitar punto inmediatamente antes o después de @

    if (emailFormateado !== valor) {
      control.setValue(emailFormateado.trim()); // Actualizar el valor del control con el correo formateado
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }

        // Validar el formato del correo electrónico
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(emailFormateado)) {
      return { 'correoInvalido': true };
    }

    return null; // No hay errores, el correo es válido y está formateado correctamente
  };
}


export function validarTelefono(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (!valor) {
      return { 'telefonoVacio': true };
    }

    // Limpiar y formatear el número de teléfono según las reglas necesarias
    let telefonoValidado = valor
      .replace(/\D/g, ""); // Eliminar todos los caracteres que no sean dígitos


    if (telefonoValidado !== valor) {
      control.setValue(telefonoValidado); // Actualizar el valor del control con el teléfono formateado
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }

    return null; // No hay errores, el teléfono es válido y está formateado correctamente
  };
}


export function validarPassword(requiereNoVacio: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (requiereNoVacio && !valor) {
      return { 'passwordVacio': true };
    }

    // Limpiar y formatear la contraseña según las reglas necesarias
    let passwordValidado = valor
      .replace(/[^a-zA-Z0-9]+/g, "") // Permitir solo letras (sin acentuaciones) y números
      .replace(/\s+/g, ""); // Eliminar espacios

    if (passwordValidado !== valor) {
      control.setValue(passwordValidado); // Actualizar el valor del control con la contraseña formateada
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }

    return null; // No hay errores, la contraseña es válida y está formateada correctamente
  };
}


export function validarTitulo(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (!valor) {
      return { 'textoVacio': true };
    }

    // Limpiar y formatear el texto según las reglas necesarias
    let textoFormateado = valor
      .replace(/ {2,}/g, " ") // Reemplazar varios espacios en blanco seguidos por uno solo
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9()\-,. ]+/g, "") // Permitir letras, números, paréntesis, guiones, comas y puntos
      .replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9()\-,. ]+|[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9()\-,. ]+$/g, ""); // Eliminar caracteres no permitidos al principio o al final

      textoFormateado = capitalizeWords(textoFormateado);

    if (textoFormateado !== valor) {
      control.setValue(textoFormateado.trim()); // Actualizar el valor del control con el texto formateado
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }

    return null; // No hay errores, el texto es válido y está formateado correctamente
  };
}


export function validarNombreArchivo(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (!valor) {
      return { 'nombreVacio': true };
    }

    // Limpiar y formatear el nombre del archivo según las reglas necesarias
    let nombreFormateado = valor
      .replace(/ {2,}/g, " ") // Reemplazar múltiples espacios en blanco por uno solo
      .replace(/[^a-zA-Z0-9-_ ]+/g, "") // Permitir solo letras (sin acentos), números, guiones medios y bajos, y espacios en blanco
      .replace(/^ +| +$/g, "") // Eliminar espacios en blanco al principio y al final

    // Si el nombre de archivo contiene un punto, agregar automáticamente ".pdf"
    if (nombreFormateado.includes('.')) {
      nombreFormateado += '.pdf';
    }

    // Convertir espacios en blanco en guiones bajos ("_")
    nombreFormateado = nombreFormateado.replace(/ /g, "_");

    // Actualizar el valor del control con el nombre de archivo formateado
    if (nombreFormateado !== valor) {
      control.setValue(nombreFormateado.trim()); // Actualizar el valor del control con el nombre de archivo formateado
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }

    return null; // No hay errores, el nombre del archivo es válido y está formateado correctamente
  };
}


export function validarNombre(requiereNoVacio: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if ( requiereNoVacio && !valor || requiereNoVacio && valor.length === 0) {

      return { 'textoVacio': true };
    }

    // Limpiar y formatear el texto según las reglas necesarias
    let textoFormateado = valor
      .replace(/ {2,}/g, " ") // Reemplazar múltiples espacios en blanco por uno solo
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]+/g, ""); // Permitir solo letras (con o sin acentos) y espacios en blanco

      textoFormateado = capitalizeWords(textoFormateado);
    // Actualizar el valor del control con el texto formateado
    if (textoFormateado !== valor) {
      control.setValue(textoFormateado.trim()); // Actualizar el valor del control con el texto formateado
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }
    return null; // No hay errores, el texto es válido y está formateado correctamente
  };
}

export function validarTrimestre(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (!valor) {
      return { 'textoVacio': true };
    }

    // Limpiar y formatear el texto según las reglas necesarias
    const textoFormateado = valor
      .replace(/ {2,}/g, " ") // Reemplazar múltiples espacios en blanco por uno solo
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+/g, "") // Permitir solo letras (con o sin acentos), números y guiones
      .replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+|[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+$/g, "") // Eliminar caracteres no permitidos al principio o final
      .toUpperCase(); // Convertir a mayúsculas

    // Actualizar el valor del control con el texto formateado
    if (textoFormateado !== valor) {
      control.setValue(textoFormateado.trim()); // Actualizar el valor del control con el texto formateado
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }

    return null; // No hay errores, el texto es válido y está formateado correctamente
  };
}


function capitalizeWords(text: string): string {
  return text.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

export function markFormGroupTouched(formGroup: FormGroup): void {
  Object.values(formGroup.controls).forEach(control => {
    if (control instanceof FormGroup) {
      markFormGroupTouched(control);
    } else {
      // Trim the value of the control if it is a string
      if (typeof control.value === 'string') {
        const trimmedValue = control.value.trim();
        if (trimmedValue !== control.value) {
          control.setValue(trimmedValue);
          control.markAsDirty();
        }
      }

      control.markAsTouched();
    }
  });
}
