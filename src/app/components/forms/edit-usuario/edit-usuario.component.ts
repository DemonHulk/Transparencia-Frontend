import { Component, OnInit } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { validarCorreoUTDelacosta, validarNombre, validarPassword, validarTelefono } from '../../../services/api-config';
import { UsuariocrudService } from '../../../services/crud/usuariocrud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { delay } from 'rxjs/operators';

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

  /* Extraer los datos del usuario mediante su id e ingresarlos en su respectivo campo*/
  GetOneUserService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
    this.UsuariocrudService.GetOneUserService(encryptedID).subscribe(
      (respuesta: any) => {
        this.data_user = this.encodeService.decryptData(respuesta).resultado.data[0];
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

  UpdateUserService(): void {
    if (this.FormAltaUsuario.valid) {
      if (this.isSubmitting) {
        console.log('Ya hay una petición en curso. Espera a que se complete.');
        return;
      }

      this.isSubmitting = true; // Deshabilitar el botón
      // Enviamos tanto los datos del formulario como el id encriptados
      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormAltaUsuario.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));

      const data = {
        data: encryptedData
      };
      
      this.UsuariocrudService.UpdateUserService(data, encryptedID).pipe(
        delay(1000) // Agregar un retraso de 1 segundo (1000 ms)
      ).subscribe(
        respuesta => {
          if (this.encodeService.decryptData(respuesta)?.resultado?.res) {
            this.isSubmitting = false; // Habilitar el botón
            this.flasher.success(this.encodeService.decryptData(respuesta)?.resultado?.data);
            this.router.navigate(['/usuarios']);
          } else {
            this.isSubmitting = false; // Habilitar el botón en caso de error
            this.flasher.error(this.encodeService.decryptData(respuesta)?.resultado?.data || 'No se recibió una respuesta válida');
          }
        },
        error => {
          console.log(error);
          this.isSubmitting = false; // Habilitar el botón en caso de error
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
        this.area = this.encodeService.decryptData(resultado).resultado?.data;
      },
      (error: any) => {
        console.error('Error al cargar datos:', error);
        this.area = [];
      }
    );
  }
}
