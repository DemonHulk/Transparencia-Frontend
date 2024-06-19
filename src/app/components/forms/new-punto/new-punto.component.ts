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
    if (this.FormAltaPunto.valid && this.selectedAreas.length > 0) {
      const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaPunto.value));
      const data = {
        data: encryptedData
      };
      this.PuntocrudService.InsertPuntoService(data).subscribe(
        respuesta => {
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
    this.AreaCrudService.GetActAreaService().subscribe((respuesta: any) => {
      /* Desencriptamos la respuesta que nos retorna el backend */ 
      let decryptedData = this.encodeService.decryptData(respuesta).resultado?.data?.data;
  
      // Filtrar el array para excluir el registro con id_area = 1
      this.ListArea = decryptedData?.filter((area: any) => area.id_area !== 1) || [];
  
      this.initializeDynamicControls();
  
      // Indicar que todos los datos se han cargado
      setTimeout(() => {
        this.sharedService.setLoading(false);
        window.HSStaticMethods.autoInit();
      }, 500);
    });
  }



}
