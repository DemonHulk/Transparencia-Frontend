import { Component } from '@angular/core';
import { SharedValuesService } from '../../../../services/shared-values.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoServiceService } from '../../../../services/cryptoService/crypto-service.service';
import { PuntocrudService } from '../../../../services/crud/puntocrud.service';
import { FechaService } from '../../../../services/format/fecha.service';

@Component({
  selector: 'app-details-punto',
  templateUrl: './details-punto.component.html',
  styleUrl: './details-punto.component.css'
})
export class DetailsPuntoComponent {
  id: any;
  idEncrypt: any;
  punto: any;
  constructor(private sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    private encodeService: CryptoServiceService,
    private router: Router,
    private PuntocrudService:PuntocrudService,
    private FechaService: FechaService,





  ) { }

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
    this.sharedService.changeTitle('Información detallada del punto: Normativas de la institución');
    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");
    this.idEncrypt = this.id;

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/puntos");
    }


    this.GetOnePuntoService(this.id);
}

  /** EXTRAE EL NOMBRE DEL PUNTO ACTUAL EN REVISION */
  GetOnePuntoService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
    this.PuntocrudService.GetOnePuntoService(encryptedID).subscribe(respuesta => {
      if (respuesta) { // Verificar si respuesta no es undefined
        this.punto = this.encodeService.decryptData(respuesta).resultado?.data;
      } else {
      }
    }, error => {
    });
  }

getNumbers(): number[] {
  const numbers: number[] = [];
  for (let i = 1; i <= 6; i++) {
    numbers.push(i);
  }
  return numbers;
}

getNumbersSubtema(): number[] {
  const numbers: number[] = [];
  for (let i = 1; i <= 3; i++) {
    numbers.push(i);
  }
  return numbers;
}

FormatearDate(fecha: any) {
  if (!fecha) {
    return ''; // O cualquier valor predeterminado que prefieras
  }
  return this.FechaService.formatDate(fecha);
}
}
