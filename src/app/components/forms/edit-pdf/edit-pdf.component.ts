import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { ContenidocrudService } from '../../../services/crud/contenidocrud.service';
import { TrimestrecrudService } from '../../../services/crud/trimestrecrud.service';
import { Trimestre, markFormGroupTouched, validarNombreArchivo, validarTextoNormal, validarTitulo } from '../../../services/api-config';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-pdf',
  templateUrl: './edit-pdf.component.html',
  styleUrl: './edit-pdf.component.css'
})
export class EditPdfComponent {
  id_contenido_dinamico:any;
  id_punto:any;
  idEncrypt:any;
  datosUsuario: any;
  data_contenido: any;
  FormAltaContenido:FormGroup;
  isSubmitting = false;
  ListTrimestres: (Trimestre & { fecha_string: string })[] = [];
  ListActiveTrimestres: (Trimestre & { fecha_string: string })[] = [];
  ListInactiveTrimestres: (Trimestre & { fecha_string: string })[] = [];

  constructor(
    public sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    public formulario: FormBuilder,
    private router: Router,
    private flasher: AlertsServiceService,
    private CryptoServiceService: CryptoServiceService,
    private ContenidocrudService: ContenidocrudService,
    private TrimestrecrudService: TrimestrecrudService,
    private el: ElementRef

  ) {
    const extensionesArchivo  = /(\.pdf)$/i;

    //Tomas la id de la URL
    this.id_contenido_dinamico = this.activateRoute.snapshot.paramMap.get("contenido");
    this.id_punto = this.activateRoute.snapshot.paramMap.get("punto");
    this.idEncrypt=this.id_contenido_dinamico;
    //Desencriptar la ID
    this.id_contenido_dinamico = this.CryptoServiceService.decodeID(this.id_contenido_dinamico);
    this.id_punto = this.CryptoServiceService.decodeID(this.id_punto);
    this.datosUsuario = this.CryptoServiceService.desencriptarDatosUsuario()
    //Verificar si la ID es null, si es así, redirige a la página de puntos
    if (this.id_punto === null) {
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
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
          validarNombreArchivo(), //Validación personalizada
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
          Validators.pattern(extensionesArchivo)
        ],
      ],
      id_trimestre: ['',
        [
          Validators.required,
        ],
      ],
      id_usuario: [this.datosUsuario?.id_usuario,
        [
          Validators.required,
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
    this.sharedService.changeTitle('Modificar archivo');
    this.sharedService.loadScript("/assets/js/validations.js");
    this.sharedService.setLoading(true);
    this.GetOnecontenidoDinamicoService(this.id_contenido_dinamico);
    this.GetAllTrimestresService();
  }

  /* Extraer los datos del usuario mediante su id e ingresarlos en su respectivo campo*/
GetOnecontenidoDinamicoService(id: any) {
  const encryptedID = this.CryptoServiceService.encryptData(JSON.stringify(id));

  this.ContenidocrudService.GetOneContenidoDinamicoService(encryptedID).subscribe(
    (respuesta: any) => {
      try {
        // Desencriptar la respuesta para obtener los datos del trimestre
        const decryptedData = this.CryptoServiceService.decryptData(respuesta);

        // Verificar si la respuesta contiene datos válidos
        if (decryptedData && decryptedData.resultado?.data?.length > 0) {
          this.data_contenido = decryptedData.resultado.data[0];

          // Actualizar el título del componente con el nombre del trimestre
          this.sharedService.changeTitle('Modificar Contenido: ' + this.data_contenido?.nombre_externo_documento);

          // Asignar los valores recuperados al formulario FormAltaTrimestre
          this.FormAltaContenido.patchValue({
            nombreExterno: this.data_contenido?.nombre_externo_documento,
            nombreInterno: this.data_contenido?.nombre_interno_documento,
            descripcion: this.data_contenido?.descripcion,
            id_trimestre: this.data_contenido?.id_trimestre
          });
          this.sharedService.setLoading(false);
        } else {
          this.sharedService.updateErrorLoading(this.el, { message: 'edit-pdf/'+this.idEncrypt });
        }
      } catch (error) {
        this.sharedService.updateErrorLoading(this.el, { message: 'edit-pdf/'+this.idEncrypt });
      }
    },
    (error) => {
      this.sharedService.updateErrorLoading(this.el, { message: 'edit-pdf/'+this.idEncrypt });
    }
  );
}

/* Variables spinner */
porcentajeEnvio: number = 0;
mostrarSpinner: boolean = false;
mensaje = "Actualizando...";
private markFormGroupTouched(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control) {
      control.markAsTouched({ onlySelf: true });
    }
  });
}
updateContenido(): any {
  this.markFormGroupTouched(this.FormAltaContenido);

  if (this.FormAltaContenido.valid) {
    this.mostrarSpinner = true;
    const formData = new FormData();

    // Convertir los datos del formulario a un objeto plano y encriptarlos
    const formValue = this.FormAltaContenido.getRawValue();
    const encryptedData = this.CryptoServiceService.encryptData(JSON.stringify(formValue));
    formData.append('encryptedData', encryptedData);

    // Obtener el archivo del FormGroup y adjuntarlo al FormData si está presente
    const archivo = this.nuevoArchivo;
    if (archivo instanceof File) {
      formData.append('archivo', archivo, archivo.name);
    }

    // Enviar la solicitud de actualización al servicio
    this.sendUpdateRequest(formData);
  } else {
    this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
  }
}

sendUpdateRequest(formData: FormData) {
  const encryptedID = this.CryptoServiceService.encryptData(JSON.stringify(this.id_contenido_dinamico));
  this.ContenidocrudService.UpdateContenidoDinamicoService(formData, encryptedID).subscribe(
    (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:;
          break;
        case HttpEventType.UploadProgress:
          if (event.total !== undefined) {
            const percentDone = Math.round((100 * event.loaded) / event.total);
            this.porcentajeEnvio = percentDone;
          }
          break;
        case HttpEventType.Response:
          const encryptedResponse = event.body;
          const decryptedResponse = this.CryptoServiceService.decryptData(encryptedResponse);
          if (decryptedResponse?.resultado?.res) {
            this.flasher.success(decryptedResponse?.resultado?.data);
            this.router.navigate(['/details-punto/' + this.encriptarId(this.id_punto)]);
          } else {
            this.flasher.error(decryptedResponse?.resultado?.data);
          }
          this.mostrarSpinner = false;
          break;
      }
    },
    error => {
      this.mostrarSpinner = false;
      this.flasher.error("Hubo un error. Intente más tarde o notifique al soporte técnico.");
    }
  );
}

nuevoArchivo!: File;

handleFileInputChange(event:any) {
  const inputElement = event.target;
  const files = inputElement.files;
  
  if (files && files.length > 0) {
    const file = files[0];

    this.nuevoArchivo = file;
  }
}

// Conserguimos los trimestres activos para mostrarlos en el select
GetAllTrimestresService() {
  this.TrimestrecrudService.GetAllTrimestreService().subscribe(
    (respuesta: any) => {
      try {
        /* Desencriptamos la respuesta que nos retorna el backend */
        this.ListTrimestres = this.CryptoServiceService.decryptData(respuesta).resultado?.data?.data;
        // Filtrar los trimestres activos
        this.ListActiveTrimestres = this.ListTrimestres.filter(trimestre => trimestre.activo == true);
        // Filtrar los trimestres inactivos
        this.ListInactiveTrimestres = this.ListTrimestres.filter(trimestre => trimestre.activo == false);
        //Indicar que todos los datos se han cargado
        this.sharedService.setLoading(false);
        window.HSStaticMethods.autoInit();
      } catch {
        this.sharedService.updateErrorLoading(this.el, { message: 'edit-pdf/'+ this.encriptarId(this.id_punto) + '/' +  this.encriptarId(this.id_contenido_dinamico) });
      }
    },
    () => {
      this.sharedService.updateErrorLoading(this.el, { message: 'edit-pdf/'+ this.encriptarId(this.id_punto) + '/' +  this.encriptarId(this.id_contenido_dinamico) });
    }
  );
}

  encriptarId(id:any){
    return this.CryptoServiceService.encodeID(id);
  }
}
