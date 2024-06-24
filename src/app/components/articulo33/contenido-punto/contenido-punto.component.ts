import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
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
export class ContenidoPuntoComponent {
  @Input() title: string = 'Manual Gubernamental de Contabilidad (UTC)';
  @Input() punto: any;

  get shortTitle(): string {
    return this.title.length > 20 ? this.title.substring(0,20) + '...' : this.title;
  }

  constructor(
    public tituloCrudService: TituloscrudService,
    private encodeService: CryptoServiceService,
    public sharedService: SharedValuesService
  ){
    this.sharedService.setLoading(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.punto != undefined){
      if (changes['punto']) {
        const puntoChange: SimpleChange = changes['punto'];
        this.sharedService.setLoading(true);
        if(puntoChange.currentValue > 0){
        this.sharedService.setLoading(true);
          this.getTitulosByPunto(puntoChange.currentValue);
        }
      }
    }else{
      this.sharedService.setLoading(true);
    }
  }

  private subscription!: Subscription;
  ngOnInit(){
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
        },
        (error) => {
          // Manejo de errores si es necesario
          console.error("Error al obtener los títulos:", error);
        }
      );
  }
  private createTituloInstance(data: any): Titulo {
    return Object.assign(new Titulo(), data);
  }

  descripcion: string = 'El Manual Gubernamental de Contabilidad (UTC) es una guía exhaustiva destinada a estandarizar y mejorar los  procesos contables dentro de las entidades gubernamentales. Este manual establece un conjunto uniforme de principios, normas y procedimientos contables que deben seguir las instituciones públicas para garantizar la transparencia, eficiencia y precisión en la gestión financiera.';
}
