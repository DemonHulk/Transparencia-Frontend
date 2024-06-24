// hs-apexcharts-helpers.js
(function() {
    window.hsApexCharts = {
      init: function(options) {
        // Código para inicializar gráficos con opciones específicas
        this.charts = [];
        this.createChart(options);
      },
      
      createChart: function(options) {
        const defaultOptions = {
          chart: {
            type: 'line', // Tipo de gráfico por defecto
            height: 350
          },
          series: [],
          xaxis: {
            categories: []
          }
        };
  
        const finalOptions = Object.assign({}, defaultOptions, options);
        const chart = new ApexCharts(document.querySelector(finalOptions.chart.selector), finalOptions);
        chart.render();
        this.charts.push(chart);
      }
    };
  
    // Ejemplo de inicialización al cargar el documento
    document.addEventListener('DOMContentLoaded', function() {
      if (window.hsApexChartsInit) {
        window.hsApexCharts.init(window.hsApexChartsInit);
      }
    });
  })();
  