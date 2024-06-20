import { Component } from '@angular/core';
import { SharedValuesService } from '../../../services/shared-values.service';
import { PuntocrudService } from '../../../services/crud/puntocrud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validarTextoNormal } from '../../../services/api-config';

@Component({
  selector: 'app-new-tema',
  templateUrl: './new-tema.component.html',
  styleUrl: './new-tema.component.css'
})
export class NewTemaComponent {
  id: any;
  idEncrypt: any;
  nombrePunto: any;
  formAltaTema: FormGroup;

  constructor(private sharedService: SharedValuesService,
    private activateRoute: ActivatedRoute,
    public formulario: FormBuilder,
    private encodeService: CryptoServiceService,
    private router: Router,
    private PuntocrudService: PuntocrudService,
  ) {
    this.formAltaTema = this.formulario.group({
      nombre_titulo: ['',
        [
          validarTextoNormal(), // Aplica el validador personalizado, el true significa que no debe estar vacio
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(70)
        ],
      ],
      tipo_contenido: ['1',
        [
          Validators.required,
        ],
      ],
      es_link: ['',
        [
          Validators.required,
        ],
      ],
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

    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("punto");
    this.idEncrypt = this.id;

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de áreas
    if (this.id === null) {
      this.router.navigateByUrl("/puntos");
    }
    this.GetOnePuntoService(this.id);

    this.sharedService.changeTitle('Registrar un nuevo tema para el punto: ' + this.nombrePunto);
  }


  /** EXTRAE EL NOMBRE DEL PUNTO ACTUAL EN REVISION */
  GetOnePuntoService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(this.id));
    this.PuntocrudService.GetOnePuntoService(encryptedID).subscribe(respuesta => {
      if (respuesta) { // Verificar si respuesta no es undefined
        this.nombrePunto = this.encodeService.decryptData(respuesta).resultado?.data?.nombre_punto;
        this.sharedService.changeTitle('Registrar un nuevo tema para el punto: ' + this.nombrePunto);
      } else {
      }
    }, error => {
    });
  }
}
