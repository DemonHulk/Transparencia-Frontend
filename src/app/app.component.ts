import { Component, HostListener } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { IStaticMethods } from 'preline';
import { CryptoServiceService } from './services/cryptoService/crypto-service.service';
import { UsuariocrudService } from './services/crud/usuariocrud.service';
import * as CryptoJS from 'crypto-js';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  dataUsuario: any;
  private readonly SESSION_TIMEOUT = 60 * 1000; // 1 minuto en milisegundos

  constructor(
    private router: Router,
    private encodeService: CryptoServiceService,
    private usuarioCrudService: UsuariocrudService
  ) {
    this.dataUsuario = encodeService.desencriptarDatosUsuario();
  }

  ngOnInit() {
    this.checkLastActivity();

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 1000);
      }
    });
  }

  checkLastActivity() {
    const lastActivity = localStorage.getItem('lastPageLoad');
    const now = new Date().getTime();

    console.log('Última actividad:', new Date(parseInt(lastActivity || '0')).toLocaleString());
    console.log('Hora actual:', new Date(now).toLocaleString());

    if (this.dataUsuario != null) {
      if (!lastActivity || now - parseInt(lastActivity) > this.SESSION_TIMEOUT) {
        console.log('Han pasado más de 1 minuto desde la última actividad');
        this.verifySesion(this.dataUsuario.id_usuario, this.dataUsuario.id_area);
      } else {
        console.log('Sesión activa');
        this.updateLastActivity();
      }
    } else {
      console.log('No hay datos de usuario');
    }
  }

  updateLastActivity() {
    const now = new Date().getTime();
    localStorage.setItem('lastPageLoad', now.toString());
    console.log('Última actividad actualizada:', new Date(now).toLocaleString());
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    // No actualizamos la última actividad aquí
  }

  verifySesion(usuarioId: any, areaId: any) {
    console.log('Verificando sesión');
    const data = { usuario: usuarioId, area: areaId };
    const encryptedData = this.encodeService.encryptData(JSON.stringify(data));

    this.usuarioCrudService.VerifySesion({ data: encryptedData }).subscribe({
      next: (response: any) => {
        if (response && response.body) {
          try {
            const decryptedResponse = this.encodeService.decryptData(response.body);
            if (decryptedResponse && decryptedResponse.resultado && decryptedResponse.resultado.data) {
              let dataUsuario = this.dataUsuario;
              dataUsuario.sesion = true;
              const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(dataUsuario), 'UZ4"(fa$P9g4ñ').toString();
              localStorage.setItem('user', encryptedUser);
              console.log('Sesión verificada y actualizada');
              this.updateLastActivity();
            } else {
              console.log('La sesión no es válida');
              this.cerrarSesion();
            }
          } catch (e) {
            console.error('Error al desencriptar la respuesta', e);
            this.cerrarSesion();
          }
        } else {
        }
      },
      error: (error) => {
        console.error('Error en la verificación de sesión', error);
        this.cerrarSesion();
      }
    });
  }

  cerrarSesion() {
    console.log('Cerrando sesión');
    localStorage.removeItem('user');
    localStorage.removeItem('lastPageLoad');
     window.location.href = '/articulo33';
  }
}
