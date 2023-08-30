<template>
  <div class="flex flex-center">
    <canvas :id="idCanvas"></canvas>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";
import { onMounted, defineProps } from "vue";

const props = defineProps(["idCanvas"]);

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

onMounted(() => {
  const ctx = document.getElementById(props.idCanvas);
  new Chart(ctx, planetChartData);
});
</script>
