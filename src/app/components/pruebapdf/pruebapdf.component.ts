import { Component, OnInit, AfterViewInit  } from '@angular/core';
import ApexCharts from 'apexcharts';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { TDocumentDefinitions } from 'pdfmake/interfaces';




@Component({
  selector: 'app-pruebapdf',
  templateUrl: './pruebapdf.component.html',
  styleUrls: ['./pruebapdf.component.css']
})
export class PruebapdfComponent {
  constructor() {}

  async imprimirReporte(): Promise<void> {
    const datosVideos = [
      {
        titulo_video: 'Buen taquillo',
        num_vistas: 'enrique segoviano',
        nombre_canal: 'Masomenos',
        fecha: '2024-06-23',
        hora: '14:30',
        privacidad: 0,
        descripcion: 'Un desastre culinario que parece haber sido hecho con los ingredientes equivocados y sin ningún cuidado, como si alguien hubiera intentado hacer un taco pero terminó siendo un desastre total.',
        peso: 15728640, // 15 MB
        extension: 'mp4'
      },
      {
        titulo_video: 'Taquillo masomenos',
        num_vistas: 'Calle hidalgo',
        nombre_canal: 'Dos tres',
        fecha: '2024-06-22',
        hora: '10:15',
        privacidad: 1,
        descripcion: 'Una expresión informal que denota algo que está muy mal hecho, decepcionante o inútil, como un trabajo mal ejecutado o una situación desfavorable que causa molestia o frustración.Una expresión informal que denota algo que está muy mal hecho, decepcionante o inútil, como un trabajo mal ejecutado o una situación desfavorable que causa molestia o frustración.',
        peso: 20971520, // 20 MB
        extension: 'avi'
      },
    ];
      // Convertir la imagen a dataURL
      const logoDataURL = await this.getImageDataURL('assets/img/utc.jpeg');
      

    const documentDefinition = {
      
      header: (currentPage: number, pageCount: number) => {
        return {
          columns: [
            {
              image: logoDataURL,
              width: 100,
              height: 40,
              alignment: 'left' as const
            },
            {
              stack: [
                { text: 'Resumen', style: 'headerTitle' },
                { text: 'Sistema de la chingada', style: 'headerSubtitle' },
              ],
              alignment: 'center' as const,
            },
            {
              stack: [
                { text: 'Fecha de emisión: ' + new Date().toLocaleDateString(), style: 'headerDate' },
                { text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(), style: 'headerPage' },
              ],
              alignment: 'right' as const,
              width: 'auto'
            }
          ],
          margin: [20, 10, 20, 20] as [number, number, number, number]
        };
      },
      content: [
        { text: '\n\n' },
        { 
          text: 'Reporte de tacos de cagada' as string, 
          style: 'headerContent', 
          margin: [0, 40, 0, 20] as [number, number, number, number] 
        },
    
        // Primera tabla: Datos generales de los videos
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: '#', style: 'tableHeader', fillColor: '#dddddd' },
                { text: 'Título del taco', style: 'tableHeader', fillColor: '#dddddd' },
                { text: 'Direccion del taco', style: 'tableHeader', fillColor: '#dddddd' },
                { text: 'Cagada', style: 'tableHeader', fillColor: '#dddddd' },
                { text: 'Fecha del taco', style: 'tableHeader', fillColor: '#dddddd' },
                { text: 'Hora del taco', style: 'tableHeader', fillColor: '#dddddd' },
                { text: 'Privacidad', style: 'tableHeader', fillColor: '#dddddd' },
              ],
              ...datosVideos.map((video, index) => [
                { text: (index + 1).toString(), style: 'cellDescription', alignment: 'center', fillColor: index % 2 === 0 ? '#f2f2f2' : null },
                { text: video.titulo_video, style: 'cellDescription', fillColor: index % 2 === 0 ? '#f2f2f2' : null },
                { text: video.num_vistas.toString(), style: 'cellDescription', fillColor: index % 2 === 0 ? '#f2f2f2' : null },
                { text: video.nombre_canal, style: 'cellDescription', fillColor: index % 2 === 0 ? '#f2f2f2' : null },
                { text: video.fecha, style: 'cellDescription', fillColor: index % 2 === 0 ? '#f2f2f2' : null },
                { text: video.hora, style: 'cellDescription', fillColor: index % 2 === 0 ? '#f2f2f2' : null },
                { text: video.privacidad === 0 ? 'Público' : 'Privado', style: 'cellDescription', fillColor: index % 2 === 0 ? '#f2f2f2' : null },
              ]),
            ],
          },
          margin: [0, 0, 0, 30] as [number, number, number, number]
        },
    
        // Segunda tabla: Detalles adicionales de los videos
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto'],
            body: [
              [
                { text: '#', style: 'tableHeader', fillColor: '#dddddd' },
                { text: 'Descripción', style: 'tableHeader', fillColor: '#dddddd' },
                { text: 'Peso (KG)', style: 'tableHeader', fillColor: '#dddddd' },
                { text: 'Extensión', style: 'tableHeader', fillColor: '#dddddd' },
              ],
              ...datosVideos.map((video, index) => [
                { text: (index + 1).toString(), style: 'cellDescription', alignment: 'center', fillColor: index % 2 === 0 ? '#f2f2f2' : null },
                { text: video.descripcion, style: 'cellDescription', fillColor: index % 2 === 0 ? '#f2f2f2' : null },
                { text: (video.peso / 1024 / 1024).toFixed(2), style: 'cellDescription', fillColor: index % 2 === 0 ? '#f2f2f2' : null },
                { text: video.extension, style: 'cellDescription', fillColor: index % 2 === 0 ? '#f2f2f2' : null },
              ]),
            ],
          },
        },
      ],
      styles: {
        headerTitle: {
          fontSize: 15,
          bold: true,
          color: '#8C8888',
          margin: [70, 0, 0, 0] as [number, number, number, number] 
        },
        headerSubtitle: {
          fontSize: 10,  // Aumenta este número para hacer la fuente más grande
          bold: true,
          color: '#8C8888',
          margin: [70, 0, 0, 0] as [number, number, number, number] 
        },
        headerDate: {
          fontSize: 8,
          bold: true,
          color: '#8C8888',
        },
        headerPage: {
          fontSize: 8,  // Aumenta este número para hacer la fuente más grande
          bold: true,
          color: '#8C8888',
        },
        headerContent: {
          fontSize: 18,
          bold: true,
          alignment: 'center' as const,
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          fillColor: '#dddddd'
        },
        cellDescription: {
          fontSize: 10,
          lineHeight: 1.2,
        },
      },
    };
    
    
    
  
    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.open();

  }

  private async getImageDataURL(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Obtener el contexto 2D del canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D context of canvas.'));
          return;
        }
  
        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0);
  
        // Obtener el dataURL de la imagen
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = url;
    });
  }
  
  
  



//pa la grafica
  private chartInstance: ApexCharts | null = null;
  ngAfterViewInit(): void {
    const chartElement = document.querySelector("#chart");
    if (chartElement) {
      const options = {
        chart: {
          type: 'donut',
          height: 550,
          width: '100%'
        },
        series: [44, 55, 41, 17, 15],
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 90,
            offsetY: 10,
            donut: {
              size: '70%'
            }
          }
        },
        legend: {
          position: 'bottom'
        }
      };
      this.chartInstance = new ApexCharts(chartElement, options);
      this.chartInstance.render();
    } else {
      console.error("Element not found: #chart");
    }
  }



//pa imprimir la grafica
  async generatePDF() {
    if (!this.chartInstance) {
      console.error('Chart not initialized');
      return;
    }
  
    try {
      // Definir un tamaño fijo para el gráfico en puntos (1 pulgada = 72 puntos)
      const chartWidthPt = 400; // Aproximadamente 5.5 pulgadas
  
      // Generar una imagen del gráfico con ancho fijo y escala aumentada
      const chartImageResult = await this.chartInstance.dataURI({
        width: chartWidthPt,
        scale: 2 // Aumenta la escala para mejor calidad
      });
  
      let chartImageURI: string;
      if ('imgURI' in chartImageResult) {
        chartImageURI = chartImageResult.imgURI;
      } else if ('blob' in chartImageResult) {
        chartImageURI = await this.blobToDataURL(chartImageResult.blob);
      } else {
        throw new Error('Unexpected result from dataURI()');
      }
  
      // Definir el documento PDF con tamaño fijo
      const docDefinition: TDocumentDefinitions = {
        pageSize: { width: 595.28, height: 841.89 }, // A4 en puntos
        pageOrientation: 'portrait',
        pageMargins: [50, 50, 50, 50], // Márgenes en puntos
        content: [
          { text: 'Gráfico de Dona', style: 'header' },
          {
            image: chartImageURI,
            width: chartWidthPt,
            alignment: 'center'
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 20]
          }
        }
      };
  
      // Generar y descargar el PDF
      const pdf = pdfMake.createPdf(docDefinition);
      pdf.open();

    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
  
  private blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
 


}

