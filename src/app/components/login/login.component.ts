import { Component } from '@angular/core';
import { SharedValuesService } from '../../services/shared-values.service';
// Importamos el servicio y librerias para el formulario
import { LoginService } from '../../services/login/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import flasher from "@flasher/flasher";
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formularioLogin: FormGroup;

  constructor(
    private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ){
    const validarCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    this.formularioLogin = this.formulario.group({
      correo: ['', [Validators.required, Validators.pattern(validarCorreo), Validators.maxLength(50)]],
      contrasenia: ['', [Validators.required,  Validators.maxLength(50)]]
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
    this.sharedService.changeTitle('Ingresar al sistema');
}
 
  
VerificarUser(): any {
  // Validación que solo entra en vigor si se llegara a eliminar un required del input
  if (this.formularioLogin.invalid && Object.values(this.formularioLogin.controls).some(control => control.errors?.['required'])) {
    flasher.error("Error Datos Faltantes");
    return;
  }

  // verificarUser es el metodo creado en el servicio, que es donde enviaremos los datos del formulario y conectarnos al backend
  this.loginService.VerificarUser(this.formularioLogin.value).subscribe(
    (response) => {
      // Asumiendo que response.resultado ya es un objeto
      const resultado = response.resultado;
      if (resultado.res) {
        // Pasamos los datos a json y encriptamos los datos
        const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(resultado.user), 'UZ4"(fa$P9g4ñ').toString();
        localStorage.setItem('user', encryptedUser);
        flasher.success(resultado.message);

        // Agregamos un delay de 2 segundos antes de redirigir (2000 milisegundos)
        setTimeout(() => {
          window.location.href = '/articulo33';
        }, 2000);  // Cambié a 2000 ms
      } else {
        flasher.error(resultado.message);
      }
    },
    (error) => {
      // Manejar el error critico
      console.log(error);
      flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
    }
  );
}


}
