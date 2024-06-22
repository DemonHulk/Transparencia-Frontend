import { Component, ElementRef, OnInit } from '@angular/core';
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
  idEncrypt: any;
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
    private AreaCrudService : AreaCrudService,
    private el: ElementRef

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
    this.idEncrypt = this.id;
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
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));

    this.UsuariocrudService.GetOneUserService(encryptedID).subscribe(
      (respuesta: any) => {
        try {
          // Desencriptar la respuesta para obtener los datos del usuario
          const decryptedData = this.encodeService.decryptData(respuesta);

          // Verificar si la respuesta contiene datos válidos
          if (decryptedData && decryptedData.resultado?.data?.data.length > 0) {
            this.data_user = decryptedData.resultado.data.data[0];

            // Actualizar el título del componente con el nombre del usuario
            this.sharedService.changeTitle('Modificar usuario: ' + this.data_user.nombre);

            // Asignar los valores recuperados al formulario FormAltaUsuario
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
          } else {
            this.sharedService.updateErrorLoading(this.el, { message: 'edit-usuario/'+this.idEncrypt });
          }
        } catch (error) {
          this.sharedService.updateErrorLoading(this.el, { message: 'edit-usuario/'+this.idEncrypt });
        }
      },
      (error) => {
        this.sharedService.updateErrorLoading(this.el, { message: 'edit-usuario/'+this.idEncrypt });
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
        try {
          // Desencriptar la respuesta para obtener los datos de las áreas
          const decryptedData = this.encodeService.decryptData(resultado);

          // Obtener las áreas del resultado desencriptado o asignar un arreglo vacío si no hay datos válidos
          const areas = decryptedData?.resultado?.data?.data || [];

          // Filtrar solo las áreas activas
          this.area = areas.filter((area: any) => area.activo === true);

          // Indicar que la carga ha finalizado
          this.sharedService.setLoading(false);
        } catch (error) {
          // Manejar el error utilizando updateErrorLoading para mostrar un mensaje específico
          this.sharedService.updateErrorLoading(this.el, { message: 'edit-usuario/'+this.idEncrypt });
          this.sharedService.setLoading(false); // Asegurar que se marque como cargado aunque haya error
        }
      },
      (error: any) => {
        // Manejar el error utilizando updateErrorLoading para mostrar un mensaje específico
        this.sharedService.updateErrorLoading(this.el, { message: 'edit-usuario/'+this.idEncrypt });
        this.sharedService.setLoading(false); // Asegurar que se marque como cargado aunque haya error
      }
    );

  }
}
