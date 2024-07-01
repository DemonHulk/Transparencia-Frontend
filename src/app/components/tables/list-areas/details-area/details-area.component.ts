import { Component, ElementRef, ViewChild } from '@angular/core';
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
  idEncrypt: any;
  data_area: any;
  listPuntosAcceso: Punto[] = [];
  listUsuariosAcceso: Usuario[] = [];
  data_usuariosacceso: any;

  constructor(
    public sharedService: SharedValuesService,
    private AreaCrudService: AreaCrudService,
    private PuntosAreasCrudService: PuntosAreasCrudService,
    private UsuariocrudService: UsuariocrudService,
    private FechaService: FechaService,
    private activateRoute: ActivatedRoute,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private router: Router,
    private el: ElementRef
  ) {

    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");
    this.idEncrypt = this.id;
    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/areas");
    }

    this.sharedService.setLoading(true);
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
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));

    this.AreaCrudService.GetOneAreaService(encryptedID).subscribe(
      respuesta => {
        this.data_area = this.encodeService.decryptData(respuesta);
        this.sharedService.changeTitle('Información detallada del área: ' + this.data_area?.resultado?.data?.data?.nombre_area);
      },
      // Manejo del error sin imprimir explícitamente
      () => {
        this.sharedService.updateErrorLoading(this.el, { message: 'details-area/' + this.idEncrypt });
      }
    );
  }

  /* Extrae los puntos de acceso que tiene el area en especifico, los que tiene true + id */
  GetPuntosAccesoArea(id: any) {
    // Enviamos la id encriptada
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.PuntosAreasCrudService.GetPuntosAccesoArea(encryptedID).subscribe(
      (respuesta: any) => {
        try {
          this.listPuntosAcceso = this.encodeService.decryptData(respuesta).resultado?.data?.data;
        } catch {
          this.sharedService.updateErrorLoading(this.el, { message: 'details-area/' + this.idEncrypt });
        }
      },
      () => {
        this.sharedService.updateErrorLoading(this.el, { message: 'details-area/' + this.idEncrypt });
      }
    );
  }

  /* Extrae los usuarios que cuentan con el area en especifico */
  GetUsuariosAccesoArea(id: any) {
    // Encriptamos la id
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.UsuariocrudService.GetUsuariosAccesoArea(encryptedID).subscribe(
      (respuesta: any) => {
        try {
          this.listUsuariosAcceso = this.encodeService.decryptData(respuesta).resultado?.data?.data.map((data: any) =>
            new Usuario(
              data.id_punto,
              data.correo,
              data.activo
            )
          );

          this.sharedService.setLoading(false);
        } catch {
          this.sharedService.updateErrorLoading(this.el, { message: 'details-area/' + this.idEncrypt });
        }
      },
      () => {
        this.sharedService.updateErrorLoading(this.el, { message: 'details-area/' + this.idEncrypt });
      }
    );
  }


  InsertOrActivatePuntoAcceso(punto: any) {
    const formulario = { area: this.id, punto: punto };
    this.flasher.confirmacionPersonalizada("¿Estas seguro de reactivar el permiso para este punto?", 'El Área retomara el acceso a la info de este punto').then((confirmado) => {
      if (confirmado) {
        const encryptedData = this.encodeService.encryptData(JSON.stringify(formulario));
        const data = {
          data: encryptedData
        };
        this.PuntosAreasCrudService.InsertOrActivate_PuntoArea(data).subscribe(
          respuesta => {
            if (this.encodeService.decryptData(respuesta)?.resultado?.res) {
              this.GetPuntosAccesoArea(this.id);
              this.flasher.success(this.encodeService.decryptData(respuesta)?.resultado?.data);
            } else {
              this.flasher.error(this.encodeService.decryptData(respuesta)?.resultado?.data);
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
        const encryptedData = this.encodeService.encryptData(JSON.stringify(formulario));
        const data = {
          data: encryptedData
        };
        // El usuario confirmó
        this.PuntosAreasCrudService.Desactivate_PuntoArea(data).subscribe(
          respuesta => {
            if (this.encodeService.decryptData(respuesta)?.resultado?.res) {
              this.GetPuntosAccesoArea(this.id);
              this.flasher.success(this.encodeService.decryptData(respuesta)?.resultado?.data);
            } else {
              this.flasher.error(this.encodeService.decryptData(respuesta)?.resultado?.data);
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
