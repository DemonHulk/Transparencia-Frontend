import { Component, OnInit } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { validarCorreoUTDelacosta, validarTextoNormal } from '../../../services/api-config';
import { UsuariocrudService } from '../../../services/crud/usuariocrud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaCrudService } from '../../../services/crud/areacrud.service';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrl: './edit-usuario.component.css'
})
export class EditUsuarioComponent implements OnInit {

  id: any;
  FormAltaUsuario: FormGroup;
  data_user: any;

  constructor(
    private sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    public formulario: FormBuilder,
    private UsuariocrudService: UsuariocrudService,
    private router: Router,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private AreaCrudService : AreaCrudService
  ) {
    this.FormAltaUsuario = this.formulario.group({
      nombre: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100)
        ],
        [validarTextoNormal()] // Aplica el validador personalizado
      ],
      primerApellido: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100)
        ],
        [validarTextoNormal()] // Aplica el validador personalizado
      ],
      segundoApellido: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100)
        ],
        [validarTextoNormal()] // Aplica el validador personalizado
      ],
      correo: ['',

        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100),
          validarCorreoUTDelacosta()
        ],

      ],
      telefono: ['',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      password: ['',
        [
          Validators.minLength(4),
          Validators.maxLength(100)
        ]
      ],
      id_area: ['',
        [
          Validators.required
        ]
      ],
    });
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
    // this.sharedService.changeTitle('Modificar usuario: Nombre completo');
    this.sharedService.loadScript("/assets/js/validations.js");

    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/usuarios");
    }

    this.GetOneUserService(this.id);
    this.loadArea();
}

  /* Extraer los datos del usuario mediante su id*/
  GetOneUserService(id: any) {
    this.UsuariocrudService.GetOneUserService(id).subscribe(
      (respuesta: any) => {
        this.data_user = respuesta.resultado.data[0];
        this.sharedService.changeTitle('Modificar usuario: ' + this.data_user?.nombre);
        console.log(this.data_user);

        this.FormAltaUsuario.patchValue({
          id_usuario: this.data_user.id_usuario,
          nombre: this.data_user.nombre,
          primerApellido: this.data_user.apellido1,
          segundoApellido: this.data_user.apellido2,
          telefono: this.data_user.telefono,
          correo: this.data_user.correo,
          id_area: this.data_user.id_area,
          nombre_area: this.data_user.nombre_area
        });
      },
      error => {
        console.error('Ocurrió un error al obtener el usuario:', error);
      }
    );
  }

  UpdateUserService(): void {
    if (this.FormAltaUsuario.valid) {
    this.UsuariocrudService.UpdateUserService(this.FormAltaUsuario.value, this.id).subscribe(
      respuesta => {
        console.log(respuesta);
        if (respuesta?.resultado?.res) { // Verificar si respuesta.resultado.res no es undefined
          this.flasher.success(respuesta.resultado.data.data);
          this.router.navigate(['/usuarios']);
        } else {
          this.flasher.error(respuesta?.resultado?.data || 'No se recibió una respuesta válida');
        }
      },
      error => {
        console.log(error);
        this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
      }
    );
  } else {
    this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
  }
  }

  area: any[] = [];
  loadArea(): void {
    this.AreaCrudService.GetAllAreaService().subscribe(
      (resultado: any) => {
        this.area = resultado.resultado.data;
      },
      (error: any) => {
        console.error('Error al cargar datos:', error);
        this.area = [];
      }
    );
  }
}
