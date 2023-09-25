<template>
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
</template>

<script setup>
import DevolutivosIcon from "components/icons/DevolutivosIcon.vue";
import { useProductosStore } from "src/stores/productosStore";
import { UseUtilsStore } from "src/stores/utilsStore";
import { ref } from "vue";
const devolutivoSearch = ref("");
const productosStore = useProductosStore();
const utilsStore = UseUtilsStore();
const emit = defineEmits(["productSelected"]);

function setDevolutivo(codigoBarras) {
  console.log(codigoBarras);
  const producto = productosStore.getConsumableByCodeBar(codigoBarras);
  console.log(producto);
  if (!producto) {
    utilsStore.notifyError("No encontramos el codigo de barras ingresado");
    return;
  }
  emit("productSelected", producto);

  devolutivoSearch.value = "";
}
</script>

<style lang="scss" scoped></style>
