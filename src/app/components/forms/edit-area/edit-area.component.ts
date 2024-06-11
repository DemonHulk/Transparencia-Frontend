import { Component, OnInit } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AreaCrudService } from '../../../services/crud/areacrud.service';
import { AlertsServiceService } from '../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';

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
      nombreArea: ['']
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
    this.sharedService.loadScript("/assets/js/validations.js");


    this.GetOneAreaService(this.id);

  }

  GetOneAreaService(id: any) {
    this.AreaCrudService.GetOneAreaService(id).subscribe(respuesta => {
      if (respuesta) { // Verificar si respuesta no es undefined
        this.NombreArea = respuesta;
        console.log(this.NombreArea);
        // Asigna el valor al FormControl nombreArea
        this.FormAltaArea.patchValue({
          nombreArea: this.NombreArea?.resultado?.data?.nombre_area
        });
      } else {
        console.error('La respuesta es undefined');

      }
    }, error => {
      console.error('Ocurrió un error al obtener el área:', error);

    });
  }

  UpdateAreaService(): void {
    console.log(this.FormAltaArea.value);
    this.AreaCrudService.UpdateAreaService(this.FormAltaArea.value, this.id).subscribe(
      respuesta => {
        console.log(respuesta);
        if (respuesta?.resultado?.res) { // Verificar si respuesta.resultado.res no es undefined
          this.flasher.success(respuesta.resultado.data);
          this.router.navigate(['/areas']);
        } else {
          this.flasher.error(respuesta?.resultado?.data || 'No se recibió una respuesta válida');
        }
      },
      error => {
        console.log(error);
        this.flasher.error("Hubo un error, Intente más tarde o notifique al soporte técnico.");
      }
    );
  }
}
