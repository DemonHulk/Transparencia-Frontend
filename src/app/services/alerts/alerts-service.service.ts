import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertsServiceService {

  constructor() { }

  success(message:any){
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: message
    });
  }


  error(message:any){
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: message
    });
  }

  warning(message:any){
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "warning",
      title: message
    });
  }

  info(message:any){
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "info",
      title: message
    });
  }

  /**
 * Alerta de confirmación para eliminar un registro.
 * @returns {Promise<boolean>} - Una promesa que se resuelve a `true` si el usuario confirma la eliminacion, y a `false` si el usuario cancela.
 */
  eliminar(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: "¿Estás seguro de eliminar el registro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#04847C",
        cancelButtonColor: "#EF4444",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar!",
        focusCancel: true
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(true); // Resuelve la promesa con true si el usuario confirmó la eliminación
        } else {
          resolve(false); // Resuelve la promesa con false si el usuario canceló la eliminación
        }
      });
    });
  }
/**
 * Alerta de confirmación para reactivar un registro.
 * @returns {Promise<boolean>} - Una promesa que se resuelve a `true` si el usuario confirma la reactivación, y a `false` si el usuario cancela.
 */
  reactivar(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: "¿Estás seguro de reactivar el registro?",
        text: "La información volvera a ser visible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#04847C",
        cancelButtonColor: "#EF4444",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar!",
        focusCancel: true
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(true); // Resuelve la promesa con true si el usuario confirmó la eliminación
        } else {
          resolve(false); // Resuelve la promesa con false si el usuario canceló la eliminación
        }
      });
    });
  }

/**
 * Alerta de confirmación personalizable.
 * @param {any} title - El título de la alerta.
 * @param {any} message - El mensaje a mostrar en la alerta.
 * @returns {Promise<boolean>} - Una promesa que se resuelve a `true` si el usuario confirma la acción, y a `false` si el usuario cancela.
 */
confirmacionPersonalizada(title: any, message: any): Promise<boolean> {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#04847C",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar!",
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

}
