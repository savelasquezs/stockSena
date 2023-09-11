<template>
  <div class="flex justify-evenly q-ma-md shadow-1 q-pa-md">
    <div>
      <q-item>
        <q-item-section avatar>
          <q-icon color="accent" size="3rem">
            <DevolutivosIcon />
          </q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label>Prestar producto Devolutivo</q-item-label>
        </q-item-section>
      </q-item>
      <q-input
        bottom-slots
        v-model="devolutivoSearch"
        label="Codigo de barras"
        counter
        @change="setDevolutivo"
      >
        <template v-slot:append>
          <q-icon
            name="close"
            @click="devolutivoSearch = ''"
            class="cursor-pointer"
          />
        </template>

        <template v-slot:hint>
          <span> Codigo de barras producto devolutivo </span>
        </template>
      </q-input>
    </div>
    <q-separator vertical />
    <div>
      <q-item>
        <q-item-section avatar>
          <q-icon color="accent" size="3rem">
            <ConsumiblesIcon />
          </q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label>Prestar producto Consumible</q-item-label>
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
import DevolutivosIcon from "components/icons/DevolutivosIcon.vue";
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import { useQuasar } from "quasar";
import { useProductosStore } from "src/stores/productosStore";
import { ref } from "vue";
const consumibleSelected = ref("");
const devolutivoSearch = ref("");
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

function setDevolutivo(codigoBarras) {
  const producto = productosStore.getConsumableByCodeBar(codigoBarras);
  if (!producto) {
    notifyProduct("No encontramos el codigo de barras ingresado");
    return;
  }
  emit("productSelected", producto);

  devolutivoSearch.value = "";
}
</script>

<style lang="scss" scoped></style>
