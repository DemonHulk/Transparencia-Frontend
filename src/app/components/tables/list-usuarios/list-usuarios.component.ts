import { Component, ViewChild } from '@angular/core';
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
    private UsuariocrudService : UsuariocrudService,
    private flasher: AlertsServiceService
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
    this.sharedService.changeTitle('Usuarios registrados en el sistema');
    this.sharedService.setLoading(true);
    this.GetAllUserArea();
  }

  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }


  GetAllUserArea() {
    this.UsuariocrudService.GetUsuariosArea().subscribe((respuesta: any) => {
      
      /* Enviamos los datos de la respuesta al servicio de desencriptar*/ 
      this.ListUser = this.encodeService.decryptData(respuesta).resultado.data;

      // // Filtrar los usuarios activas
       this.ListActiveUser = this.ListUser.filter(usuario => usuario.activo == true);

      // // Filtrar los usuarios inactivas
       this.ListInactiveUser = this.ListUser.filter(usuario => usuario.activo == false);

      //Indicar que todos los datos se han cargado
      setTimeout(() => {
        this.sharedService.setLoading(false);
        window.HSStaticMethods.autoInit();
      }, 500);
    });
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

  DeleteUser(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
        this.UsuariocrudService.DeleteUserService(id).subscribe(respuesta => {
          this.GetAllUserArea();
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado.data);
        });
      }
    });
  }

  ActivateUser(id: any) {
    this.flasher.reactivar().then((confirmado) => {
      if (confirmado) {
        this.UsuariocrudService.ActivateUserService(id).subscribe(respuesta => {
          this.GetAllUserArea();
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado.data);
        });
      }
    });
  }

}
