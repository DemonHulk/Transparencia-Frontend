import { Component } from '@angular/core';
import { SharedValuesService } from '../../../../services/shared-values.service';
import { UsuariocrudService } from '../../../../services/crud/usuariocrud.service';
import { Table } from 'primeng/table';
import { CryptoServiceService } from '../../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../../services/alerts/alerts-service.service';
import { TooltipManager, Usuario } from '../../../../services/api-config';
import { ActivatedRoute, Router } from '@angular/router';
import { FechaService } from '../../../../services/format/fecha.service';

@Component({
  selector: 'app-details-usuario',
  templateUrl: './details-usuario.component.html',
  styleUrl: './details-usuario.component.css'
})
export class DetailsUsuarioComponent {

  id: any;
  data_user: any;
  listUsuarios: Usuario[] = [];

  constructor(
    private sharedService: SharedValuesService,
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
      this.router.navigateByUrl("/usuarios");
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
    // this.sharedService.changeTitle('Información detallada del usuario: Nombre completo');
    this.GetOneUserService(this.id);
  }

   /* Extraer los datos del usuario que se esta visualizando el detalle */
   GetOneUserService(id: any) {
    this.UsuariocrudService.GetOneUserService(id).subscribe(
      (respuesta: any) => {
        this.data_user = respuesta.resultado.data[0];
        this.listUsuarios = [respuesta.resultado.data[0]];
        this.sharedService.changeTitle('Información detallada del usuario: ' + this.data_user?.nombre);
        console.log(this.data_user);
      },
      error => {
        console.error('Ocurrió un error al obtener el usuario:', error);
      }
    );
  }

  FormatearDate(fecha: any) {
    if (!fecha) {
      return ''; // O cualquier valor predeterminado que prefieras
    }
    return this.FechaService.formatDate(fecha);
  }
}
