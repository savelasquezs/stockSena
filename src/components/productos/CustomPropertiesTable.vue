<template>
  <div class="shadow-3 q-pa-lg customProperties">
    <div
      class="flex justify-between"
      v-for="(property, index) in customProperties"
      :key="index"
    >
      <div class="text-subtitle3 text-weight-medium">{{ property[0] }}:</div>
      <div class="text-grey-7">{{ property[1] }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ producto: Object });
const customProperties = Object.entries(props.producto.custom);
</script>

<style scoped>
.customProperties {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 1fr 1fr;
  column-gap: 20px;
}
</style>
