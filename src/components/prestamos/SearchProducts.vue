<template>
  <div class="flex justify-evenly q-ma-md shadow-1 q-pa-md">
    <SearchProductoDevolutivo
      @productSelected="(producto) => $emit('productSelected', producto)"
      titulo="Buscar producto Devolutivo"
    />
    <q-separator vertical />
    <div>
      <q-item>
        <q-item-section avatar>
          <q-icon color="accent" size="3rem">
            <ConsumiblesIcon />
          </q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label>Buscar producto Consumible</q-item-label>
        </q-item-section>
      </q-item>
      <AutocompleteInput
        hint="Busca el nombre del producto"
        :stringOptions="productosStore.nameColumnsConsumibles"
        @cambioModel="setConsumible"
        v-model="consumibleSelected"
      />
    </div>
  </div>
</template>

<script setup>
import ConsumiblesIcon from "components/icons/ConsumiblesIcon.vue";
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import { useQuasar } from "quasar";
import { useProductosStore } from "src/stores/productosStore";
import { ref } from "vue";
import SearchProductoDevolutivo from "components/prestamos/searchProductoDevolutivo.vue";
const consumibleSelected = ref("");

const productosStore = useProductosStore();
const emit = defineEmits(["productSelected"]);
const $q = useQuasar();
function notifyProduct(message) {
  $q.notify({
    type: "negative",
    message,
    position: "center",
    timeout: 1500,
  });
}
function setConsumible(nombreProducto) {
  const producto = productosStore.getConsumableByName(nombreProducto);
  emit("productSelected", producto);
}
</script>

<style lang="scss" scoped></style>
