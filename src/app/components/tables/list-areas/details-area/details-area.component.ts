import { Component } from '@angular/core';
import { SharedValuesService } from '../../../../services/shared-values.service';
import { AreaCrudService } from '../../../../services/crud/areacrud.service';
import { FechaService } from '../../../../services/format/fecha.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PuntosAreasCrudService } from '../../../../services/crud/puntosareascrud.service';
import { UsuariocrudService } from '../../../../services/crud/usuariocrud.service';
import flasher from "@flasher/flasher";

@Component({
  selector: 'app-details-area',
  templateUrl: './details-area.component.html',
  styleUrl: './details-area.component.css'
})
export class DetailsAreaComponent {

  id:any;
  data_area: any;
  data_puntosacceso: any;
  data_usuariosacceso: any;

  constructor(
    private sharedService: SharedValuesService,
    private AreaCrudService: AreaCrudService,
    private PuntosAreasCrudService: PuntosAreasCrudService,
    private UsuariocrudService: UsuariocrudService,
    private FechaService: FechaService,
    private activateRoute: ActivatedRoute

  ) { 

    this.id = this.activateRoute.snapshot.paramMap.get("id");

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
      this.sharedService.changeTitle('Información detallada del área: Área de salud');

      this.GetOneAreaService(this.id);
      this.GetPuntosAccesoArea(this.id);
      this.GetUsuariosAccesoArea(this.id);
    }


  /* Extraer los datos del area que se esta visualizando el detalle */
  GetOneAreaService(id: any) {
    this.AreaCrudService.GetOneAreaService(id).subscribe(
      respuesta => {
        this.data_area = respuesta;
      },
      error => {
        console.error('Ocurrió un error al obtener el área:', error);
      }
    );
  }

  /* Extrae los puntos de acceso que tiene el area en especifico, los que tiene true + id */
  GetPuntosAccesoArea(id: any) {
    this.PuntosAreasCrudService.GetPuntosAccesoArea(id).subscribe(respuesta => {
      this.data_puntosacceso = respuesta;
      console.log(this.data_puntosacceso);
    });
  }


  /* Extrae los usuarios que cuentan con el area en especifico */
  GetUsuariosAccesoArea(id: any) {
    this.UsuariocrudService.GetUsuariosAccesoArea(id).subscribe(respuesta => {
      this.data_usuariosacceso = respuesta;
    });
  }

  InsertOrActivatePuntoAcceso(punto: any) {
    const formulario = { area: this.id, punto: punto }; 

    this.PuntosAreasCrudService.InsertOrActivate_PuntoArea(formulario).subscribe(
      respuesta => {
        if (respuesta.resultado.res) {
          this.GetPuntosAccesoArea(this.id);
          flasher.success(respuesta.resultado.data);
        } else {
          flasher.error(respuesta.resultado.data);
        }
      },
      (error: any) => {
        console.error(error);
        flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
      }
    );
  }

  DeletePuntoAcceso(punto: any) {
    const formulario = { area: this.id, punto: punto }; 

    this.PuntosAreasCrudService.Desactivate_PuntoArea(formulario).subscribe(
      respuesta => {
        if (respuesta.resultado.res) {
          this.GetPuntosAccesoArea(this.id);
          flasher.success(respuesta.resultado.data);
        } else {
          flasher.error(respuesta.resultado.data);
        }
      },
      (error: any) => {
        console.error(error);
        flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
      }
    );
  }

  
  
  /**
  * Actualiza la fecha de formato YYYY-MM-DD a 
  */
  FormatearDate(fecha:any){
    if (!fecha) {
      return ''; // O cualquier valor predeterminado que prefieras
    }
    return this.FechaService.formatDate(fecha);
  }


}
