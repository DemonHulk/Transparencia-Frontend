import { Component, OnInit } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { markFormGroupTouched, validarCorreoUTDelacosta, validarNombre, validarPassword, validarTelefono } from '../../../services/api-config';
import { UsuariocrudService } from '../../../services/crud/usuariocrud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { delay } from 'rxjs/operators';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrl: './edit-usuario.component.css'
})
export class EditUsuarioComponent implements OnInit {

  id: any;
  FormAltaUsuario: FormGroup;
  data_user: any;
  isSubmitting: boolean = false;
  response: any;
  constructor(
    public sharedService: SharedValuesService,
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
          validarNombre(true), // Aplica el validador personalizado, el true significa que no debe estar vacio
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100)
        ],
      ],
      primerApellido: ['',
        [
          validarNombre(true), // Aplica el validador personalizado, el true significa que no debe estar vacio
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100)
        ],
      ],
      segundoApellido: ['',
        [
          validarNombre(false), // Aplica el validador personalizado, el false significa que puede estar vacio
          Validators.minLength(4),
          Validators.maxLength(100)
        ],
      ],
      correo: ['',
        [
          validarCorreoUTDelacosta(), // Aplica el validador personalizado
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100),
        ],

      ],
      telefono: ['',
        [
          validarTelefono(), // Aplica el validador personalizado
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      password: ['',
        [
          validarPassword(false), // Aplica el validador personalizado, el false significa que la contraseña puede estar vacia
          Validators.minLength(6),
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
    this.sharedService.setLoading(true);


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

  /* Extraer los datos del usuario mediante su id e ingresarlos en su respectivo campo*/
  GetOneUserService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
    this.UsuariocrudService.GetOneUserService(encryptedID).subscribe(
      (respuesta: any) => {
        this.data_user = this.encodeService.decryptData(respuesta).resultado.data?.data[0];
        this.sharedService.changeTitle('Modificar usuario: ' + this.data_user?.nombre);

        this.FormAltaUsuario.patchValue({
          id_usuario: this.data_user?.id_usuario,
          nombre: this.data_user?.nombre,
          primerApellido: this.data_user?.apellido1,
          segundoApellido: this.data_user?.apellido2,
          telefono: this.data_user?.telefono,
          correo: this.data_user?.correo,
          id_area: this.data_user?.id_area,
          nombre_area: this.data_user?.nombre_area
        });
      },
      error => {
        console.error('Ocurrió un error al obtener el usuario:', error);
      }
    );
  }
 /* Variables spinner */
 porcentajeEnvio: number = 0;
 mostrarSpinner: boolean = false;
 mensaje = "Actualizando...";
  UpdateUserService(): void {
    markFormGroupTouched(this.FormAltaUsuario);

    if (this.FormAltaUsuario.valid) {
      this.mostrarSpinner = true; // Mostrar spinner de carga
      // Enviamos tanto los datos del formulario como el id encriptados
      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormAltaUsuario.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));

      const data = {
        data: encryptedData
      };

      this.UsuariocrudService.UpdateUserService(data, encryptedID).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.UploadProgress:
              if (event.total !== undefined) {
                const percentDone = Math.round((100 * event.loaded) / event.total);
                this.porcentajeEnvio = percentDone; // Actualizar el porcentaje de envío
              }
              break;
            case HttpEventType.Response:
              // Manejo de la respuesta encriptada
              const encryptedResponse = event.body;
              const decryptedResponse = this.encodeService.decryptData(encryptedResponse);
              if (decryptedResponse?.resultado?.data?.res) {
                this.flasher.success(decryptedResponse?.resultado?.data?.data);
                this.router.navigate(['/usuarios']);
              } else {
                this.flasher.error(decryptedResponse?.resultado?.data?.data || 'No se recibió una respuesta válida');
              }
              this.mostrarSpinner = false; // Ocultar spinner al finalizar
              break;
            default:
              this.mostrarSpinner = false;
              this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
              break;
          }
        },
        error => {
          this.mostrarSpinner = false; // Ocultar spinner en caso de error
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
        const decryptedData = this.encodeService.decryptData(resultado);
        const areas = decryptedData?.resultado?.data?.data || [];
        this.sharedService.setLoading(false);


        // Filtrar solo las áreas activas
        this.area = areas.filter((area: any) => area.activo === true);
      },
      (error: any) => {
        console.error('Error al cargar datos:', error);
        this.area = []; // Asignar un array vacío en caso de error
      }
    );
  }
}
