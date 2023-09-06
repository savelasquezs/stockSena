<!-- Día de la documentación: 06/09/2023
Descripción del archivo "pruebaVue.vue":

Este archivo representa un componente Vue.js diseñado para mostrar un gráfico de barras y líneas utilizando la biblioteca "Chart.js".
El componente renderiza un lienzo de gráfico en el cual se representa una combinación de datos en forma de barras y líneas para diferentes meses.

Características clave:
- Utiliza la biblioteca "Chart.js" para representar datos en un gráfico interactivo.
- Muestra datos para diferentes meses en forma de barras y líneas.
- Proporciona una leyenda para describir los conjuntos de datos representados.

Props recibidos:
- idCanvas: Un identificador único para el elemento canvas donde se renderizará el gráfico.

Eventos emitidos:
- Ninguno

Uso:
- Este componente se utiliza para visualizar datos en forma de gráfico de barras y líneas en una página o vista de la aplicación.
-->
<template>
  <!-- Elemento contenedor para el gráfico -->
  <div class="flex flex-center">
    <!-- Lienzo (canvas) donde se renderizará el gráfico -->
    <canvas :id="idCanvas"></canvas>
  </div>
</template>

<script setup>
// Importaciones
import Chart from "chart.js/auto";
import { onMounted, defineProps } from "vue";

// Propiedades recibidas como argumento
const props = defineProps(["idCanvas"]);

// Datos del gráfico
const planetChartData = {
  type: "bar",
  data: {
    labels: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    datasets: [
      {
        type: "bar",
        label: "Morosos Barra",
        data: [0, 0, 1, 2, 79, 82, 27, 14],
        backgroundColor: "rgba(54,73,93,.5)",
        borderColor: "#36495d",
        borderWidth: 3,
      },
      {
        type: "line",
        label: "Morosos Linea",
        data: [0, 0, 1, 2, 79, 82, 27, 14],
        backgroundColor: "rgba(54,73,93,.5)",
        borderColor: "#36495d",
        borderWidth: 3,
      },
      {
        type: "bar",
        label: "No morosos",
        data: [0.166, 2.081, 3.003, 0.323, 54.792, 85.886, 43.662, 51.514],
        backgroundColor: "rgba(71, 183,132,.5)",
        borderColor: "#47b784",
        borderWidth: 3,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Morosos por mes",
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
  },
};
// Función que se ejecuta después de que el componente se monta
onMounted(() => {
  const ctx = document.getElementById(props.idCanvas);
  new Chart(ctx, planetChartData);
});
</script>
