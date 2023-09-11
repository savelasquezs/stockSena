<template>
  <InputClientesSearch busquedaCustom v-if="!cliente.nombre" />
  <div v-else>
    <div class="flex items-center justify-evenly">
      <q-icon size="50px">
        <Departure />
      </q-icon>
      <span>Desde:</span>
      <PersonalInfo />
    </div>
    <div class="flex items-center justify-evenly">
      <q-icon size="50px">
        <Destination />
      </q-icon>
      <span>Hacia:</span>
      <PersonalInfo busquedaCustom />
    </div>
  </div>
</template>

<script setup>
import InputClientesSearch from "components/prestamos/InputClienteSearch.vue";
import PersonalInfo from "components/clientes/PersonalInfo.vue";
import Destination from "components/icons/Destination.vue";
import Departure from "components/icons/Departure.vue";
import { UseClientesStore } from "src/stores/clientesStore";
import { computed } from "vue";
const clientesStore = UseClientesStore();
const cliente = computed(() => {
  return clientesStore.currentCustomer;
});
</script>

<style lang="scss" scoped></style>
