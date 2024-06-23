import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../services/shared-values.service';
import { Punto } from '../../services/api-config';
import { PuntocrudService } from '../../services/crud/puntocrud.service';
import { CryptoServiceService } from '../../services/cryptoService/crypto-service.service';
import { FechaService } from '../../services/format/fecha.service';

@Component({
  selector: 'app-articulo33',
  templateUrl: './articulo33.component.html',
  styleUrl: './articulo33.component.css'
})
export class Articulo33Component {

  constructor(public sharedService: SharedValuesService,
    private PuntocrudService: PuntocrudService,
    private encodeService: CryptoServiceService,
    private el: ElementRef,
    private FechaService: FechaService,
  ) {

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
    this.sharedService.changeTitle('Articulo 33');

    this.GetAllPuntosService();
}


  ListPuntos :any = [];
  puntoSeleccionado: any;

  cambiarPunto(punto: any){
    if(punto > 0){

      this.puntoSeleccionado  = punto;
      this.cambiarContenidoPunto();
    }
  }


   loadingCompleted: boolean = false;
  /**
   * Obtener los puntos activos del sistema
   */
  GetAllPuntosService() {
    this.PuntocrudService.GetAllPuntosService().subscribe(
      (respuesta: any) => {
        try {
          this.ListPuntos = this.encodeService.decryptData(respuesta).resultado?.data.map((punto: Punto) => this.addFormattedDate(punto));
          this.ListPuntos = this.ListPuntos.filter((punto:any) => punto.activo == true);
          const puntoSeleccionado = this.ListPuntos.find((punto:any) => punto.orden_punto === 1);
          this.puntoSeleccionado = puntoSeleccionado ? puntoSeleccionado.id_punto : null;
          this.cambiarPunto(puntoSeleccionado.id_punto);

          setTimeout(() => {
            this.loadingCompleted = true; // Marca que la carga ha completado
            window.HSStaticMethods.autoInit();

          }, 500);
        } catch {
          this.sharedService.updateErrorLoading(this.el, { message: 'puntos' });
        }
      },
      () => {
        this.sharedService.updateErrorLoading(this.el, { message: 'puntos' });
      }
    );
  }


  private addFormattedDate(punto: Punto): Punto & { fecha_string: string } {
    return {
      ...punto,
      fecha_string: this.FechaService.formatDate(punto.fecha_creacion)
    };
  }
  isButtonListHidden = true;

  toggleButtonList() {
    this.isButtonListHidden = !this.isButtonListHidden;
  }

  cambiarContenidoPunto(){
    return this.puntoSeleccionado;
  }

}
