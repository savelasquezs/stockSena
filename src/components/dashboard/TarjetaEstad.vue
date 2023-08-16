<template>
  <q-card class="my-card">
    <q-card-section class="tarjeta">
      <div class="flex justify-center q-mb-lg">
        <q-icon :name="icono" size="24px" :color="iconColor"></q-icon>
      </div>
      <div class="flex justify-between items-center text-grey">
        <div class="text-h6 text-grey-8">{{ titulo }}</div>
        <div class="text-subtitle2 align-center">{{ subtitulo }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  titulo: String,
  subtitulo: String,
  icono: String,
  iconColor: String,
});
</script>

<style lang="scss" scoped></style>
