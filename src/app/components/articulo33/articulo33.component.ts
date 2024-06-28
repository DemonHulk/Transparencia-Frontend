import { Component, ElementRef } from '@angular/core';
import { SharedValuesService } from '../../services/shared-values.service';
import { Punto, Titulo } from '../../services/api-config';
import { PuntocrudService } from '../../services/crud/puntocrud.service';
import { CryptoServiceService } from '../../services/cryptoService/crypto-service.service';
import { FechaService } from '../../services/format/fecha.service';
import { Subscription, debounceTime, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ContenidocrudService } from '../../services/crud/contenidocrud.service';

@Component({
  selector: 'app-articulo33',
  templateUrl: './articulo33.component.html',
  styleUrl: './articulo33.component.css'
})
export class Articulo33Component {

  constructor(public sharedService: SharedValuesService,
    private PuntocrudService: PuntocrudService,
    private encodeService: CryptoServiceService,
    private ContenidocrudService: ContenidocrudService,
    private el: ElementRef,
    private FechaService: FechaService,
  ) {

  }

  /**
 * Inicializa el componente y establece el título en el servicio de valores compartidos.
 *
 * @returns {void}
 */
  private subscription!: Subscription;
  searchControl = new FormControl('');
  results: any[] = [];
  showDropdown = false;

ngOnInit(): void {
    /**
     * Llama al método changeTitle del servicio de valores compartidos para actualizar el título.
     *
     * @param {string} newTitle - El nuevo título a establecer.
     * @memberof SharedValuesService
     */
    this.sharedService.changeTitle('Articulo 33');

    this.GetAllPuntosService();
    this.subscription = this.sharedService.data$.subscribe(data => {
      if(data != null && data != undefined && data > 0){
        this.puntoSeleccionado = data;
      }
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300) // Retraso de 300ms para evitar peticiones en cada tecla
  ).subscribe(value => {
      if (value && value.trim().length > 0) {
          this.ContenidocrudService.searchPDF({data: this.encodeService.encryptData(JSON.stringify(value))})
              .subscribe(results => {
                  if (results.body != undefined) {
                      const dataDecrypt = this.encodeService.decryptData(results.body);
                      if (dataDecrypt.estado && dataDecrypt.resultado.data.length > 0) {
                          this.results = dataDecrypt.resultado.data;
                          this.showDropdown = true; // Mostrar el dropdown
                      } else {
                          this.results = [];
                          this.showDropdown = false; // Ocultar el dropdown
                      }
                  }
              });
      } else {
          this.results = [];
          this.showDropdown = false; // Ocultar el dropdown si el valor no es válido
      }
  });
}


  ListPuntos :any = [];
  puntoSeleccionado: any;
  cambiarPunto(punto: any) {
    if (punto > 0 && !this.solicitudActiva) { // Verificar que el punto sea válido y no haya solicitud activa
      this.puntoSeleccionado = punto;
      window.scroll(0,0);
      this.cambiarContenidoPunto();
      this.buscar = null;
      this.buscarContenido();
    }
  }

  buscar:any = null;
  cambiarPuntoBusqueda(punto:any, titulo:any){
    this.buscar = null;
    this.buscarContenido();
    setTimeout(() => {
      if (punto > 0 && !this.solicitudActiva && titulo != '') { // Verificar que el punto sea válido y no haya solicitud activa
        this.puntoSeleccionado = punto;
        this.buscar = titulo;
        this.buscarContenido();
        this.cambiarContenidoPunto();
      }
    }, 100);
  }



  loadingCompleted: boolean = false;
  solicitudActiva: boolean = false;

  /**
   * Obtener los puntos activos del sistema
   */
  GetAllPuntosService() {
    if (this.solicitudActiva) {
      return; // Si hay una solicitud activa, salir del método sin hacer nada
    }

    this.solicitudActiva = true; // Marcar la solicitud como activa
    this.PuntocrudService.GetAllPuntosService().subscribe(
      (respuesta: any) => {
        try {
          this.ListPuntos = this.encodeService.decryptData(respuesta).resultado?.data.map((punto: Punto) => this.addFormattedDate(punto));
          this.ListPuntos = this.ListPuntos.filter((punto: any) => punto.activo == true);
          const puntoSeleccionado = this.ListPuntos.find((punto: any) => punto.orden_punto === 1);
          this.puntoSeleccionado = puntoSeleccionado ? puntoSeleccionado.id_punto : null;
          this.cambiarPunto(puntoSeleccionado?.id_punto);
        } catch {
          this.sharedService.updateErrorLoading(this.el, { message: 'articulo33' });
        } finally {
          setTimeout(() => {
            this.loadingCompleted = true; // Marca que la carga ha completado
            window.HSStaticMethods.autoInit();
            this.solicitudActiva = false; // Marcar la solicitud como no activa al finalizar
          }, 500);
        }
      },
      () => {
        this.sharedService.updateErrorLoading(this.el, { message: 'articulo33' });
        this.solicitudActiva = false; // Marcar la solicitud como no activa en caso de error
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

  buscarContenido(){
    return this.buscar;
  }



  onBlur() {
    setTimeout(() => this.showDropdown = false, 200);
  }

  onFocus() {
    this.showDropdown = this.results.length > 0;
  }

}
