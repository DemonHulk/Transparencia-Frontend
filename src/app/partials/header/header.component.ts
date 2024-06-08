import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { CryptoServiceService } from '../../services/cryptoService/crypto-service.service';
import { SharedValuesService } from '../../services/shared-values.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  // Varible para saber si el usuario cuenta con sesión activa y si es administrador
  sesionActiva: boolean = false;
  administrador: boolean = false;
  constructor(
    private CryptoServiceService: CryptoServiceService,
    private usuarioService: LoginService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedValuesService
  ){}

  ngOnInit(): void {
    this.verificarSesion();

    this.sharedService.isLoggedIn$.subscribe(isLoggedIn => {
      this.verificarSesion();
    });
  }


  // Función para verificar si la sesón esta activa
  verificarSesion() {
    const datosUsuarioJSON = this.CryptoServiceService.desencriptarDatosUsuario();

    // Verificar si la sesión esta activa
    if (datosUsuarioJSON) {
      try {
          this.sesionActiva = true;
          // Verificar si es administrador
          if(datosUsuarioJSON.id_area == 1){
            this.administrador = true;
          }
      } catch (e) {
          console.error("Error parsing JSON data: ", e);
          this.sesionActiva = false;
      }
    } else {
        this.sesionActiva = false;
    }
  }

  // Función para cerrar sesión
  cerrarSesion() {
    this.usuarioService.cerrarSesion();
    // volvemos a verificar si hay sesión
    this.verificarSesion();
  }
}
