import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import flasher from "@flasher/flasher";
import { FechaService } from '../../../services/format/fecha.service';

@Component({
  selector: 'app-list-areas',
  templateUrl: './list-areas.component.html',
  styleUrl: './list-areas.component.css'
})
export class ListAreasComponent {

  ListAreas: any;

  constructor(
    private sharedService: SharedValuesService,
    private AreaCrudService: AreaCrudService,
    private FechaService: FechaService
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


  GetAllAreaService() {
    this.AreaCrudService.GetAllAreaService().subscribe(respuesta => {
      this.ListAreas = respuesta;
    });
  }


  DeleteArea(id: any) {
    this.AreaCrudService.DeleteAreaService(id).subscribe(respuesta => {
       this.GetAllAreaService();
       flasher.success(respuesta.resultado.data);
    });
  }
  
  ActivateArea(id: any) {
    this.AreaCrudService.ActivateAreaService(id).subscribe(respuesta => {
       this.GetAllAreaService();
       flasher.success(respuesta.resultado.data);
    });
  }
  

  /**
  * Actualiza la fecha de formato YYYY-MM-DD a 
  */
  FormatearDate(fecha:any){
    return this.FechaService.formatDate(fecha);
  }

}
