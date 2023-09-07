<template>
  <h3 class="text-h6 text-center">Ingresa un documento de identidad</h3>
  <q-input
    color="teal"
    filled
    v-model="documento"
    label="Documento"
    type="number"
    @change="buscarCliente"
  >
    <template v-slot:prepend>
      <q-icon name="person_search" />
    </template>
    <template v-slot:append>
      <q-btn icon="search" @click="buscarCliente" round />
    </template>
  </q-input>
</template>

<script setup>
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { ref } from "vue";

const prestamosStore = UsePrestamosStore();
const documento = ref("");
async function buscarCliente() {
  console.log(documento.value);
  await prestamosStore.getPrestamosByPerson(documento.value);
}
</script>

<style lang="scss" scoped></style>
