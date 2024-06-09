import { Component, ViewChild } from '@angular/core';
import { SharedValuesService } from '../../../../services/shared-values.service';
import { AreaCrudService } from '../../../../services/crud/areacrud.service';
import { FechaService } from '../../../../services/format/fecha.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PuntosAreasCrudService } from '../../../../services/crud/puntosareascrud.service';
import { UsuariocrudService } from '../../../../services/crud/usuariocrud.service';
import { Punto, TooltipManager, Usuario } from '../../../../services/api-config';
import { AlertsServiceService } from '../../../../services/alerts/alerts-service.service';
import { Table } from 'primeng/table';
import { CryptoServiceService } from '../../../../services/cryptoService/crypto-service.service';

@Component({
  selector: 'app-details-area',
  templateUrl: './details-area.component.html',
  styleUrl: './details-area.component.css'
})
export class DetailsAreaComponent {

  @ViewChild('dtPuntos') dtPuntos: Table | undefined;

  id: any;
  data_area: any;
  listPuntosAcceso: Punto[] = [];
  listUsuariosAcceso: Usuario[] = [];
  data_usuariosacceso: any;

  constructor(
    private sharedService: SharedValuesService,
    private AreaCrudService: AreaCrudService,
    private PuntosAreasCrudService: PuntosAreasCrudService,
    private UsuariocrudService: UsuariocrudService,
    private FechaService: FechaService,
    private activateRoute: ActivatedRoute,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private router: Router


  ) {

    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/areas");
    }

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

    this.GetOneAreaService(this.id);
    this.GetPuntosAccesoArea(this.id);
    this.GetUsuariosAccesoArea(this.id);
  }


  /* Extraer los datos del area que se esta visualizando el detalle */
  GetOneAreaService(id: any) {
    this.AreaCrudService.GetOneAreaService(id).subscribe(
      respuesta => {
        this.data_area = respuesta;
        this.sharedService.changeTitle('Información detallada del área: ' + this.data_area?.resultado?.data?.nombre_area);
      },
      error => {
        console.error('Ocurrió un error al obtener el área:', error);
      }
    );
  }

  /* Extrae los puntos de acceso que tiene el area en especifico, los que tiene true + id */
  GetPuntosAccesoArea(id: any) {
    this.PuntosAreasCrudService.GetPuntosAccesoArea(id).subscribe((respuesta: any) => {
      this.listPuntosAcceso = respuesta.resultado.data;
      console.log(this.listPuntosAcceso);
    });
  }


  /* Extrae los usuarios que cuentan con el area en especifico */
  GetUsuariosAccesoArea(id: any) {
    this.UsuariocrudService.GetUsuariosAccesoArea(id).subscribe(respuesta => {
      this.listUsuariosAcceso = respuesta.resultado.data.map((data: any) =>
        new Usuario(
          data.id_punto,
          data.nombre,
          data.apellido1,
          data.apellido2,
          data.correo,
          data.activo
        )
      );
    });
  }

  InsertOrActivatePuntoAcceso(punto: any) {
    const formulario = { area: this.id, punto: punto };
    this.flasher.confirmacionPersonalizada("¿Estas seguro de reactivar el permiso para este punto?", 'El Área retomara el acceso a la info de este punto').then((confirmado) => {
      if (confirmado) {
        this.PuntosAreasCrudService.InsertOrActivate_PuntoArea(formulario).subscribe(
          respuesta => {
            if (respuesta.resultado.res) {
              this.GetPuntosAccesoArea(this.id);
              this.flasher.success(respuesta.resultado.data);
            } else {
              this.flasher.error(respuesta.resultado.data);
            }
          },
          (error: any) => {
            console.error(error);
            this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
          }
        );
      }
    });
  }

  /**
 * Elimina un punto de acceso para la área.
 *
 * @param {number} punto - El ID del punto de acceso a eliminar.
 * @returns {void} - No devuelve ningún valor.
 */
  DeletePuntoAcceso(punto: any) {
    const formulario = { area: this.id, punto: punto };
    this.flasher.confirmacionPersonalizada("¿Estas seguro de eliminar el permiso para este punto?", 'El Área no podria modificar la info de este punto').then((confirmado) => {
      if (confirmado) {
        // El usuario confirmó
        this.PuntosAreasCrudService.Desactivate_PuntoArea(formulario).subscribe(
          respuesta => {
            if (respuesta.resultado.res) {
              this.GetPuntosAccesoArea(this.id);
              this.flasher.success(respuesta.resultado.data);
            } else {
              this.flasher.error(respuesta.resultado.data);
            }
          },
          (error: any) => {
            console.error(error);
            this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
          }
        );
      }
    });
  }



  /**
  * Actualiza la fecha de formato YYYY-MM-DD a
  */
  FormatearDate(fecha: any) {
    if (!fecha) {
      return ''; // O cualquier valor predeterminado que prefieras
    }
    return this.FechaService.formatDate(fecha);
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
