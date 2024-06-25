import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { Trimestre, markFormGroupTouched, validarNombreArchivo, validarTextoNormal, validarTitulo } from '../../../services/api-config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContenidocrudService } from '../../../services/crud/contenidocrud.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { TrimestrecrudService } from '../../../services/crud/trimestrecrud.service';

@Component({
  selector: 'app-new-pdf',
  templateUrl: './new-pdf.component.html',
  styleUrl: './new-pdf.component.css'
})
export class NewPdfComponent {

  id_tema:any;
  id_punto:any;
  FormAltaContenido:FormGroup;
  ListTrimestres: (Trimestre & { fecha_string: string })[] = [];
  ListActiveTrimestres: (Trimestre & { fecha_string: string })[] = [];
  ListInactiveTrimestres: (Trimestre & { fecha_string: string })[] = [];
  datosUsuario: any;
  constructor(
    private sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    public formulario: FormBuilder,
    private router: Router,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private ContenidocrudService: ContenidocrudService,
    private TrimestrecrudService: TrimestrecrudService,
    private el: ElementRef
  ) {
    const extensionesArchivo  = /(\.pdf)$/i;

    //Tomas la id de la URL
    this.id_tema = this.activateRoute.snapshot.paramMap.get("tema");
    this.id_punto = this.activateRoute.snapshot.paramMap.get("punto");

    //Desencriptar la ID
    this.id_tema = this.encodeService.decodeID(this.id_tema);
    this.id_punto = this.encodeService.decodeID(this.id_punto);
    this.datosUsuario = this.encodeService.desencriptarDatosUsuario()
    //Verificar si la ID es null, si es así, redirige a la página de puntos
    if (this.id_tema === null) {
      this.router.navigateByUrl("/puntos");
    }

    this.FormAltaContenido = this.formulario.group({
      nombreExterno: ['',
        [
          validarTitulo(), //Validación personalizada
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(300)
        ],
      ],
      nombreInterno: ['',
        [
          validarNombreArchivo(), //Validación personalizada
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      descripcion: ['',
        [
          validarTextoNormal(),
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(600)
        ],
      ],
      archivo: ['',
        [
          Validators.required,
          Validators.pattern(extensionesArchivo)
        ],
      ],
      id_trimestre: ['',
        [
          Validators.required,
        ],
      ],
      id_titulo: [this.id_tema,
        [
          Validators.required,
        ],
      ],
      id_usuario: [this.datosUsuario?.id_usuario,
        [
          Validators.required,
        ],
      ],
      orden: [''

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
    this.sharedService.changeTitle('Registrar un nuevo archivo');
    this.GetAllTrimestresService();
}

encriptarId(id:any){
  return this.encodeService.encodeID(id);
}

/* Variables spinner */
porcentajeEnvio: number = 0;
mostrarSpinner: boolean = false;
mensaje = "Guardando...";
SaveContenido(): any {
  this.markFormGroupTouched(this.FormAltaContenido);

  if (this.FormAltaContenido.valid) {
    this.mostrarSpinner = true;
    const formData: FormData = new FormData();

    // Convertir los datos del formulario a un objeto plano y encriptarlos
    const formValue = this.FormAltaContenido.getRawValue();
    const encryptedData = this.encodeService.encryptData(JSON.stringify(formValue));
    formData.append('encryptedData', encryptedData);

    // Obtener el archivo del FormGroup y adjuntarlo al FormData si está presente
    const archivo = this.nuevoArchivo;
    if (archivo instanceof File) {
      formData.append('archivo', archivo, archivo.name);
    }

    // Enviar la solicitud al servicio
    this.sendRequest(formData);
  } else {
    this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
  }
}

private sendRequest(formData: FormData) {
  this.ContenidocrudService.InsertContenidoDinamicoService(formData).subscribe(
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
            this.router.navigate(['/details-punto/'+ this.encriptarId(this.id_punto)]);
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
      this.mostrarSpinner = false; // Ocultar spinner en caso de error
      this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
    }
  );
}


private markFormGroupTouched(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control) {
      control.markAsTouched({ onlySelf: true });
    }
  });
}

// Conserguimos los trimestres activos para mostrarlos en el select
GetAllTrimestresService() {
  this.TrimestrecrudService.GetAllTrimestreService().subscribe(
    (respuesta: any) => {
      try {
        /* Desencriptamos la respuesta que nos retorna el backend */
        this.ListTrimestres = this.encodeService.decryptData(respuesta).resultado?.data?.data;
        // Filtrar los trimestres activos
        this.ListActiveTrimestres = this.ListTrimestres.filter(trimestre => trimestre.activo == true);
        // Filtrar los trimestres inactivos
        this.ListInactiveTrimestres = this.ListTrimestres.filter(trimestre => trimestre.activo == false);
        //Indicar que todos los datos se han cargado
        this.sharedService.setLoading(false);
        window.HSStaticMethods.autoInit();
      } catch {
        this.sharedService.updateErrorLoading(this.el, { message: 'new-pdf/'+ this.encriptarId(this.id_punto) + '/' +  this.encriptarId(this.id_tema) });
      }
    },
    () => {
      this.sharedService.updateErrorLoading(this.el, { message: 'new-pdf/'+ this.encriptarId(this.id_punto) + '/' +  this.encriptarId(this.id_tema) });
    }
  );
}

SeleccionarArchivo(event: Event) {
  const archivoSeleccionado = (event.target as HTMLInputElement).files?.[0];
  this.FormAltaContenido.patchValue({ archivo: archivoSeleccionado });
}


nuevoArchivo!: File;
// Evento para cargar los datos del archivo
handleFileInputChange(event:any) {
  const inputElement = event.target;
  const files = inputElement.files;

  if (files && files.length > 0) {
    const file = files[0];

    // Pasamos el valor del archivo a la varibles para agregarlo al formData
    this.nuevoArchivo = file;
  }
}



}
