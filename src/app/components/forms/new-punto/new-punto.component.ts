import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { PuntocrudService } from '../../../services/crud/puntocrud.service';
import { Area,  markFormGroupTouched, validarNombre } from '../../../services/api-config';
import { AreaCrudService } from '../../../services/crud/areacrud.service';

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

  SavePunto(): any {
    markFormGroupTouched(this.FormAltaPunto);
    if (this.FormAltaPunto.valid) {
      console.log((this.FormAltaPunto.value));
      const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaPunto.value));

      const data = {
        data: encryptedData
      };
      this.PuntocrudService.InsertPuntoService(data).subscribe(
        respuesta => {
          console.log(this.CryptoServiceService.decryptData(respuesta));
          if (this.CryptoServiceService.decryptData(respuesta)?.resultado?.res) {
            this.flasher.success(this.CryptoServiceService.decryptData(respuesta)?.resultado?.data);
            this.router.navigate(['/puntos']);
          } else {
            this.flasher.error(this.CryptoServiceService.decryptData(respuesta)?.resultado?.data);
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

  initializeDynamicControls() {
    // Itera sobre ListArea y agrega los controles dinámicamente al formulario
    this.ListArea.forEach(area => {
      const controlName = `vertical-checkbox-${area.id_area}`;
      this.FormAltaPunto.addControl(controlName, this.formulario.control(false));
    });
  }

  GetActAreaService() {
    this.AreaCrudService.GetActAreaService().subscribe((respuesta: any) => {
      /* Desencriptamos la respuesta que nos retorna el backend */ 
      this.ListArea = this.encodeService.decryptData(respuesta).resultado?.data?.data;

      this.initializeDynamicControls();


      //Indicar que todos los datos se han cargado
      setTimeout(() => {

        this.sharedService.setLoading(false);
        window.HSStaticMethods.autoInit();
      }, 500);

    });
  }



}
