import { Component } from '@angular/core';
import { SharedValuesService } from '../../services/shared-values.service';
// Importamos el servicio y librerias para el formulario
import { LoginService } from '../../services/login/login.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

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
  ) {
    
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

// Metodo para enviar los dato al servicio de enviar los datos al servicio
VerificarUser(): any {
  
  // verificarUser es el metodo creado en el servicio, que es donde enviaremos los datos del formulario
  this.loginService.VerificarUser(this.formularioLogin.value).pipe(
    tap((respuesta) => {
      if (respuesta.res) {
        localStorage.setItem('user', JSON.stringify(respuesta.user));
      }
    })
  ).subscribe(
    (respuesta) => {
      // Aquí los credenciales del usuario está guardado, aqui redirigimos y colocamos un mensaje indicando que el inicio de sesion fue exitoso
      window.location.href = '/articulo33';
    },
    (error) => {
      // Manejar el error
      // console.log("Mensaje de error recibido:", error.message);
      alert('Credenciales incorrectas: ' + error.message);
    }
  );
}
}
