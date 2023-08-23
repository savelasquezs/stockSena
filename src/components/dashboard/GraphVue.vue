<template>
  <div>
    <canvas :id="idCanvas"></canvas>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import { onMounted } from "vue";

const props = defineProps(["idCanvas"]);

onMounted(() => {
  const ctx = document.getElementById(props.idCanvas);

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
          text: "Morosos por mes",
        },
        legend: {
          display: true,
          position: "bottom",
        },
      },
    },
  });
});
</script>
