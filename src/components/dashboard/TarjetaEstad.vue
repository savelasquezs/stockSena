<!-- Día de la documentación: 06/09/2023
Descripción del archivo "tarjetasEst.vue":

Este archivo representa un componente Vue.js que muestra una tarjeta estilizada con un icono, un título y un subtítulo.
Es una tarjeta de estilo simple que se utiliza comúnmente para mostrar información en una interfaz de usuario.

Características clave:
- Muestra un icono, un título y un subtítulo.
- El icono y los colores de texto son personalizables mediante props.
- Diseño de tarjeta limpio y estilizado.

Props recibidos:
- `titulo` (String): El título que se muestra en la tarjeta.
- `subtitulo` (String): El subtítulo que se muestra en la tarjeta.
- `icono` (String): El nombre del icono que se muestra en la tarjeta (deben ser iconos válidos según Quasar Framework).
- `iconColor` (String): El color del icono.

Eventos emitidos:
- Ninguno

Uso:
- Este componente se utiliza en la interfaz de usuario para mostrar información de manera clara y estilizada, como parte de un diseño de tarjeta.
- Los props personalizables permiten que los datos y la apariencia de la tarjeta se adapten a las necesidades de la aplicación.
-->
<template>
  <!-- Tarjeta estilizada con título, subtítulo e icono -->
  <q-card class="my-card">
    <!-- Icono en el centro de la tarjeta -->
    <q-card-section class="tarjeta">
      <div class="flex justify-center q-mb-lg">
        <q-icon :name="icono" size="24px" :color="iconColor"></q-icon>
      </div>
      <!-- Sección de texto con título y subtítulo -->
      <div class="flex justify-between items-center text-grey">
        <div class="text-h6 text-grey-8">{{ titulo }}</div>
        <div class="text-subtitle2 align-center">{{ subtitulo }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
// Props para personalizar el contenido y el estilo de la tarjeta
const props = defineProps({
  titulo: String,
  subtitulo: String,
  icono: String,
  iconColor: String,
});
</script>

<style lang="scss" scoped></style>
