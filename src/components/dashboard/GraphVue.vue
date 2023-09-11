<!-- Día de la documentación: 06/09/2023
Descripción del archivo "GraphVue.vue":

Este archivo representa un componente de una aplicación Vue.js diseñado para mostrar una gráfica polar utilizando la biblioteca "Chart.js".
El componente contiene un lienzo (canvas) en el que se dibuja la gráfica polar con datos predeterminados.

Características clave:
- Muestra una gráfica polar en un componente.
- Utiliza la biblioteca "Chart.js" para renderizar la gráfica.
- La gráfica polar tiene segmentos con etiquetas y colores personalizados.

Props recibidos:
- idCanvas: Identificador único para el elemento canvas donde se renderiza la gráfica polar.

Eventos emitidos:
- Ninguno

Uso:
- Este componente se utiliza para mostrar una gráfica polar con datos.

-->
<template>
  <!-- Elemento canvas donde se renderiza la gráfica polar -->
  <div>
    <canvas :id="idCanvas"></canvas>
  </div>
</template>

<script setup>
// Importaciones necesarias
import Chart from "chart.js/auto";
import { onMounted } from "vue";

// Declaración de los props
const props = defineProps(["idCanvas"]);

// Función que se ejecuta cuando el componente se ha montado
onMounted(() => {
  // Obtiene el contexto del elemento canvas utilizando el id proporcionado
  const ctx = document.getElementById(props.idCanvas);

  // Crea una nueva instancia de Chart.js y configura una gráfica polar
  new Chart(ctx, {
    type: "polarArea", // Tipo de gráfica: polarArea
    data: {
      labels: ["Morosos", "Verde", "Amarillo", "Gris", "Azul"], // Etiquetas para los segmentos
      datasets: [
        {
          label: "Mi primer dataset", // Leyenda para el conjunto de datos
          data: [11, 16, 7, 3, 14], // Valores para el conjunto de datos
          backgroundColor: [
            // Colores de fondo para los segmentos
            "rgba(255, 99, 132, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(255, 205, 86, 0.5)",
            "rgba(201, 203, 207, 0.5)",
            "rgba(54, 162, 235, 0.5)",
          ],
          borderColor: [
            // Colores de borde para los segmentos
            "rgb(255, 99, 132)",
            "rgb(75, 192, 192)",
            "rgb(255, 205, 86)",
            "rgb(201, 203, 207)",
            "rgb(54, 162, 235)",
          ],
          borderWidth: 1, // Ancho del borde para los segmentos
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Morosos por mes", // Título de la gráfica
        },
        legend: {
          display: true,
          position: "bottom", // Posición de la leyenda
        },
      },
    },
  });
});
</script>
