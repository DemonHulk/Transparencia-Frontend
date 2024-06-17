import {  Component,ViewChild } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { Table } from 'primeng/table';
import { Item, TooltipManager, Trimestre } from '../../../services/api-config';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { FechaService } from '../../../services/format/fecha.service';
import { TrimestrecrudService } from '../../../services/crud/trimestrecrud.service';

@Component({
  selector: 'app-list-trimestres',
  templateUrl: './list-trimestres.component.html',
  styleUrl: './list-trimestres.component.css'
})
export class ListTrimestresComponent {

  @ViewChild('dtActive') dtActive: Table | undefined;
  @ViewChild('dtInactive') dtInactive: Table | undefined;

  ListTrimestres: (Trimestre & { fecha_string: string })[] = [];
  ListActiveTrimestres: (Trimestre & { fecha_string: string })[] = [];
  ListInactiveTrimestres: (Trimestre & { fecha_string: string })[] = [];

  constructor(public sharedService: SharedValuesService,
    private FechaService: FechaService,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private TrimestrecrudService: TrimestrecrudService

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
    this.sharedService.changeTitle('Trimestres registrados en el sistema');
    this.sharedService.setLoading(true);

    this.GetAllTrimestresService();

}

encriptarId(id:any){
  return this.encodeService.encodeID(id);
}

GetAllTrimestresService() {
  this.TrimestrecrudService.GetAllTrimestreService().subscribe((respuesta: any) => {
    /* Desencriptamos la respuesta que nos retorna el backend */

    this.ListTrimestres = this.encodeService.decryptData(respuesta).resultado?.data?.data.map((trimestre: Trimestre) => this.addFormattedDate(trimestre));
    // Filtrar los trimestres activas
    this.ListActiveTrimestres = this.ListTrimestres.filter(trimestre => trimestre.activo == true);

    // Filtrar los Trimestre inactivas
    this.ListInactiveTrimestres = this.ListTrimestres.filter(trimestre => trimestre.activo == false);

    //Indicar que todos los datos se han cargado

      this.sharedService.setLoading(false);
      window.HSStaticMethods.autoInit();
    });

}


DeleteTrimestre(id: any) {
  this.flasher.eliminar().then((confirmado) => {
    if (confirmado) {
      console.log(id);
      // Enviamos la id encriptada
      const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
      this.TrimestrecrudService.DeleteTrimestreService(encryptedID).subscribe(respuesta => {
        // console.log(encryptedID);
        this.GetAllTrimestresService();
        this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
      });
    }
  });
}


ActivateTrimestre(id: any) { 
  this.flasher.reactivar().then((confirmado) => {
    if (confirmado) {
      // Enviamos la id encriptada
      const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
      this.TrimestrecrudService.ActivateTrimestreService(encryptedID).subscribe(respuesta => {
        this.GetAllTrimestresService();
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

private addFormattedDate(trimestre: Trimestre): Trimestre & { fecha_string: string } {
  return {
    ...trimestre,
    fecha_string: this.FechaService.formatDate(trimestre.fecha_creacion)
  };
}

@ViewChild('dt') dt: Table | undefined;


filterGlobal(event: Event) {
const input = event.target as HTMLInputElement;
if (this.dt) {
  this.dt.filterGlobal(input.value, 'contains');
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
