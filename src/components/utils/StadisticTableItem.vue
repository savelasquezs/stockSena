<!-- Día de la documentación: 30/08/2023
Descripción del archivo "StadisticTableItem.vue":

Este archivo representa un componente reutilizable en Vue.js y Quasar diseñado para mostrar
estadísticas con título, valor y período en una aplicación.

=====================
Props:
-textColor: String,
-titulo: String,
-valor: String,
-periodo: String,
======================

Características clave:
- Utiliza el componente Quasar `<q-card-section>`
  para presentar las estadísticas en un formato limpio y atractivo.
  Este componente sirve como generador de items para el arachivo "StadisticTableBar.vue".
-->
<template>
  <!-- Sección de tarjeta Quasar que muestra estadísticas -->
  <q-card-section :class="textColor">
    <!-- Título de la estadística en tamaño grande y negrita -->
    <div class="text-h5" style="font-size: 1.1em; font-weight: bold">
      {{ titulo }}
    </div>
    <!-- Valor de la estadística en tamaño de subtítulo 2 -->
    <div class="text-subtitle2">{{ valor }}</div>
    <!-- Período de la estadística en tamaño de subtítulo 3 -->
    <div class="text-subtitle3">{{ periodo }}</div>
  </q-card-section>
</template>

<script setup>
// Importación y definición de props para el componente "stadisticTableItem.vue"
const props = defineProps({
  textColor: String,
  titulo: String,
  valor: String,
  periodo: String,
});
</script>

<style lang="scss" scoped></style>
