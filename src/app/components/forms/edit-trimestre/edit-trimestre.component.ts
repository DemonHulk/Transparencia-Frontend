import { Component, ElementRef } from '@angular/core';
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
  idEncrypt:any;
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
    private activateRoute: ActivatedRoute,
    private el: ElementRef,
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
    this.idEncrypt=this.id;

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
      try {
        // Desencriptar la respuesta para obtener los datos del trimestre
        const decryptedData = this.CryptoServiceService.decryptData(respuesta);

        // Verificar si la respuesta contiene datos válidos
        if (decryptedData && decryptedData.resultado?.data?.length > 0) {
          this.data_trimestre = decryptedData.resultado.data[0];

          // Actualizar el título del componente con el nombre del trimestre
          this.sharedService.changeTitle('Modificar Trimestre: ' + this.data_trimestre?.trimestre);

          // Asignar los valores recuperados al formulario FormAltaTrimestre
          this.FormAltaTrimestre.patchValue({
            id_trimestre: this.data_trimestre?.id_trimestre,
            trimestre: this.data_trimestre?.trimestre,
            ejercicio: this.data_trimestre?.id_ejercicio
          });
        } else {
          this.sharedService.updateErrorLoading(this.el, { message: 'edit-trimestre/'+this.idEncrypt });
        }
      } catch (error) {
        this.sharedService.updateErrorLoading(this.el, { message: 'edit-trimestre/'+this.idEncrypt });
      }
    },
    (error) => {
      this.sharedService.updateErrorLoading(this.el, { message: 'edit-trimestre/'+this.idEncrypt });
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
      try {
        // Desencriptar de manera segura la respuesta recibida del backend
        const decryptedData = this.CryptoServiceService.decryptData(resultado);

        // Verificar si la respuesta contiene datos válidos
        if (decryptedData && decryptedData.resultado?.data) {
          // Filtrar solo los ejercicios activos
          this.ejercicio = decryptedData.resultado.data.filter((ejercicio: any) => ejercicio.activo === true);
        } else {
          this.sharedService.updateErrorLoading(this.el, { message: 'edit-trimestre/' + this.idEncrypt });
          this.ejercicio = []; // Asignar un arreglo vacío en caso de datos inválidos
        }

        // Indicar que la carga de datos ha finalizado correctamente
        this.sharedService.setLoading(false);
      } catch (error) {
        console.error('Error al desencriptar datos de ejercicios:', error);
        this.sharedService.updateErrorLoading(this.el, { message: 'edit-trimestre/' + this.idEncrypt });
        this.ejercicio = []; // Manejar el error asignando un arreglo vacío
        this.sharedService.setLoading(false); // Asegurar que se marque como cargado aunque haya error
      }
    },
    (error: any) => {
      // Manejar errores de la suscripción al servicio
      console.error('Error al obtener datos de ejercicios:', error);
      this.sharedService.updateErrorLoading(this.el, { message: 'edit-trimestre/' + this.idEncrypt });
      this.ejercicio = []; // Manejar el error asignando un arreglo vacío
      this.sharedService.setLoading(false); // Asegurar que se marque como cargado aunque haya error
    }
  );
}


}
