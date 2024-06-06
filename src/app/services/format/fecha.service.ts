import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FechaService {

  constructor() { }

  // Función para formatear la fecha
  formatDate(dateString: string): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dateParts = dateString.split('-');
    const year = dateParts[0];
    const month = months[parseInt(dateParts[1]) - 1]; // Restar 1 porque los meses son base 0 en JavaScript
    const day = ('0' + dateParts[2]).slice(-2); // Asegurar que el día tenga dos dígitos

    return `${month} ${day}, ${year}`;
  }
}
