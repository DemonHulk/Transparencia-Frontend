import { Component } from '@angular/core';
import { SharedValuesService } from '../../../../services/shared-values.service';
import { PuntocrudService } from '../../../../services/crud/puntocrud.service';
import { UsuariocrudService } from '../../../../services/crud/usuariocrud.service';
import { FechaService } from '../../../../services/format/fecha.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsServiceService } from '../../../../services/alerts/alerts-service.service';
import { CryptoServiceService } from '../../../../services/cryptoService/crypto-service.service';
import { Punto, Titulo } from '../../../../services/api-config';
import { TituloscrudService } from '../../../../services/crud/tituloscrud.service';

@Component({
  selector: 'app-details-punto',
  templateUrl: './details-punto.component.html',
  styleUrl: './details-punto.component.css'
})
export class DetailsPuntoComponent {


  id: any;
  DataPunto: any;
  ListPunto: Punto[] = [];
  ListTitulos: Titulo[] = [];
  data_usuariosacceso: any;

  constructor(
    public sharedService: SharedValuesService,
    private UsuariocrudService: UsuariocrudService,
    private FechaService: FechaService,
    private activateRoute: ActivatedRoute,
    private flasher: AlertsServiceService,
    private encodeService: CryptoServiceService,
    private TituloscrudService: TituloscrudService,
    private router: Router,
    private PuntocrudService: PuntocrudService


  ) {

    //Tomas la id de la URL
    this.id = this.activateRoute.snapshot.paramMap.get("id");

    //Desencriptar la ID
    this.id = this.encodeService.decodeID(this.id);

    //Verificar si la ID es null, si es así, redirige a la página de puntos
    if (this.id === null) {
      this.router.navigateByUrl("/puntos");
    }

    this.sharedService.setLoading(true);


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
      this.sharedService.changeTitle('Información detallada del punto: Normativas de la institución');
      this.GetOnePuntoService(this.id);
      this.GetTitulosPunto(this.id);
  }

// GetOnePuntoService

  /* Extraer los datos del area que se esta visualizando el detalle */
  GetOnePuntoService(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.PuntocrudService.GetOnePuntoService(encryptedID).subscribe(
      respuesta => {
        this.DataPunto = this.encodeService.decryptData(respuesta)?.resultado?.data;
        this.sharedService.changeTitle('Información detallada del punto: ' + this.DataPunto?.nombre_punto);
      },
      error => {
        console.error('Ocurrió un error al obtener punto:', error);
      }
    );
  }


  /** Desactiva un titulo */
  DeleteTitulo(id: any) {
    this.flasher.eliminar().then((confirmado) => {
      if (confirmado) {
      this.sharedService.setLoading(true);

        // Enviamos la id encriptada
        const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
        this.TituloscrudService.DeleteTituloService(encryptedID).subscribe(respuesta => {
          this.GetTitulosPunto(this.id);
          this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
          setTimeout(() => {
            this.sharedService.setLoading(false);
            window.HSStaticMethods.autoInit();
          }, 500);
        });
      }
    });
  }

    /** Desactiva un titulo */
    ActivateTitulo(id: any) {
      this.flasher.reactivar().then((confirmado) => {
        if (confirmado) {
      this.sharedService.setLoading(true);

          // Enviamos la id encriptada
          const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
          this.TituloscrudService.ActivateTituloService(encryptedID).subscribe(respuesta => {
            this.GetTitulosPunto(this.id);
            this.flasher.success(this.encodeService.decryptData(respuesta).resultado?.data);
            setTimeout(() => {
              this.sharedService.setLoading(false);
              window.HSStaticMethods.autoInit();
            }, 500);
          });
        }
      });
    }


  /* Extraer los datos del area que se esta visualizando el detalle */
  GetTitulosPunto(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.TituloscrudService.GetTitulosPunto(encryptedID).subscribe(
      respuesta => {
        this.ListTitulos = this.encodeService.decryptData(respuesta)?.resultado?.data;
        this.sharedService.setLoading(false);
      },
      error => {
        console.error('Ocurrió un error al obtener el titulo:', error);
      }
    );
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

  encriptarId(id:any){
    return this.encodeService.encodeID(id);
  }


  /**
  * Actualiza la fecha de formato YYYY-MM-DD a
  */
  FormatearDate(fecha: any) {
    if (!fecha) {
      return ''; // O cualquier valor predeterminado que prefieras
    }
    return this.FechaService.formatDate(fecha);
  }
}
