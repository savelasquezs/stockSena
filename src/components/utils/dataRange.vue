<template>
  <div class="q-pa-md">
    <q-date v-model="c_date" range />
  </div>
</template>
<script setup>
import { ref } from "vue";

//Fecha
const c_date = ref({ from: "2020/07/08", to: "2020/07/17" });
</script>
