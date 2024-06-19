import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Area, markFormGroupTouched, validarNombre } from '../../../services/api-config';
import { PuntocrudService } from '../../../services/crud/puntocrud.service';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { PuntosAreasCrudService } from '../../../services/crud/puntosareascrud.service';

@Component({
  selector: 'app-edit-punto',
  templateUrl: './edit-punto.component.html',
  styleUrl: './edit-punto.component.css'
})
export class EditPuntoComponent {

  id: any;
  FormAltaPunto:FormGroup;
  ListArea: Area[] = [];
  ListAreaPunto: Area[] = [];
  nombrePunto: any;
  punto: any;


  constructor(
    private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private activateRoute: ActivatedRoute,
    private PuntocrudService: PuntocrudService,
    private AreaCrudService: AreaCrudService,
    private PuntosAreasCrudService:PuntosAreasCrudService,
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
    this.sharedService.changeTitle('Modificar punto');
    this.sharedService.loadScript("/assets/js/validations.js");

    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/puntos");
    }

    
    this.GetOnePuntoService(this.id);
    this.GetAreasPunto_PuntoService(this.id);

  }


  
  UpdatePunto(): any {
    markFormGroupTouched(this.FormAltaPunto);
    if (this.FormAltaPunto.valid && this.selectedAreas.length > 0) {
      const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(this.FormAltaPunto.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));

      const data = {
        data: encryptedData
      };
      this.PuntocrudService.UpdatePuntoService(data,encryptedID).subscribe(
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

  /** EXTRAE EL NOMBRE DEL PUNTO ACTUAL EN REVISION */
  GetOnePuntoService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
    this.PuntocrudService.GetOnePuntoService(encryptedID).subscribe(respuesta => {
      if (respuesta) { // Verificar si respuesta no es undefined
        this.nombrePunto = this.encodeService.decryptData(respuesta);
        // Asigna el valor al FormControl nombrePunto
        this.FormAltaPunto.patchValue({
          nombrePunto: this.nombrePunto?.resultado?.data?.nombre_punto
        });
      } else {
        console.error('La respuesta es undefined');
      }
    }, error => {
      console.error('Ocurrió un error al obtener el área:', error);
    });
  }

  /** EXTRAE LSO DATOS DEL PUNTO ACTUAL EN REVISION */
  GetAreasPuntoService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
    this.PuntocrudService.GetOnePuntoService(encryptedID).subscribe(respuesta => {
      if (respuesta) { // Verificar si respuesta no es undefined
        this.nombrePunto = this.encodeService.decryptData(respuesta);
        // Asigna el valor al FormControl nombrePunto
        this.FormAltaPunto.patchValue({
          nombrePunto: this.nombrePunto?.resultado?.data?.nombre_punto
        });
      } else {
        console.error('La respuesta es undefined');
      }
    }, error => {
      console.error('Ocurrió un error al obtener el área:', error);
    });
  }


  /** AJUSTA EL FORMULARIO DINAMICO PARA QUE SE AGREGEN LOS PUNTOS DE LAS AREAS QUE SEAN */
  initializeDynamicControls() {
    // Inicializar selectedAreas con las áreas seleccionadas previamente
    this.selectedAreas = [];
    this.ListArea.forEach(area => {
      const puntoArea = this.ListAreaPunto.find(pa => pa.id_area === area.id_area);
      const controlName = `vertical-checkbox-${area.id_area}`;
      const control = this.formulario.control(puntoArea ? puntoArea.activo : false);
      area.activo = puntoArea ? puntoArea.activo : false; // Verifica si existe un punto para el área
  
      this.FormAltaPunto.addControl(controlName, control);
  
      // Agregar las áreas previamente seleccionadas a selectedAreas
      if (area.activo) {
        this.selectedAreas.push(Number(area.id_area));
      }
  
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
  
  

  /** EXTRAE LAS AREAS ACTIVAS PARA AGREGARLAS ABAJO*/
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


  /** EXTRAE LAS AREAS A LAS CUALES TIENE ACCESO UN PUNTO*/
  GetAreasPunto_PuntoService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
    this.PuntosAreasCrudService.GetAreasPunto_PuntoService(encryptedID).subscribe((respuesta: any) => {
      /* Desencriptamos la respuesta que nos retorna el backend */ 
      this.ListAreaPunto = this.encodeService.decryptData(respuesta).resultado?.data;
      //Indicar que todos los datos se han cargado
      this.GetActAreaService();
      setTimeout(() => {
        this.sharedService.setLoading(false);
        window.HSStaticMethods.autoInit();
      }, 500);
    });
  }


  





}
