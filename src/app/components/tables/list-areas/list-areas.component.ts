import { Component, ViewChild } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { FechaService } from '../../../services/format/fecha.service';
import { Area, TooltipManager } from '../../../services/api-config';
import { Table } from 'primeng/table';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';

@Component({
  selector: 'app-list-areas',
  templateUrl: './list-areas.component.html',
  styleUrl: './list-areas.component.css'
})
export class ListAreasComponent {

  @ViewChild('dtActive') dtActive: Table | undefined;
  @ViewChild('dtInactive') dtInactive: Table | undefined;

  ListAreas: (Area & { fecha_string: string })[] = [];
  ListActiveAreas: (Area & { fecha_string: string })[] = [];
  ListInactiveAreas: (Area & { fecha_string: string })[] = [];

  constructor(
    private sharedService: SharedValuesService,
    private AreaCrudService: AreaCrudService,
    private FechaService: FechaService,
    private flasher: AlertsServiceService,
    private encondeService: CryptoServiceService
  ) { }

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
    this.sharedService.changeTitle('Áreas registradas en el sistema');

    /**
     * Llama al Servicio AreaCrudService y ejecutar la funcion para extraer areas.
     */
    this.GetAllAreaService();

  }

  encriptarId(id:any){
    return this.encondeService.encodeID(id);
  }


  GetAllAreaService() {
    this.AreaCrudService.GetAllAreaService().subscribe((respuesta: any) => {
      this.ListAreas = respuesta.resultado.data.map((area: Area) => this.addFormattedDate(area));
      // Filtrar las áreas activas
      this.ListActiveAreas = this.ListAreas.filter(area => area.activo == true);

      // Filtrar las áreas inactivas
      this.ListInactiveAreas = this.ListAreas.filter(area => area.activo == false);
    });
  }
  private addFormattedDate(area: Area): Area & { fecha_string: string } {
    return {
      ...area,
      fecha_string: this.FechaService.formatDate(area.fecha_creacion)
    };
  }

  DeleteArea(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
        this.AreaCrudService.DeleteAreaService(id).subscribe(respuesta => {
          this.GetAllAreaService();
          this.flasher.success(respuesta.resultado.data);
        });
      }
    });
  }

  ActivateArea(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {
        this.AreaCrudService.ActivateAreaService(id).subscribe(respuesta => {
          this.GetAllAreaService();
          this.flasher.success(respuesta.resultado.data);
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

}
