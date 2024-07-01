import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { FechaService } from '../../../services/format/fecha.service';
import { Area, TooltipManager } from '../../../services/api-config';
import { Table } from 'primeng/table';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { ErrorLoadingComponent } from '../../../partials/error-loading/error-loading.component';

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
    public sharedService: SharedValuesService,
    private AreaCrudService: AreaCrudService,
    private FechaService: FechaService,
    private flasher: AlertsServiceService,
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
    this.sharedService.changeTitle('Áreas registradas en el sistema');
    this.sharedService.setLoading(true);
    /**
     * Llama al Servicio AreaCrudService y ejecutar la funcion para extraer areas.
     */
    this.GetAllAreaService();
  }

  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }

  GetAllAreaService() {
    this.AreaCrudService.GetAllAreaService().subscribe(
      (respuesta: any) => {
        /* Desencriptamos la respuesta que nos retorna el backend */
        this.ListAreas = this.encodeService.decryptData(respuesta).resultado?.data?.data.map((area: Area) => this.addFormattedDate(area));
        // Filtrar las áreas activas
        this.ListActiveAreas = this.ListAreas.filter(area => area.activo === true);

        // Filtrar las áreas inactivas
        this.ListInactiveAreas = this.ListAreas.filter(area => area.activo === false);

        // Indicar que todos los datos se han cargado
        setTimeout(() => {
          this.sharedService.setLoading(false);
          window.HSStaticMethods.autoInit();
        }, 500);
      },
      (error) => {
        this.sharedService.updateErrorLoading(this.el, { message: 'areas' });
      }
    );
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
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.AreaCrudService.DeleteAreaService(encryptedID).subscribe(respuesta => {
          this.GetAllAreaService();
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data?.data);
        });
      }
    });
  }

  ActivateArea(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.AreaCrudService.ActivateAreaService(encryptedID).subscribe(respuesta => {
          this.GetAllAreaService();
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data?.data);
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

}
