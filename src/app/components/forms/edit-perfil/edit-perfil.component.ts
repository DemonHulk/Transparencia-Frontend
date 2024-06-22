import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { UsuariocrudService } from '../../../services/crud/usuariocrud.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markFormGroupTouched, validarCorreoUTDelacosta, validarNombre, validarPassword, validarTelefono } from '../../../services/api-config';
import { delay } from 'rxjs';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-perfil',
  templateUrl: './edit-perfil.component.html',
  styleUrl: './edit-perfil.component.css'
})
export class EditPerfilComponent {

  id: any;
  FormEditPerfil: FormGroup;
  data_user: any;
  isSubmitting: boolean = false;
  response: any;

  constructor(
    public sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    public formulario: FormBuilder,
    private flasher: AlertsServiceService,
    private UsuariocrudService: UsuariocrudService,
    private router: Router,
    private encodeService: CryptoServiceService,
    private el: ElementRef,

  ) {
    this.FormEditPerfil = this.formulario.group({
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
      ]
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
    this.sharedService.changeTitle('Modificar mi información');
    let idencrypt;
    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");
    idencrypt = this.id;
    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);
    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/myprofile");
    }
    this.sharedService.setLoading(true);
    this.GetOneUserService(this.id);
  }

  /* Extraer los datos del usuario mediante su id e ingresarlos en su respectivo campo*/
  GetOneUserService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));

    this.UsuariocrudService.GetOneUserService(encryptedID).subscribe(
      (respuesta: any) => {
        try {
          // Desencripta la respuesta para obtener los datos del usuario
          const decryptedData = this.encodeService.decryptData(respuesta);

          // Verifica si la respuesta y sus datos están presentes y son válidos
          if (decryptedData && decryptedData.resultado?.data?.data?.length > 0) {
            this.data_user = decryptedData.resultado.data?.data[0];

            // Actualiza el título del componente con el nombre del usuario
            this.sharedService.changeTitle('Modificar usuario: ' + this.data_user?.nombre);

            // Asigna los valores a los controles del formulario FormEditPerfil
            this.FormEditPerfil.patchValue({
              nombre: this.data_user?.nombre,
              primerApellido: this.data_user?.apellido1,
              segundoApellido: this.data_user?.apellido2,
              telefono: this.data_user?.telefono,
              correo: this.data_user?.correo,
            });

            // Indica que la carga ha finalizado
            this.sharedService.setLoading(false);
          } else {
            this.sharedService.updateErrorLoading(this.el, { message: 'usuario' });
          }
        } catch (error) {
          this.sharedService.updateErrorLoading(this.el, { message: 'usuario' });
        }
      },
      (error) => {
        this.sharedService.updateErrorLoading(this.el, { message: 'usuario' });
      }
    );
  }



  /* Variables spinner */
 porcentajeEnvio: number = 0;
 mostrarSpinner: boolean = false;
 mensaje = "Actualizando...";
  UpdatePerfilService(): void {
    markFormGroupTouched(this.FormEditPerfil);

    if (this.FormEditPerfil.valid) {
      this.mostrarSpinner = true;

      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormEditPerfil.value));
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
                this.porcentajeEnvio = percentDone;
                this.mostrarSpinner = true;
              }
              break;
            case HttpEventType.Response:
              // Manejo de la respuesta encriptada
              const encryptedResponse = event.body;
              const decryptedResponse = this.encodeService.decryptData(encryptedResponse);
              if (decryptedResponse?.resultado?.data?.res) {
                this.flasher.success(decryptedResponse?.resultado?.data?.data);
                this.router.navigate(['/myprofile/' + this.encriptarId(this.id)]);
              } else {
                this.flasher.error(decryptedResponse?.resultado?.data?.data || 'No se recibió una respuesta válida');
              }
              this.mostrarSpinner = false;
              break;
            default:
              this.mostrarSpinner = false;
              this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
              break;
          }
        },
        error => {
          this.mostrarSpinner = false;
          this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
        }
      );
    } else {
      this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
    }
  }


  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }
}
