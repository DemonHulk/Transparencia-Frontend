import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef } from '@angular/core';
import { Punto } from '../../../../services/api-config';
import { SharedValuesService } from '../../../../services/shared-values.service';
import { PuntocrudService } from '../../../../services/crud/puntocrud.service';
import { AlertsServiceService } from '../../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../../services/cryptoService/crypto-service.service';
import { FechaService } from '../../../../services/format/fecha.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrar-orden',
  templateUrl: './administrar-orden.component.html',
  styleUrl: './administrar-orden.component.css'
})
export class AdministrarOrdenComponent {

  ListPuntos: (Punto & { fecha_string: string })[] = [];
  ListActivePuntos: (Punto & { fecha_string: string })[] = [];
  /* Variables spinner */
 porcentajeEnvio: number = 0;
 mostrarSpinner: boolean = false;
 mensaje = "Actualizando...";

  constructor(
    public sharedService: SharedValuesService,
    private PuntocrudService: PuntocrudService,
    private flasher: AlertsServiceService,
    private FechaService: FechaService,
    private encodeService: CryptoServiceService,
    private el: ElementRef,
    private router: Router,
  ) {
    this.GetAllPuntosService()
  }

  ngOnInit(): void {
    /**
     * Llama al método changeTitle del servicio de valores compartidos para actualizar el título.
     *
     * @param {string} newTitle - El nuevo título a establecer.
     * @memberof SharedValuesService
     */
    this.sharedService.changeTitle('Administrar orden de los puntos registrados en el sistema');
    this.sharedService.setLoading(true);
  }

  GetAllPuntosService() {
    this.PuntocrudService.GetAllPuntosService().subscribe(
      (respuesta: any) => {
        try {
          this.ListPuntos = this.encodeService.decryptData(respuesta).resultado?.data.map((punto: Punto) => this.addFormattedDate(punto));
          this.ListActivePuntos = this.ListPuntos.filter(punto => punto.activo == true);
          setTimeout(() => {
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        } catch {
          this.sharedService.updateErrorLoading(this.el, { message: 'administrar-orden-puntos' });
        }
      },
      () => {
        this.sharedService.updateErrorLoading(this.el, { message: 'administrar-orden-puntos' });
      }
    );
  }


  private addFormattedDate(punto: Punto): Punto & { fecha_string: string } {
    return {
      ...punto,
      fecha_string: this.FechaService.formatDate(punto.fecha_creacion)
    };
  }


  drop(event: CdkDragDrop<Punto[]>) {
    moveItemInArray(this.ListActivePuntos, event.previousIndex, event.currentIndex);
    this.actualizarOrden();
  }

  actualizarOrden() {
    this.ListActivePuntos.forEach((punto, index) => {
      punto.orden_punto = index + 1;
    });
    // Aquí puedes enviar los cambios al servidor si es necesario
  }


  actualizarOrdenPuntos() {
    this.mostrarSpinner = true;
    const encryptedData = this.encodeService.encryptData(JSON.stringify(this.ListActivePuntos));
    const data = {
      data: encryptedData
    };

    this.PuntocrudService.UpdateOrderService(data).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            // Se envió la solicitud
            break;
          case HttpEventType.UploadProgress:
            if (event.total !== undefined) {
              const percentDone = Math.round((100 * event.loaded) / event.total);
              this.porcentajeEnvio = percentDone; // Actualizar el porcentaje de envío
            }
            break;
          case HttpEventType.Response:
            const encryptedResponse = event.body;
              const decryptedResponse = this.encodeService.decryptData(encryptedResponse);
              if (decryptedResponse?.estado) {
                this.flasher.success(decryptedResponse?.resultado?.data);
              } else {
                this.flasher.error(decryptedResponse?.resultado?.data || 'No se recibió una respuesta válida');
              }
              this.mostrarSpinner = false; // Ocultar spinner al finalizar
            // Manejar la respuesta según sea necesario
            break;
          default:
            this.mostrarSpinner = false;
            this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
            break;
        }
      },
      error => {
        this.mostrarSpinner = false;
        this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
      },
      () => {
        // Tareas finales después de completar la solicitud (ocultar spinner, etc.)
        this.mostrarSpinner = false;
        this.router.navigate(['/puntos']);
      }
    );
  }
}
