import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { PuntocrudService } from '../../../services/crud/puntocrud.service';
import { Area,  markFormGroupTouched, validarNombre } from '../../../services/api-config';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-new-punto',
  templateUrl: './new-punto.component.html',
  styleUrl: './new-punto.component.css'
})
export class NewPuntoComponent {

  FormAltaPunto:FormGroup;
  ListArea: Area[] = [];


  constructor(
    private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private PuntocrudService: PuntocrudService,
    private AreaCrudService: AreaCrudService,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private CryptoServiceService: CryptoServiceService,
    private encodeService: CryptoServiceService,
    private el:ElementRef
  ) {
    this.FormAltaPunto = this.formulario.group({
      nombrePunto: ['',
        [
          validarNombre(true), //Validación personalizada
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ],

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
      this.sharedService.changeTitle('Registrar un nuevo punto');
      this.sharedService.loadScript("/assets/js/validations.js");

      this.GetActAreaService();

  }

/* Variables spinner y mensaje */
porcentajeEnvio: number = 0;
mostrarSpinner: boolean = false;
mensaje = "Guardando...";

SavePunto(): any {
  markFormGroupTouched(this.FormAltaPunto);

  if (this.FormAltaPunto.valid && this.selectedAreas.length > 0) {
    this.mostrarSpinner = true; // Mostrar spinner de carga

    const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaPunto.value));
    const data = {
      data: encryptedData
    };

    this.PuntocrudService.InsertPuntoService(data).subscribe(
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
              this.router.navigate(['/puntos']);
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
    if (!this.FormAltaPunto.valid) {
      this.flasher.error("Datos Invalidos. Complete los datos correctamente.");
    } else {
      this.flasher.error("Debe seleccionar al menos un área.");
    }
  }
}


  selectedAreas: number[] = [];

  initializeDynamicControls() {
    // Itera sobre ListArea y agrega los controles dinámicamente al formulario
    this.ListArea.forEach(area => {
      const controlName = `vertical-checkbox-${area.id_area}`;
      const control = this.formulario.control(false);
      this.FormAltaPunto.addControl(controlName, control);

      // Agrega un event listener al control
      control.valueChanges.subscribe((value: boolean | null) => {
        if (value) {
          this.selectedAreas.push(Number(area.id_area)); // Convertir area.id_area a número
        } else {
          this.selectedAreas = this.selectedAreas.filter(id => id !== Number(area.id_area)); // Convertir area.id_area a número
        }
      });
    });
  }

  GetActAreaService() {
    this.AreaCrudService.GetActAreaService().subscribe(
      (respuesta: any) => {
        try {
          // Desencriptar la respuesta recibida del backend de manera segura
          const decryptedData = this.encodeService.decryptData(respuesta).resultado?.data?.data;

          // Filtrar el array para excluir el registro con id_area = 1
          this.ListArea = decryptedData?.filter((area: any) => area.id_area !== 1) || [];

          // Inicializar controles dinámicos para mejorar la interfaz de usuario
          this.initializeDynamicControls();

          // Indicar que la carga de datos ha finalizado correctamente
          setTimeout(() => {
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        } catch (error) {
          // Manejar cualquier error que ocurra durante el proceso
          this.sharedService.updateErrorLoading(this.el, { message: 'new-punto' });
        }
      },
      (error: any) => {
        // Manejar errores de la suscripción al servicio
        this.sharedService.updateErrorLoading(this.el, { message: 'new-punto' });
      }
    );
  }




}
