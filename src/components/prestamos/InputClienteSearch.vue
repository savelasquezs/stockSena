<template>
  <h3 class="text-h6 text-center">Ingresa un documento de identidad</h3>
  <q-input
    color="teal"
    filled
    v-model="documento"
    label="Documento"
    type="number"
    @change="
      busquedaCustom ? buscarClienteTraspaso() : buscarClientePrestamos()
    "
  >
    <template v-slot:prepend>
      <q-icon name="person_search" />
    </template>
    <template v-slot:append>
      <q-btn icon="search" round />
    </template>
  </q-input>
</template>

<script setup>
import { UseClientesStore } from "src/stores/clientesStore";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { ref } from "vue";

const props = defineProps({ busquedaCustom: Boolean });

const prestamosStore = UsePrestamosStore();
const clientesStore = UseClientesStore();
const documento = ref("");
async function buscarClientePrestamos() {
  console.log(documento.value);
  await prestamosStore.getPrestamosByPerson(documento.value);
}

function buscarClienteTraspaso() {
  clientesStore.getCurrentCliente(documento.value);
}
</script>

<style lang="scss" scoped></style>
