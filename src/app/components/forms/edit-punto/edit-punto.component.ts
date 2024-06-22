import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Area, markFormGroupTouched, validarNombre } from '../../../services/api-config';
import { PuntocrudService } from '../../../services/crud/puntocrud.service';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { PuntosAreasCrudService } from '../../../services/crud/puntosareascrud.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-punto',
  templateUrl: './edit-punto.component.html',
  styleUrl: './edit-punto.component.css'
})
export class EditPuntoComponent {

  id: any;
  idEncrpyt: any;
  FormAltaPunto:FormGroup;
  ListArea: Area[] = [];
  ListAreaPunto: Area[] = [];
  nombrePunto: any;
  punto: any;


  constructor(
    public sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private activateRoute: ActivatedRoute,
    private PuntocrudService: PuntocrudService,
    private AreaCrudService: AreaCrudService,
    private PuntosAreasCrudService:PuntosAreasCrudService,
    private router: Router, // Inyecta el Router
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private el: ElementRef

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
    this.sharedService.setLoading(true);


    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");
    this.idEncrpyt = this.id;

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/puntos");
    }
    this.GetOnePuntoService(this.id);
    this.GetAreasPunto_PuntoService(this.id);
  }


  porcentajeEnvio: number = 0;
  mostrarSpinner: boolean = false;
  mensaje = "Actualizando...";
  UpdatePunto(): any {
    markFormGroupTouched(this.FormAltaPunto);

    if (this.FormAltaPunto.valid && this.selectedAreas.length > 0) {
      this.mostrarSpinner = true; // Mostrar spinner de carga

      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormAltaPunto.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
      const data = {
        data: encryptedData
      };

      this.PuntocrudService.UpdatePuntoService(data, encryptedID).subscribe(
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

  /** EXTRAE EL NOMBRE DEL PUNTO ACTUAL EN REVISION */
  GetOnePuntoService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));

    this.PuntocrudService.GetOnePuntoService(encryptedID).subscribe(
      (respuesta: any) => {
        try {
          if (respuesta) {
            this.nombrePunto = this.encodeService.decryptData(respuesta);

            // Asegúrate de que nombrePunto y resultado.data.nombre_punto existan antes de asignar
            const nombrePunto = this.nombrePunto?.resultado?.data?.nombre_punto || '';

            // Asigna el valor al FormControl nombrePunto
            this.FormAltaPunto.patchValue({
              nombrePunto: nombrePunto
            });
          } else {
            this.sharedService.updateErrorLoading(this.el, { message: 'edit-punto/'+this.idEncrpyt });
          }
        } catch (error) {
          this.sharedService.updateErrorLoading(this.el, { message: 'edit-punto/'+this.idEncrpyt });
        }
      },
      (error) => {
        this.sharedService.updateErrorLoading(this.el, { message: 'edit-punto/'+this.idEncrpyt });
      }
    );
  }


  /** EXTRAE LSO DATOS DEL PUNTO ACTUAL EN REVISION */
  GetAreasPuntoService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));

    this.PuntocrudService.GetOnePuntoService(encryptedID).subscribe(
      (respuesta: any) => {
        try {
          if (respuesta) {
            // Desencriptar la respuesta para obtener los datos del punto
            const decryptedData = this.encodeService.decryptData(respuesta);

            // Verificar si la respuesta contiene datos válidos
            if (decryptedData && decryptedData.resultado?.data) {
              this.nombrePunto = decryptedData.resultado.data.nombre_punto;

              // Asignar el valor al FormControl nombrePunto del formulario FormAltaPunto
              this.FormAltaPunto.patchValue({
                nombrePunto: this.nombrePunto
              });

              // Indicar que la carga ha finalizado
              this.sharedService.setLoading(false);
            } else {
              this.sharedService.updateErrorLoading(this.el, { message: 'edit-punto/'+this.idEncrpyt });
            }
          } else {
            this.sharedService.updateErrorLoading(this.el, { message: 'edit-punto/'+this.idEncrpyt });
          }
        } catch (error) {
          this.sharedService.updateErrorLoading(this.el, { message: 'edit-punto/'+this.idEncrpyt });
        }
      },
      (error) => {
        this.sharedService.updateErrorLoading(this.el, { message: 'edit-punto/'+this.idEncrpyt });
      }
    );
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
