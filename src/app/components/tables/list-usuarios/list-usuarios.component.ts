import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { Table } from 'primeng/table';
import { Usuario, TooltipManager } from '../../../services/api-config';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { UsuariocrudService } from '../../../services/crud/usuariocrud.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';

@Component({
  selector: 'app-list-usuarios',
  templateUrl: './list-usuarios.component.html',
  styleUrl: './list-usuarios.component.css'
})
export class ListUsuariosComponent {

  @ViewChild('dtActive') dtActive: Table | undefined;
  @ViewChild('dtInactive') dtInactive: Table | undefined;

  ListUser: Usuario[] = [];
  ListActiveUser: Usuario[] = [];
  ListInactiveUser: Usuario[] = [];
  isLoading: boolean = true;

  constructor(
    public sharedService: SharedValuesService,
    private encodeService: CryptoServiceService,
    private UsuariocrudService: UsuariocrudService,
    private flasher: AlertsServiceService,
    private el: ElementRef
  ) {
    this.isLoading = true;
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
    this.sharedService.changeTitle('Usuarios registrados en el sistema');
    this.sharedService.setLoading(true);
    this.GetAllUserArea();
  }

  encriptarId(id: any) {
    return this.encodeService.encodeID(id);
  }


  GetAllUserArea() {
    this.UsuariocrudService.GetUsuariosArea().subscribe(
      (respuesta: any) => {
        try {
          /* Desencriptamos la respuesta que nos retorna el backend */
          this.ListUser = this.encodeService.decryptData(respuesta).resultado?.data?.data;

          // Filtrar los usuarios activos
          this.ListActiveUser = this.ListUser.filter(usuario => usuario.activo == true);

          // Filtrar los usuarios inactivos
          this.ListInactiveUser = this.ListUser.filter(usuario => usuario.activo == false);

          // Indicar que todos los datos se han cargado
          setTimeout(() => {
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        } catch {
          this.sharedService.updateErrorLoading(this.el, { message: 'usuarios' });
        }
      },
      () => {
        this.sharedService.updateErrorLoading(this.el, { message: 'usuarios' });
      }
    );
  }

  getNombreCompleto(usuario: any): string {
    return `${usuario.nombre} ${usuario.apellido1} ${usuario.apellido2}`;
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

  DeleteUser(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.UsuariocrudService.DeleteUserService(encryptedID).subscribe(respuesta => {
          this.GetAllUserArea();
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data?.data);
        });
      }
    });
  }

  ActivateUser(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {
        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.UsuariocrudService.ActivateUserService(encryptedID).subscribe(respuesta => {
          this.GetAllUserArea();
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data?.data);
        });
      }
    });
  }

}
