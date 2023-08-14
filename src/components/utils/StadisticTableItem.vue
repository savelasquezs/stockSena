<template>
  <q-card-section :class="textColor">
    <div class="text-h5" style="font-size: 1.1em; font-weight: bold">
      {{ titulo }}
    </div>
    <div class="text-subtitle2">{{ valor }}</div>
    <div class="text-subtitle3">{{ periodo }}</div>
  </q-card-section>
</template>

<script setup>
const props = defineProps({
  textColor: String,
  titulo: String,
  valor: String,
  periodo: String,
});
</script>

<style lang="scss" scoped></style>
