import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { CryptoServiceService } from '../../services/cryptoService/crypto-service.service';
import { SharedValuesService } from '../../services/shared-values.service';
import { FechaService } from '../../services/format/fecha.service'; 
import { Historial } from '../../services/api-config';
import { HistorialcrudService } from '../../services/crud/historialcrud.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  // Varible para saber si el usuario cuenta con sesión activa y si es administrador
  sesionActiva: boolean = false;
  administrador: boolean = false;
  datosUsuario: any;
  ListHistorial: Historial[] = [];
  ListHistorialActivos: (Historial)[] = [];
  mensajesNuevos: boolean = false;

  constructor(
    private CryptoServiceService: CryptoServiceService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedValuesService,
    private FechaService: FechaService,
    private HistorialcrudService: HistorialcrudService,
    private el: ElementRef,
    private sanitizer: DomSanitizer
    
  ){}

  ngOnInit(): void {
    this.verificarSesion();

    this.sharedService.isLoggedIn$.subscribe(isLoggedIn => {
      this.verificarSesion();
    });

     this.datosUsuario = this.CryptoServiceService.desencriptarDatosUsuario()
    //  Buscamos si existen nuevos mensajes del historial
    this.GetAllHistorialNoVistoService();
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
    // Eliminar los datos del usuario del localStorage
    localStorage.removeItem('user');
  
    // Actualizar el estado de la sesión
    this.sesionActiva = false;
    this.administrador = false;

  
    // Reiniciar las variables de sesión después de un ciclo de cambios
    this.cdr.markForCheck();
  }

  encriptarId(id:any){
    return this.CryptoServiceService.encodeID(id);
  }

  // Funcion para conseguir los registros del historial
  GetAllHistorialNoVistoService() {
    this.HistorialcrudService.GetAllHistorialNoVistoService().subscribe(
      (respuesta: any) => {
        /* Desencriptamos la respuesta que nos retorna el backend */
        this.ListHistorial = this.CryptoServiceService.decryptData(respuesta).resultado?.map((historial: Historial) => this.addFormattedDate(historial));
        
        // Filtrar las áreas activas
        this.ListHistorialActivos = this.ListHistorial.filter(historial => historial.visto === false);
        if(this.ListHistorialActivos[0] != null){
          this.mensajesNuevos = true;
        }
        // Indicar que todos los datos se han cargado
        setTimeout(() => {
          this.sharedService.setLoading(false);
          window.HSStaticMethods.autoInit();
        }, 500);
      },
      (error) => {
        // this.sharedService.updateErrorLoading(this.el, { message: 'articulo33' });
      }
    );
  }
  private addFormattedDate(historial: Historial): Historial & { fecha_string: string } {
    return {
      ...historial,
      fecha_string: this.FechaService.formatDate(historial.fecha_actualizado),
      tiempo_transcurrido: this.calcularDiferenciaTiempo(historial.fecha_creacion, historial.hora_creacion)
    };
  }

  sanitizeDescription(description: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }

  calcularDiferenciaTiempo(fecha_creacion: string, hora_creacion: string): string {
    const videoTimestamp = new Date(`${fecha_creacion}T${hora_creacion}`);
    const currentDate = new Date();

    if (isNaN(videoTimestamp.getTime())) {
      return 'Fecha inválida';
    }

    const differenceMs = currentDate.getTime() - videoTimestamp.getTime();
    const differenceSeconds = Math.floor(differenceMs / 1000);
    const differenceMinutes = Math.floor(differenceSeconds / 60);
    const differenceHours = Math.floor(differenceMinutes / 60);
    const differenceDays = Math.floor(differenceHours / 24);
    const differenceMonths = Math.floor(differenceDays / 30.44);
    const differenceYears = Math.floor(differenceDays / 365.25);

    let message = '';
    if (differenceYears > 0) {
      message = `${differenceYears} año${differenceYears > 1 ? 's' : ''}`;
    } else if (differenceMonths > 0) {
      message = `${differenceMonths} mes${differenceMonths > 1 ? 'es' : ''}`;
    } else if (differenceDays > 0) {
      message = `${differenceDays} día${differenceDays > 1 ? 's' : ''}`;
    } else if (differenceHours > 0) {
      message = `${differenceHours} hora${differenceHours > 1 ? 's' : ''}`;
    } else {
      message = `${differenceMinutes} minuto${differenceMinutes > 1 ? 's' : ''}`;
    }

    return message;
  }

  /** Cambiamos el estado de visto a true*/
  VerMensaje(id: any) {
    // Enviamos la id encriptada
    const encryptedID = this.CryptoServiceService.encryptData(JSON.stringify(id));
    this.HistorialcrudService.VerMensajeService(encryptedID).subscribe(respuesta => {
      setTimeout(() => {
          this.sharedService.setLoading(false);
        window.HSStaticMethods.autoInit();
        this.mensajesNuevos = false;
      }, 500);
    });
  }
}
