import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FechaService } from '../../../services/format/fecha.service';
import { HistorialcrudService } from '../../../services/crud/historialcrud.service';
import { Historial, TooltipManager } from '../../../services/api-config';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { Table } from 'primeng/table';



@Component({
  selector: 'app-list-historial',
  templateUrl: './list-historial.component.html',
  styleUrl: './list-historial.component.css'
})
export class ListHistorialComponent {
  
  @ViewChild('dtActive') dtActive: Table | undefined;
  @ViewChild('dtInactive') dtInactive: Table | undefined;

  ListHistorial: Historial[] = [];
  ListHistorialActivos: (Historial)[] = [];
  ListHistorialInactivos: (Historial)[] = [];
  mensajesNuevos: boolean = false;

  
  constructor(
    private CryptoServiceService: CryptoServiceService,
    public sharedService: SharedValuesService,
    private FechaService: FechaService,
    private flasher: AlertsServiceService,
    private HistorialcrudService: HistorialcrudService,
    private el: ElementRef,
    
  ){}

  ngOnInit(): void {
    //  Buscamos si existen nuevos mensajes del historial
    this.GetAllHistorialService();
  }


   // Funcion para conseguir los registros del historial
   GetAllHistorialService() {
    this.HistorialcrudService.GetAllHistorialNoVistoService().subscribe(
      (respuesta: any) => {
        /* Desencriptamos la respuesta que nos retorna el backend */
        this.ListHistorial = this.CryptoServiceService.decryptData(respuesta).resultado?.map((historial: Historial) => this.addFormattedDate(historial));
        
        // Filtrar las áreas activas
        this.ListHistorialActivos = this.ListHistorial.filter(historial => historial.activo === true);
        this.ListHistorialInactivos = this.ListHistorial.filter(historial => historial.activo === false);
        
        // Indicar que todos los datos se han cargado
        setTimeout(() => {
          this.sharedService.setLoading(false);
          window.HSStaticMethods.autoInit();
        }, 500);
      },
      (error) => {
        this.sharedService.updateErrorLoading(this.el, { message: 'articulo33' });
      }
    );
  }
  private addFormattedDate(historial: Historial): Historial & { fecha_string: string } {
    return {
      ...historial,
      fecha_string: this.FechaService.formatDate(historial.fecha_creacion),
      tiempo_transcurrido: this.calcularDiferenciaTiempo(historial.fecha_creacion, historial.hora_creacion)
    };
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


  DeleteHistorial(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.CryptoServiceService.encryptData(JSON.stringify(id));
        this.HistorialcrudService.DeleteHistorialService(encryptedID).subscribe(respuesta => {
          this.GetAllHistorialService();
          this.flasher.success(this.CryptoServiceService.decryptData(respuesta).resultado?.data);
        });
      }
    });
  }

  ActivateHistorial(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.CryptoServiceService.encryptData(JSON.stringify(id));
        this.HistorialcrudService.ActivateHistorialService(encryptedID).subscribe(respuesta => {
          this.GetAllHistorialService();
          this.flasher.success(this.CryptoServiceService.decryptData(respuesta).resultado?.data);
        });
      }
    });
  }
  
  /**
  * Actualiza la fecha de formato YYYY-MM-DD a
  */
  FormatearDate(fecha: any) {
    return this.FechaService.formatDate(fecha);
  }

  filterGlobalActive(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dtActive) {
      this.dtActive.filterGlobal(input.value, 'contains');
    }
  }

  filterGlobalInactive(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dtInactive) {
      this.dtInactive.filterGlobal(input.value, 'contains');
    }
  }

  mostrar(elemento: any): void {
    // Verifica si el elemento recibido es un botón
    if (elemento.tagName.toLowerCase() === 'button') {
      const tooltipElement = elemento.querySelector('.hs-tooltip');
      if (tooltipElement) {
        tooltipElement.classList.toggle('show');
        const tooltipContent = tooltipElement.querySelector('.hs-tooltip-content');
        if (tooltipContent) {
          tooltipContent.classList.toggle('hidden');
          tooltipContent.classList.toggle('invisible');
          tooltipContent.classList.toggle('visible');
          // Ajustar la posición del tooltip
          TooltipManager.adjustTooltipPosition(elemento, tooltipContent);
        }
      }
    }
  }

  encriptarId(id:any){
    return this.CryptoServiceService.encodeID(id);
  }
}
