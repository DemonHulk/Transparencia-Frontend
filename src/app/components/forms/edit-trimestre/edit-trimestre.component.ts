import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { EjerciciocrudService } from '../../../services/crud/ejerciciocrud.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { TrimestrecrudService } from '../../../services/crud/trimestrecrud.service';
import { markFormGroupTouched, validarTrimestre } from '../../../services/api-config';
import { delay } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-trimestre',
  templateUrl: './edit-trimestre.component.html',
  styleUrl: './edit-trimestre.component.css'
})
export class EditTrimestreComponent {

  id: any;
  FormAltaTrimestre:FormGroup;
  isSubmitting = false;
  data_trimestre: any;

  constructor(public sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private EjerciciocrudService : EjerciciocrudService,
    private CryptoServiceService: CryptoServiceService,
    private TrimestrecrudService: TrimestrecrudService,
    private activateRoute: ActivatedRoute
    ) {
      this.FormAltaTrimestre = this.formulario.group({
        trimestre: ['',
          [
            validarTrimestre(), // Aplica el validador personalizado, el true significa que no debe estar vacio
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(25)
          ],
        ],
        ejercicio: ['',
          [
            Validators.required
          ]
        ],
    }
  )}

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
    this.sharedService.changeTitle('Modificar trimestre');
    this.sharedService.setLoading(true);


    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");

    //Desencriptar la ID
    this.id = this.CryptoServiceService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/usuarios");
    }

    this.GetOneTrimestreService(this.id);
    this.loadEjercicio();
}


/* Extraer los datos del usuario mediante su id e ingresarlos en su respectivo campo*/
GetOneTrimestreService(id: any) {
  const encryptedID = this.CryptoServiceService.encryptData(JSON.stringify(id));
  this.TrimestrecrudService.GetOneTrimestreService(encryptedID).subscribe(
    (respuesta: any) => {
      this.data_trimestre = this.CryptoServiceService.decryptData(respuesta).resultado.data[0];
      this.sharedService.changeTitle('Modificar Trimestre: ' + this.data_trimestre?.trimestre);

      this.FormAltaTrimestre.patchValue({
        id_trimestre: this.data_trimestre?.id_trimestre,
        trimestre: this.data_trimestre?.trimestre,
        ejercicio: this.data_trimestre?.id_ejercicio
      });
    },
    error => {
      console.error('Ocurrió un error al obtener el trimestre:', error);
    }
  );
}

  /* Variables spinner */
  porcentajeEnvio: number = 0;
  mostrarSpinner: boolean = false;
  mensaje = "Actualizando...";
  UpdateTrimestre(): void {
    markFormGroupTouched(this.FormAltaTrimestre);

    if (this.FormAltaTrimestre.valid) {
      this.mostrarSpinner = true; // Mostrar spinner de carga

      this.isSubmitting = true; // Deshabilitar el botón

      // Enviamos tanto los datos del formulario como el id encriptados
      const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaTrimestre.value));
      const encryptedID = this.CryptoServiceService.encryptData(JSON.stringify(this.id));

      const data = {
        data: encryptedData
      };

      this.TrimestrecrudService.UpdateTrimestreService(data, encryptedID).subscribe(
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
              const decryptedResponse = this.CryptoServiceService.decryptData(encryptedResponse);
              if (decryptedResponse?.resultado?.res) {
                this.flasher.success(decryptedResponse?.resultado?.data);
                this.router.navigate(['/trimestres']);
              } else {
                this.flasher.error(decryptedResponse?.resultado?.data);
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
          console.log(error);
          this.mostrarSpinner = false; // Ocultar spinner en caso de error
          this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
        }
      );
    } else {
      this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
    }
  }


ejercicio: any[] = [];
loadEjercicio(): void {
  this.EjerciciocrudService.GetAllEjercicioService().subscribe(
    (resultado: any) => {
      this.ejercicio = this.CryptoServiceService.decryptData(resultado)?.resultado?.data;
      this.sharedService.setLoading(false);

    },
    (error: any) => {
      console.error('Error al cargar datos:', error);
      this.ejercicio = [];
    }
  );
}


}
