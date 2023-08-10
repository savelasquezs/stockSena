<template>
  <h3>canvas</h3>
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
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
</script>
