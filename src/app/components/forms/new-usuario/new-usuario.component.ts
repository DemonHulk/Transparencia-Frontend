import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { validarCorreoUTDelacosta, validarNombre, validarPassword, validarTelefono } from '../../../services/api-config';
import { UsuariocrudService } from '../../../services/crud/usuariocrud.service';
import { AreaCrudService } from '../../../services/crud/areacrud.service';

@Component({
  selector: 'app-new-usuario',
  templateUrl: './new-usuario.component.html',
  styleUrl: './new-usuario.component.css'
})
export class NewUsuarioComponent {

  FormAltaUsuario:FormGroup;

  constructor(
    private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private UsuariocrudService: UsuariocrudService,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private AreaCrudService : AreaCrudService
  ) {
    this.FormAltaUsuario = this.formulario.group({
      nombre: ['',
        [
          Validators.required,
          validarNombre(true), // Aplica el validador personalizado, el true significa que no debe estar vacio
          Validators.minLength(4),
          Validators.maxLength(100)
        ],
      ],
      primerApellido: ['',
        [
          Validators.required,
          validarNombre(true), // Aplica el validador personalizado, el true significa que no debe estar vacio
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
          Validators.required,
          validarCorreoUTDelacosta(), //Aplica el validador personalizado
          Validators.minLength(4),
          Validators.maxLength(100),
        ],

      ],
      telefono: ['',
        [
          Validators.required,
          validarTelefono(),// Aplica el validador personalizado
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      password: ['',
        [
          Validators.required,
          validarPassword(true), // Aplica el validador personalizado, el true significa que require que la contraseña no este vacía
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
    this.sharedService.changeTitle('Registrar un nuevo usuario');
    this.loadArea();
}

SaveUsuario(): any {
  if (this.FormAltaUsuario.valid) {
    this.UsuariocrudService.InsertUsuarioService(this.FormAltaUsuario.value).subscribe(
      respuesta => {
        console.log(respuesta)
        if (respuesta.resultado.res) {
          this.flasher.success(respuesta.resultado.data.data);
          this.router.navigate(['/usuarios']);
        } else {
          this.flasher.error(respuesta.resultado.data);
        }
      },
      error => {
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
