import { Component, ViewChild } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { Table } from 'primeng/table';
import { PuntocrudService } from '../../../services/crud/puntocrud.service';
import { Punto, TooltipManager } from '../../../services/api-config';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { FechaService } from '../../../services/format/fecha.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';

@Component({
  selector: 'app-list-puntos',
  templateUrl: './list-puntos.component.html',
  styleUrl: './list-puntos.component.css'
})
export class ListPuntosComponent {

  @ViewChild('dtActive') dtActive: Table | undefined;
  @ViewChild('dtInactive') dtInactive: Table | undefined;

  isLoading: boolean = true;
  ListPuntos: (Punto & { fecha_string: string })[] = [];
  ListActivePuntos: (Punto & { fecha_string: string })[] = [];
  ListInactivePuntos: (Punto & { fecha_string: string })[] = [];


  constructor(
    public sharedService: SharedValuesService,
    private PuntocrudService: PuntocrudService,
    private flasher: AlertsServiceService,
    private FechaService: FechaService,
    private encodeService: CryptoServiceService,
  ) { 
    this.isLoading= true;
    
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
    /**
     * Llama al Servicio PuntocrudService y ejecutar la funcion para extraer todos los puntos.
     */
    this.GetAllPuntosService();
  }

  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }


  GetAllPuntosService() {
    this.PuntocrudService.GetAllPuntosService().subscribe((respuesta: any) => {
      /* Desencriptamos la respuesta que nos retorna el backend */ 
      this.ListPuntos = this.encodeService.decryptData(respuesta).resultado?.data.map((punto: Punto) => this.addFormattedDate(punto));
      // Filtrar las áreas activas
      this.ListActivePuntos = this.ListPuntos.filter(punto => punto.activo == true);

      // Filtrar las áreas inactivas
      this.ListInactivePuntos = this.ListPuntos.filter(punto => punto.activo == false);

      //Indicar que todos los datos se han cargado
      setTimeout(() => {

        this.sharedService.setLoading(false);
        window.HSStaticMethods.autoInit();
      }, 500);

    });
  }

  private addFormattedDate(punto: Punto): Punto & { fecha_string: string } {
    return {
      ...punto,
      fecha_string: this.FechaService.formatDate(punto.fecha_creacion)
    };
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
          console.log((id));
          const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.PuntocrudService.ActivatePuntoService(encryptedID).subscribe(respuesta => {
          this.GetAllPuntosService();
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
        });
      }
    });
  }

  filterGlobalInactive(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.dtInactive) {
      this.dtInactive.filterGlobal(input.value, 'contains');
    }
  }
  
}
