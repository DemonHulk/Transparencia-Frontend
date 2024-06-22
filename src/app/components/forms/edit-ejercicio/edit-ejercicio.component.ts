import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { markFormGroupTouched, validarTelefono } from '../../../services/api-config';
import { EjerciciocrudService } from '../../../services/crud/ejerciciocrud.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-ejercicio',
  templateUrl: './edit-ejercicio.component.html',
  styleUrl: './edit-ejercicio.component.css'
})
export class EditEjercicioComponent {
  id: any;
  idEncrypt: any;
  FormEditEjercicio: FormGroup;
  ejercicio: any;

  constructor(
    public sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    public formulario: FormBuilder,
    private EjercicioCrudService: EjerciciocrudService,
    private router: Router,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private el: ElementRef
  ) {
    this.FormEditEjercicio = this.formulario.group({
      ejercicio: ['',
        [
          validarTelefono(), //Validación personalizada
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4)
        ],
      ]
    });
  }

  ngOnInit(): void {
    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");
    this.idEncrypt = this.id;

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/ejercicios");
    }
    this.sharedService.changeTitle('Modificar Ejercicio');
    this.sharedService.setLoading(true);

    this.GetOneEjercicioService(this.id);

  }

  GetOneEjercicioService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));

    this.EjercicioCrudService.GetOneEjercicioService(encryptedID).subscribe(
      (respuesta: any) => {
        try {
          if (respuesta) {
            this.ejercicio = this.encodeService.decryptData(respuesta);

            // Asegúrate de que ejercicio y resultado.data.data.ejercicio existan antes de asignar
            const ejercicio = this.ejercicio?.resultado?.data?.ejercicio || '';

            // Asigna el valor al FormControl ejercicio
            this.FormEditEjercicio.patchValue({
              ejercicio: ejercicio
            });

            this.sharedService.setLoading(false);
          } else {
            this.sharedService.updateErrorLoading(this.el, { message: 'edit-ejercicio/' +this.idEncrypt });
          }
        } catch (error) {
          this.sharedService.updateErrorLoading(this.el, { message: 'edit-ejercicio/' +this.idEncrypt });
        }
      },
      (error) => {
        this.sharedService.updateErrorLoading(this.el, { message: 'edit-ejercicio/' +this.idEncrypt });
      }
    );
  }


   /* Variables spinner */
   porcentajeEnvio: number = 0;
   mostrarSpinner: boolean = false;
   mensaje = "Actualizando...";
   UpdateEjercicioService(): void {
    markFormGroupTouched(this.FormEditEjercicio);

    if (this.FormEditEjercicio.valid) {
      this.mostrarSpinner = true; // Mostrar spinner de carga

      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormEditEjercicio.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
      const data = {
        data: encryptedData
      };

      this.EjercicioCrudService.UpdateEjercicioService(data, encryptedID).subscribe(
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
              if (decryptedResponse?.resultado?.res) {
                this.flasher.success(decryptedResponse?.resultado?.data);
                this.router.navigate(['/ejercicios']);
              } else {
                this.flasher.error(decryptedResponse?.resultado?.data || 'No se recibió una respuesta válida');
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
}
