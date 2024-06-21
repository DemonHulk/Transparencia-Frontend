import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { validarTelefono } from '../../../services/api-config';
import { EjerciciocrudService } from '../../../services/crud/ejerciciocrud.service';

@Component({
  selector: 'app-edit-ejercicio',
  templateUrl: './edit-ejercicio.component.html',
  styleUrl: './edit-ejercicio.component.css'
})
export class EditEjercicioComponent {
  id: any;
  FormEditEjercicio: FormGroup;
  ejercicio: any;

  constructor(
    public sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    public formulario: FormBuilder,
    private EjercicioCrudService: EjerciciocrudService,
    private router: Router,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService
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
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
    this.EjercicioCrudService.GetOneEjercicioService(encryptedID).subscribe(respuesta => {
      if (respuesta) { // Verificar si respuesta no es undefined
        this.ejercicio = this.encodeService.decryptData(respuesta);
        console.log(this.ejercicio);
        // Asigna el valor al FormControl ejercicio
        this.FormEditEjercicio.patchValue({
          ejercicio: this.ejercicio?.resultado?.data?.ejercicio
        });
        this.sharedService.setLoading(false);

      } else {
        console.error('La respuesta es undefined');

      }
    }, error => {
      console.error('Ocurrió un error al obtener el área:', error);

    });
  }

  UpdateEjercicioService(): void {
    if (this.FormEditEjercicio.valid) {
      const encryptedData = this.encodeService.encryptData(JSON.stringify(this.FormEditEjercicio.value));
      const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
      const data = {
        data: encryptedData
      };
    this.EjercicioCrudService.UpdateEjercicioService(data, encryptedID).subscribe(
      respuesta => {
        if (this.encodeService.decryptData(respuesta)?.resultado?.res) { // Verificar si respuesta.resultado.res no es undefined
          this.flasher.success(this.encodeService.decryptData(respuesta)?.resultado?.data);
          this.router.navigate(['/ejercicios']);
        } else {
          this.flasher.error(this.encodeService.decryptData(respuesta)?.resultado?.data || 'No se recibió una respuesta válida');
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
