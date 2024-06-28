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
    const datosTransparencia = [
      {
        titulo_reporte: 'Informe de Presupuesto Anual',
        departamento: 'Finanzas',
        responsable: 'María González',
        fecha: '2024-06-23',
        hora: '14:30',
        privacidad: 0,
        descripcion: 'Reporte detallado del presupuesto anual de la institución, incluyendo ingresos, gastos y proyecciones para el próximo año fiscal.',
        tamano: 15728640, // 15 MB
        extension: 'pdf'
      },
      {
        titulo_reporte: 'Resultados Académicos Semestrales',
        departamento: 'Asuntos Académicos',
        responsable: 'Juan Pérez',
        fecha: '2024-06-22',
        hora: '10:15',
        privacidad: 1,
        descripcion: 'Análisis comprensivo de los resultados académicos del semestre, incluyendo estadísticas de rendimiento estudiantil, tasas de aprobación y áreas de mejora identificadas.',
        tamano: 20971520, // 20 MB
        extension: 'xlsx'
      },
      {
        titulo_reporte: 'Informe de Balance Trimestral',
        departamento: 'Contabilidad',
        responsable: 'Luis Martínez',
        fecha: '2024-06-25',
        hora: '09:00',
        privacidad: 0,
        descripcion: 'Informe detallado del balance trimestral de la empresa, incluyendo análisis de activos, pasivos y resultados financieros.',
        tamano: 10485760, // 10 MB
        extension: 'pdf'
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
              width: 80,
              height: 30,
              alignment: 'left' as const
            },
            {
              stack: [
                { text: 'Transparencia Institucional' as string, style: 'headerTitle' },
                { text: 'Sistema de Gestión de Informes' as string, style: 'headerSubtitle' },
              ],
              alignment: 'center' as const,
              margin: [0, 0, 0, 0] as [number, number, number, number],
              width: '*'
            },
            {
              stack: [
                { text: 'Fecha de emisión: ' as string + new Date().toLocaleDateString(), style: 'headerDate' },
                { text: 'Página ' as string + currentPage.toString() + ' de ' + pageCount.toString(), style: 'headerPage' },
              ],
              alignment: 'right' as const,
              width: 'auto'
            }
          ],
          margin: [20, 7, 20, 20] as [number, number, number, number]
        };
      },
      content: [
        { text: '\n\n' },
        { 
          text: 'Reporte de Transparencia Institucional' as string, 
          style: 'headerContent', 
          margin: [0, 10, 0, 10] as [number, number, number, number] 
        }, 
  
        // Tabla principal con información resumida
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: '#',                  style: 'tableHeader' },
                { text: 'Título del Reporte', style: 'tableHeader' },
                { text: 'Departamento',       style: 'tableHeader' },
                { text: 'Fecha y hora',       style: 'tableHeader' },
                { text: 'Privacidad',         style: 'tableHeader' },
              ],
              ...datosTransparencia.map((reporte, index) => [
                { text: (index + 1).toString(),                           style: 'cellContent', alignment: 'center' },
                { text: reporte.titulo_reporte,                           style: 'cellContent' },
                { text: reporte.departamento,                             style: 'cellContent' },
                { text: `${reporte.fecha} ${reporte.hora}`,               style: 'cellContent' },
                { text: reporte.privacidad === 0 ? 'Público' : 'Privado', style: 'cellContent' },
              ]),
            ],
          },
          layout: {
            hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 2 : 1,
            vLineWidth: () => 0,
            hLineColor: () => '#E7E6E6',
            fillColor: (rowIndex: number) => (rowIndex % 2 === 0) ? '#F2F2F2' : null,
            paddingTop: () => 5,
            paddingBottom: () => 5,
            // Evitar que las filas se dividan entre páginas
            dontBreakRows: true,
          },
          margin: [0, 10, 0, 20] as [number, number, number, number]  // Ajusta el margen superior e inferior según tus necesidades
        },
  
        // Detalles individuales de cada reporte
        ...datosTransparencia.map((reporte, index) => [
          {
            text: `Detalle del Reporte #${index + 1}` as string,
            style: 'subheader',
            margin: [0, 5, 0, 5] as [number, number, number, number] 
          },
          {
            table: {
              
              widths: ['30%', '70%'],
              body: [
                [{ text: 'Título',       style: 'tableHeader' }, { text: reporte.titulo_reporte,                           style: 'cellContent' }],
                [{ text: 'Departamento', style: 'tableHeader' }, { text: reporte.departamento,                             style: 'cellContent' }],
                [{ text: 'Responsable',  style: 'tableHeader' }, { text: reporte.responsable,                              style: 'cellContent' }],
                [{ text: 'Fecha y Hora', style: 'tableHeader' }, { text: `${reporte.fecha} ${reporte.hora}`,               style: 'cellContent' }],
                [{ text: 'Privacidad',   style: 'tableHeader' }, { text: reporte.privacidad === 0 ? 'Público' : 'Privado', style: 'cellContent' }],
                [{ text: 'Descripción',  style: 'tableHeader' }, { text: reporte.descripcion,                              style: 'cellContent' }],
                [{ text: 'Tamaño (MB)',  style: 'tableHeader' }, { text: (reporte.tamano / 1024 / 1024).toFixed(2),        style: 'cellContent' }],
                [{ text: 'Extensión',    style: 'tableHeader' }, { text: reporte.extension,                                style: 'cellContent' }],
              ]
            },
            layout: {
              hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 2 : 1,
              vLineWidth: () => 0,
              hLineColor: () => '#E7E6E6',
              fillColor: (rowIndex: number) => (rowIndex % 2 === 0) ? '#F2F2F2' : null,
              paddingTop: () => 5,
              paddingBottom: () => 5,
              // Evitar que las filas se dividan entre páginas
              dontBreakRows: true,
            },
            margin: [0, 0, 0, 20] as [number, number, number, number] 
          }
        ]).flat(),
      ],
      styles: {
        headerTitle: {
          fontSize: 14,
          bold: true,
          color: '#8C8888',
          alignment: 'center' as const,
          margin: [0, 0, 0, 0] as [number, number, number, number] 
        },
        headerSubtitle: {
          fontSize: 10,
          color: '#8C8888',
          alignment: 'center' as const,
          margin: [0, 0, 0, 0] as [number, number, number, number] 
        },
        headerDate: {
          fontSize: 8,
          color: '#8C8888',
        },
        headerPage: {
          fontSize: 8,
          color: '#8C8888',
        },
        headerContent: {
          fontSize: 18,
          bold: true,
          color: '#8C8888',
          alignment: 'center' as const,
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'white',
          fillColor: '#00796B'
        },
        cellContent: {
          fontSize: 10,
          lineHeight: 1.2,
          color: '#333333',
        },
        subheader: {
          fontSize: 14,
          bold: true,
          color: '#00796B',
          margin: [0, 15, 0, 5] as [number, number, number, number] 
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
  
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D context of canvas.'));
          return;
        }
  
        ctx.drawImage(img, 0, 0);
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