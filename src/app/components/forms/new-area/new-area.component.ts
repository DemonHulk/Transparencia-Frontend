import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AreaCrudService } from '../../../services/crud/area.service';
import { Router } from '@angular/router';
import flasher from "@flasher/flasher";


@Component({
  selector: 'app-new-area',
  templateUrl: './new-area.component.html',
  styleUrl: './new-area.component.css'
})
export class NewAreaComponent {

  FormAltaArea:FormGroup;

  constructor(
    private sharedService: SharedValuesService,
    public formulario: FormBuilder,
    private AreaCrudService: AreaCrudService,
    private router: Router // Inyecta el Router
  ) {
    this.FormAltaArea = this.formulario.group({
      nombreArea: [''],
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
      this.sharedService.changeTitle('Registrar una nueva área');

  }


  SaveArea(): any {
    console.log(this.FormAltaArea.value);
    this.AreaCrudService.InsertAreaService(this.FormAltaArea.value).subscribe(
      respuesta => {
        console.log(respuesta);
        if (respuesta.resultado.res) {
          flasher.success(respuesta.resultado.message);
          this.router.navigate(['/areas']); 
        }else{
          flasher.error(respuesta.resultado.message);
        }
      },
      error => {
        console.log(error);
        flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");

      }
    );
  }

}
