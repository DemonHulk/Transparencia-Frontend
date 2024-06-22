import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../../services/shared-values.service';
import { UsuariocrudService } from '../../../../services/crud/usuariocrud.service';
import { CryptoServiceService } from '../../../../services/cryptoService/crypto-service.service';
import { Usuario } from '../../../../services/api-config';
import { ActivatedRoute, Router } from '@angular/router';
import { FechaService } from '../../../../services/format/fecha.service';

@Component({
  selector: 'app-details-usuario',
  templateUrl: './details-usuario.component.html',
  styleUrl: './details-usuario.component.css'
})
export class DetailsUsuarioComponent {

  id: any;
  idEncrypt: any;
  data_user: any;
  listUsuarios: Usuario[] = [];

  constructor(
    public sharedService: SharedValuesService,
    private UsuariocrudService: UsuariocrudService,
    private FechaService: FechaService,
    private activateRoute: ActivatedRoute,
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
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));

    this.UsuariocrudService.GetOneUserService(encryptedID).subscribe(
      (respuesta: any) => {
        try {
          /* Enviamos los datos de la respuesta al servicio para desencriptarla */
          this.data_user = this.encodeService.decryptData(respuesta).resultado?.data?.data[0];
          this.listUsuarios = [this.encodeService.decryptData(respuesta).resultado?.data?.data[0]];
          this.sharedService.changeTitle('Información detallada del usuario: ' + this.data_user?.nombre);

          /* Indicar que todos los datos se han cargado */
          setTimeout(() => {
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        } catch {
          this.sharedService.updateErrorLoading(this.el, { message: 'details-usuario/'+this.idEncrypt });
        }
      },
      () => {
        this.sharedService.updateErrorLoading(this.el, { message: 'details-usuario/'+this.idEncrypt });
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
