import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { Table } from 'primeng/table';
import { PuntocrudService } from '../../../services/crud/puntocrud.service';
import { Punto, TooltipManager } from '../../../services/api-config';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { FechaService } from '../../../services/format/fecha.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-puntos',
  templateUrl: './list-puntos.component.html',
  styleUrl: './list-puntos.component.css'
})
export class ListPuntosComponent {

  @ViewChild('dtActive') dtActive: Table | undefined;
  @ViewChild('dtInactive') dtInactive: Table | undefined;

  ListPuntos: (Punto & { fecha_string: string })[] = [];
  ListActivePuntos: (Punto & { fecha_string: string })[] = [];
  ListInactivePuntos: (Punto & { fecha_string: string })[] = [];
  sesionActiva: any;
  administrador: any;
  datosUsuario: any;
  constructor(
    public sharedService: SharedValuesService,
    private PuntocrudService: PuntocrudService,
    private flasher: AlertsServiceService,
    private FechaService: FechaService,
    private encodeService: CryptoServiceService,
    private el: ElementRef
  ) {
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
    this.sharedService.changeTitle('Puntos registrados en el sistema');
    this.sharedService.setLoading(true);

    this.verificarAdministrador();
  }

  encriptarId(id: any) {
    return this.encodeService.encodeID(id);
  }

  // Para cuando es usuario administrador
    GetAllPuntosService() {
      this.PuntocrudService.GetAllPuntosService().subscribe(
        (respuesta: any) => {
          try {
            this.ListPuntos = this.encodeService.decryptData(respuesta).resultado?.data.map((punto: Punto) => this.addFormattedDate(punto));
            this.ListActivePuntos = this.ListPuntos.filter(punto => punto.activo == true);
            this.ListInactivePuntos = this.ListPuntos.filter(punto => punto.activo == false);
            setTimeout(() => {
              this.sharedService.setLoading(false);
              window.HSStaticMethods.autoInit();
            }, 500);
          } catch {
            this.sharedService.updateErrorLoading(this.el, { message: 'puntos' });
          }
        },
        () => {
          this.sharedService.updateErrorLoading(this.el, { message: 'puntos' });
        }
      );
    }


  // Para cuando es usuario normal
  GetUserPuntosService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));

    this.PuntocrudService.GetPuntosUserService(encryptedID).subscribe(
      (respuesta: any) => {
        try {
          this.ListPuntos = this.encodeService.decryptData(respuesta).resultado?.data.map((punto: Punto) => this.addFormattedDate(punto));
          this.ListActivePuntos = this.ListPuntos.filter(punto => punto.activo == true);
          this.ListInactivePuntos = this.ListPuntos.filter(punto => punto.activo == false);
          setTimeout(() => {
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        } catch {
          this.sharedService.updateErrorLoading(this.el, { message: 'puntos' });
        }
      },
      () => {
        this.sharedService.updateErrorLoading(this.el, { message: 'puntos' });
      }
    );
  }

  private addFormattedDate(punto: Punto): Punto & { fecha_string: string } {
    return {
      ...punto,
      fecha_string: this.FechaService.formatDate(punto.fecha_creacion)
    };
  }

  mostrar(elemento: any): void {
    // Verifica si el elemento recibido es un botón
    if (elemento.tagName.toLowerCase() === 'button' || elemento.tagName.toLowerCase() === 'a' ) {
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

  DeletePunto(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.PuntocrudService.DeletePuntoService(encryptedID).subscribe(respuesta => {
          this.GetAllPuntosService();
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
        });
      }
    });
  }

  ActivatePunto(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.PuntocrudService.ActivatePuntoService(encryptedID).subscribe(respuesta => {
          this.GetAllPuntosService();
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
        });
      }
    });
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

  // Función para verificar si la sesón esta activa y si es administrador
  verificarAdministrador() {
    this.datosUsuario = this.encodeService.desencriptarDatosUsuario();
    if (this.datosUsuario) {
      try {
        if (this.datosUsuario.id_area === 1) {
          this.administrador = true;
          /**
           * Llama al Servicio PuntocrudService y ejecutar la funcion para extraer todos los puntos.
          */
          this.GetAllPuntosService();
        } else {
          // Segunda funcion para mostrar los puntos a los que tiene acceso
          this.GetUserPuntosService(this.datosUsuario?.id_area);
        }
      } catch (e) {

      }
    } else {
      this.sesionActiva = false;
    }
  }

}
