import { Component } from '@angular/core';
import { SharedValuesService } from '../../services/shared-values.service';
// Importamos el servicio y librerias para el formulario
import { LoginService } from '../../services/login/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AlertsServiceService } from '../../services/alerts/alerts-service.service';


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
    private router: Router,
    private flasher: AlertsServiceService
  ){
    const validarCorreo = /^[^\s@]+@utdelacosta\.edu\.mx$/;

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
    this.sharedService.loadScript("/assets/js/validations.js");
}


VerificarUser(): any {
  // Validación que solo entra en vigor si se llegara a eliminar un required del input
  if (this.formularioLogin.invalid && Object.values(this.formularioLogin.controls).some(control => control.errors?.['required'])) {
    this.flasher.error("Error Datos Faltantes");
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
        this.flasher.success(resultado.message);

        this.sharedService.login();
        this.router.navigateByUrl('/articulo33');
      } else {
        this.flasher.error(resultado.message);
      }
    },
    (error) => {
      // Manejar el error critico
      console.log(error);
      this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
    }
  );
}


}
