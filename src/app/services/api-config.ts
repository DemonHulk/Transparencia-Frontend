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
  id_punto: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  correo: string;
  activo: boolean;

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



import { AbstractControl, ValidatorFn } from '@angular/forms';

export function validarTextoNormal(): ValidatorFn {
  return (control: AbstractControl): Promise<{ [key: string]: any }> | null => {
    return new Promise((resolve) => {
        if (!control.value) {
          resolve({ 'textoVacio': true });
        } else {
          const textoValidado = control.value
            .replace(/ {2,}/g, " ")
            .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+/g, "")
            .replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+|[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+$/g, "");

          if (textoValidado !== control.value) {
            resolve({ 'textoInvalido': true });
          } else {
            resolve({});
          }
        }
    });
  };
}

