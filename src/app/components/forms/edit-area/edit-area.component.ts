import { Component, OnInit } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { validarNombre, validarTextoNormal } from '../../../services/api-config';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrl: './edit-area.component.css'
})
export class EditAreaComponent implements OnInit {
  id: any;
  FormAltaArea: FormGroup;
  NombreArea: any;

  constructor(
    private sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    public formulario: FormBuilder,
    private AreaCrudService: AreaCrudService,
    private router: Router,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService
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

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/areas");
    }
    this.sharedService.changeTitle('Modificar área');
    this.GetOneAreaService(this.id);

  }

  GetOneAreaService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
    this.AreaCrudService.GetOneAreaService(encryptedID).subscribe(respuesta => {
      if (respuesta) { // Verificar si respuesta no es undefined
        this.NombreArea = this.encodeService.decryptData(respuesta);
        // Asigna el valor al FormControl nombreArea
        this.FormAltaArea.patchValue({
          nombreArea: this.NombreArea?.resultado?.data?.data?.nombre_area
        });
      } else {
        console.error('La respuesta es undefined');

      }
    }, error => {
      console.error('Ocurrió un error al obtener el área:', error);

    });
  }

  UpdateAreaService(): void {
    if (this.FormAltaArea.valid) {
      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormAltaArea.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
      const data = {
        data: encryptedData
      };
    this.AreaCrudService.UpdateAreaService(data, encryptedID).subscribe(
      respuesta => {
        if (this.encodeService.decryptData(respuesta)?.resultado?.data?.res) { // Verificar si respuesta.resultado.res no es undefined
          this.flasher.success(this.encodeService.decryptData(respuesta)?.resultado?.data?.data);
          this.router.navigate(['/areas']);
        } else {
          this.flasher.error(this.encodeService.decryptData(respuesta)?.resultado?.data?.data || 'No se recibió una respuesta válida');
        }
      },
      error => {
        console.log(error);
        this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
      }
    );
  } else {
    this.flasher.error("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
  }
  }
}
