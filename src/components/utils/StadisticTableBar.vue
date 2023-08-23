<template>
  <div class="flex justify-center">
    <q-item clickable to="/">
      <q-img
        src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png"
        loading="lazy"
        spinner-color="white"
        width="100px"
        class=""
      />
      <StadisticTableItem
        v-for="stadistic in stadisticTableBarInfo"
        :key="stadistic.titulo"
        :textColor="stadistic.text_color"
        :titulo="stadistic.titulo"
        :valor="stadistic.valor"
        :periodo="stadistic.periodo"
      />
    </q-item>
  </div>
</template>

<script setup>
import StadisticTableItem from "./StadisticTableItem.vue";
const props = defineProps(["stadisticTableBarInfo"]);
</script>

<style lang="scss" scoped></style>
