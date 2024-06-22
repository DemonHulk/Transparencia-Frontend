import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { EjerciciocrudService } from '../../../services/crud/ejerciciocrud.service';
import { FechaService } from '../../../services/format/fecha.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { Ejercicio, TooltipManager } from '../../../services/api-config';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-ejercicio',
  templateUrl: './list-ejercicio.component.html',
  styleUrl: './list-ejercicio.component.css'
})
export class ListEjercicioComponent {

  @ViewChild('dtActive') dtActive: Table | undefined;
  @ViewChild('dtInactive') dtInactive: Table | undefined;

  ListEjercicios: (Ejercicio & { fecha_string: string })[] = [];
  ListActiveEjercicios: (Ejercicio & { fecha_string: string })[] = [];
  ListInactiveEjercicios: (Ejercicio & { fecha_string: string })[] = [];

  constructor(
    public sharedService: SharedValuesService,
    private EjercicioCrudService: EjerciciocrudService,
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
    this.sharedService.changeTitle('Ejercicios registrados en el sistema');
    this.sharedService.setLoading(true);
    /**
     * Llama al Servicio AreaCrudService y ejecutar la funcion para extraer areas.
     */
    this.GetAllEjerciciosService();

  }

  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }


  GetAllEjerciciosService() {
    this.EjercicioCrudService.GetAllEjercicioService().subscribe(
      (respuesta: any) => {
        try {
          /* Desencriptamos la respuesta que nos retorna el backend */
          this.ListEjercicios = this.encodeService.decryptData(respuesta).resultado?.data?.map((ejercicio: Ejercicio) => this.addFormattedDate(ejercicio));
          // Filtrar los ejercicios activos
          this.ListActiveEjercicios = this.ListEjercicios.filter(ejercicio => ejercicio.activo == true);
          // Filtrar los ejercicios inactivos
          this.ListInactiveEjercicios = this.ListEjercicios.filter(ejercicio => ejercicio.activo == false);
          // Indicar que todos los datos se han cargado
          setTimeout(() => {
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        } catch {
          this.sharedService.updateErrorLoading(this.el, { message: 'ejercicios' });
        }
      },
      () => {
        this.sharedService.updateErrorLoading(this.el, { message: 'ejercicios' });
      }
    );
  }

  private addFormattedDate(ejercicio: Ejercicio): Ejercicio & { fecha_string: string } {
    return {
      ...ejercicio,
      fecha_string: this.FechaService.formatDate(ejercicio.fecha_creacion)
    };
  }

  DeleteEjercicio(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.EjercicioCrudService.DeleteEjercicioService(encryptedID).subscribe(respuesta => {
          this.GetAllEjerciciosService();
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
        });
      }
    });
  }

  ActivateEjercicio(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.EjercicioCrudService.ActivateEjercicioService(encryptedID).subscribe(respuesta => {
          this.GetAllEjerciciosService();
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
