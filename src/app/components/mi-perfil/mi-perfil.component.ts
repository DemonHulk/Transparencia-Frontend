import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoServiceService } from '../../services/cryptoService/crypto-service.service';
import { Usuario } from '../../services/api-config';
import { UsuariocrudService } from '../../services/crud/usuariocrud.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {

  id: any;
  data_user: Usuario | null = null;
  decryptedData: any;
  constructor(
    public sharedService: SharedValuesService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private CryptoServiceService: CryptoServiceService,
    private UsuariocrudService: UsuariocrudService,
    private el: ElementRef
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
    this.sharedService.changeTitle('Mi perfil');

    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");

    //Desencriptar la ID
    this.id = this.CryptoServiceService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/areas");
    }
    this.sharedService.setLoading(true);
    this.GetOneUserService(this.id);
  }


  /* Extraer los datos del usuario que se esta visualizando el detalle */
  GetOneUserService(id: any) {
    const encryptedID = this.CryptoServiceService.encryptData(JSON.stringify(id));

    this.UsuariocrudService.GetOneUserService(encryptedID).subscribe(
      (respuesta: any) => {
        try {
          /* Enviamos los datos de la respuesta al servicio para desencriptarla */
          this.decryptedData = this.CryptoServiceService.decryptData(respuesta).resultado?.data?.data[0];

          // Verificamos que la respuesta sea válida antes de proceder
          if (this.decryptedData) {
            // Crear objeto Usuario con los datos desencriptados
            this.data_user = new Usuario(
              this.decryptedData.id_punto,
              this.decryptedData.nombre,
              this.decryptedData.apellido1,
              this.decryptedData.apellido2,
              this.decryptedData.correo,
              this.decryptedData.activo
            );

            this.sharedService.changeTitle('Información detallada del usuario: ' + this.data_user?.nombre);
          }

          /* Indicar que todos los datos se han cargado */
          this.sharedService.setLoading(false);
          window.HSStaticMethods.autoInit();
        } catch {
          this.sharedService.updateErrorLoading(this.el, { message: 'myprofile' });
        }
      },
      () => {
        this.sharedService.updateErrorLoading(this.el, { message: 'myprofile' });
      }
    );
  }


  encriptarId(id:any){
    return this.CryptoServiceService.encodeID(id);
  }

}
