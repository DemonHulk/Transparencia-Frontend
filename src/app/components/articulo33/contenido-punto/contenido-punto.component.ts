import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { TituloscrudService } from '../../../services/crud/tituloscrud.service';
import { CryptoServiceService } from '../../../services/cryptoService/crypto-service.service';
import { SharedValuesService } from '../../../services/shared-values.service';

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
    private sharedService: SharedValuesService
  ){

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['punto']) {
      const puntoChange: SimpleChange = changes['punto'];
      console.log('Punto cambiado:', puntoChange.currentValue);

      if(puntoChange.currentValue > 0){
        this.getTitulosByPunto(puntoChange.currentValue);
      }
    }
  }

  titulos: any ;

  getTitulosByPunto(id: any) {
    const encryptedID = this.encodeService.encryptData(JSON.stringify(id));
    this.tituloCrudService.GetTitulosByPunto(encryptedID).subscribe((respuesta: any) => {
      /* Desencriptamos la respuesta que nos retorna el backend */
      this.titulos = JSON.parse(this.encodeService.decryptData(respuesta).resultado);
      //Indicar que todos los datos se han cargado
      setTimeout(() => {
        this.sharedService.setLoading(false);
        console.log(this.titulos);
        window.HSStaticMethods.autoInit();
      }, 500);
    });
  }

  descripcion: string = 'El Manual Gubernamental de Contabilidad (UTC) es una guía exhaustiva destinada a estandarizar y mejorar los  procesos contables dentro de las entidades gubernamentales. Este manual establece un conjunto uniforme de principios, normas y procedimientos contables que deben seguir las instituciones públicas para garantizar la transparencia, eficiencia y precisión en la gestión financiera.';
}
