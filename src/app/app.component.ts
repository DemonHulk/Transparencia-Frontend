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
  private readonly SESSION_TIMEOUT = 2 * 60* 60 * 1000; // 2 horas

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


    if (this.dataUsuario != null) {
      if (!lastActivity || now - parseInt(lastActivity) > this.SESSION_TIMEOUT) {
        this.verifySesion(this.dataUsuario.id_usuario, this.dataUsuario.id_area);
      } else {
        this.updateLastActivity();
      }
    } else {
    }
  }

  updateLastActivity() {
    const now = new Date().getTime();
    localStorage.setItem('lastPageLoad', now.toString());
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    // No actualizamos la última actividad aquí
  }

  verifySesion(usuarioId: any, areaId: any) {
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
              this.updateLastActivity();
            } else {
              this.cerrarSesion();
            }
          } catch (e) {
            this.cerrarSesion();
          }
        } else {
        }
      },
      error: (error) => {
        this.cerrarSesion();
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('user');
    localStorage.removeItem('lastPageLoad');
     window.location.href = '/articulo33';
  }
}
