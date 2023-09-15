<template>
  <div>DevolverPrestamo</div>
  <InputClienteSearch v-if="!cliente.nombre" />
  <div v-else>
    <PersonalInfo />
    <TablaActivos @devuelto="$emit('devuelto')" />
  </div>
</template>

<script setup>
import InputClienteSearch from "components/prestamos/InputClienteSearch.vue";
import PersonalInfo from "components/clientes/PersonalInfo.vue";
import TablaActivos from "components/clientes/TablaActivos.vue";
import { computed, onBeforeUnmount, ref } from "vue";
import { UsePrestamosStore } from "src/stores/prestamosStore";
const emit = defineEmits(["devuelto"]);
const prestamosStore = UsePrestamosStore();
const cliente = computed(() => {
  console.log(prestamosStore.currentCustomer);
  return prestamosStore.currentCustomer;
});

onBeforeUnmount(() => {
  prestamosStore.resetCurrentCustomer();
});
</script>

<style lang="scss" scoped></style>
