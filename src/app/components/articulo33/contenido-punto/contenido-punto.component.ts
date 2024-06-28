import { Component, ElementRef, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { TituloscrudService } from '../../../services/crud/tituloscrud.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { SharedValuesService } from '../../../services/shared-values.service';
import { Subscription, finalize } from 'rxjs';
import { Titulo } from '../../../services/api-config';

@Component({
  selector: 'app-contenido-punto',
  templateUrl: './contenido-punto.component.html',
  styleUrl: './contenido-punto.component.css'
})
export class ContenidoPuntoComponent implements OnInit {
  @Input() punto: any;
  @Input() buscar: any = null;

  constructor(
    public tituloCrudService: TituloscrudService,
    private encodeService: CryptoServiceService,
    public sharedService: SharedValuesService,
    private el: ElementRef
  ){
    this.sharedService.setLoading(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.punto != undefined){
      if (changes['punto']) {
        const puntoChange: SimpleChange = changes['punto'];
        const buscarChange: SimpleChange = changes['buscar'];

        this.sharedService.setLoading(true);
        if(puntoChange.currentValue > 0){
        this.sharedService.setLoading(true);
          this.getTitulosByPunto(puntoChange.currentValue);
          if(buscarChange){
            this.buscar = buscarChange.currentValue;
          }

        }
      }
      if (changes['buscar']){
        const buscarChange: SimpleChange = changes['buscar'];

            this.scrollToTitle(buscarChange.currentValue);

      }
    }else{
      this.sharedService.setLoading(true);
    }

  }

  private subscription!: Subscription;
  ngOnInit(){
    window.HSStaticMethods.autoInit();

    this.subscription = this.sharedService.data$.subscribe(data => {
      if(data != null){
        if(data.key == 'titulo'){
          this.sharedService.setLoading(true);
        const dataArray = Array.isArray(data) ? data : [data.titulo];
        this.titulos = dataArray.map(item => ({
          ...item,
          visualizar:true
        }));
        this.sharedService.setLoading(false);
        }else if(data.key == 'punto'){
          this.sharedService.setLoading(true);
          this.getTitulosByPunto(data.punto);
        }

      }
    });

    if(this.buscar != null){

      this.scrollToTitle(this.buscar);
    }
  }

  titulos: any ;

  getTitulosByPunto(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.tituloCrudService.GetTitulosByPunto(encryptedID)
      .pipe(
        finalize(() => {
          // Código que se ejecuta siempre, independientemente de si hubo éxito o error
          this.sharedService.setLoading(false);
        })
      )
      .subscribe(
        (respuesta: any) => {
          const parsedData = JSON.parse(this.encodeService.decryptData(respuesta).resultado);
          /* Desencriptamos la respuesta que nos retorna el backend */
          this.titulos = Array.isArray(parsedData) ? parsedData.map(item => this.createTituloInstance(item)) : [this.createTituloInstance(parsedData)];
          this.sharedService.sendData(this.titulos[0]?.id_punto);
          window.HSStaticMethods.autoInit();

        },
        (error) => {
          // Manejo de errores si es necesario
          this.sharedService.updateErrorLoading(this.el, { message: 'articulo33' });

        }
      );
  }
  private createTituloInstance(data: any): Titulo {
    return Object.assign(new Titulo(), data);
  }

  scrollToTitle(texto: any) {
    setTimeout(() => {
      const headings = this.el.nativeElement.querySelectorAll('h2');
      headings.forEach((heading: HTMLElement) => {
        if (heading.textContent && heading.textContent.trim() === texto) {
          // Obtener las coordenadas del elemento
          const rect = heading.getBoundingClientRect();
          // Calcular la posición de scroll
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = rect.top + scrollTop;

          // Ajustar para el header fijo (ajusta este valor según tu diseño)
          const headerHeight = 60; // Por ejemplo, si tu header tiene 60px de alto

          // Calcular la posición final de scroll
          const targetScrollPosition = elementTop - headerHeight - 40; // 20px de margen adicional

          // Realizar el scroll
          window.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}
