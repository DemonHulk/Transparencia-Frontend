import { Component, ElementRef, OnInit } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { markFormGroupTouched, validarNombre, validarTextoNormal } from '../../../services/api-config';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrl: './edit-area.component.css'
})
export class EditAreaComponent implements OnInit {
  id: any;
  idEncrypt: any;
  FormAltaArea: FormGroup;
  NombreArea: any;

  constructor(
    public sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    public formulario: FormBuilder,
    private AreaCrudService: AreaCrudService,
    private router: Router,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private el: ElementRef
  ) {
    this.FormAltaArea = this.formulario.group({
      nombreArea: ['',
        [
          validarNombre(true), //Validación personalizada
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
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
      this.router.navigateByUrl("/areas");
    }
    this.sharedService.changeTitle('Modificar área');
    this.sharedService.setLoading(true);

    this.GetOneAreaService(this.id);

  }

  GetOneAreaService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));

    this.AreaCrudService.GetOneAreaService(encryptedID).subscribe(
      (respuesta: any) => {
        try {
          if (respuesta) {
            this.NombreArea = this.encodeService.decryptData(respuesta);

            // Asegúrate de que NombreArea y resultado.data.data.nombre_area existan antes de asignar
            const nombreArea = this.NombreArea?.resultado?.data?.data?.nombre_area || '';

            // Asigna el valor al FormControl nombreArea
            this.FormAltaArea.patchValue({
              nombreArea: nombreArea
            });

            this.sharedService.setLoading(false);
          } else {
            this.sharedService.updateErrorLoading(this.el, { message: 'edit-area/'+this.idEncrypt });
          }
        } catch (error) {
          this.sharedService.updateErrorLoading(this.el, { message: 'edit-area/'+this.idEncrypt });
        }
      },
      (error) => {
        this.sharedService.updateErrorLoading(this.el, { message: 'edit-area/'+this.idEncrypt });
      }
    );
  }

 /* Variables spinner */
 porcentajeEnvio: number = 0;
 mostrarSpinner: boolean = false;
 mensaje = "Actualizando...";
  UpdateAreaService(): void {
    markFormGroupTouched(this.FormAltaArea);

    if (this.FormAltaArea.valid) {
      this.mostrarSpinner = true;

      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormAltaArea.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id)); // Asumiendo que 'id' es tu identificador a encriptar

      const data = {
        data: encryptedData
      };

      this.AreaCrudService.UpdateAreaService(data, encryptedID).subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.UploadProgress:
              if (event.total !== undefined) {
                const percentDone = Math.round((100 * event.loaded) / event.total);
                this.porcentajeEnvio = percentDone;
                this.mostrarSpinner = true;
              }
              break;
            case HttpEventType.Response:
              // Manejo de la respuesta encriptada
              const encryptedResponse = event.body;
              const decryptedResponse = this.encodeService.decryptData(encryptedResponse);
              if (decryptedResponse?.resultado?.data?.res) {
                this.flasher.success(decryptedResponse?.resultado?.data?.data);
                this.router.navigate(['/areas']);
              } else {
                this.mostrarSpinner = false;
                this.flasher.error(decryptedResponse?.resultado?.data?.data || 'No se recibió una respuesta válida');
              }
              break;
            default:
              this.mostrarSpinner = false;
              break;
          }
        },
        error => {
          this.mostrarSpinner = false;
          this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
        }
      );
    } else {
      this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
    }
  }
}
