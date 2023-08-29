<template>
  <div style="background-color: #f5f5f5"></div>
  <!-- Informacion de productos -->
  <div
    class="q-pa-md row items-start q-gutter-md"
    style="display: flex; justify-content: center"
  >
    <q-card class="my-card">
      <q-card-section
        class="bg- text-black"
        style="display: flex; flex-direction: column"
      >
        <div class="text-h5"><strong>Información del Producto</strong></div>
        <div class="flex">
          <div class="text-subtitle" style="flex: 1; margin: 8px">
            Nombre: {{ product.nombre }}
          </div>
          <div class="text-subtitle3" style="text-align: right; margin: 8px">
            Consumible: {{ product.isConsumable ? "Si" : "No" }}
          </div>
        </div>
        <div class="flex">
          <div class="text-subtitle4" style="flex: 1; margin: 8px">
            Procesador: Core ¡5
          </div>
          <div class="text-subtitle5" style="text-align: right; margin: 8px">
            Estado: Prestado
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
  <div
    class="q-pa-md row items-center q-gutter-md"
    style="display: flex; justify-content: center"
  >
    <q-card class="my-card">
      <q-card-section class="bg-white text-orange">
        <div class="text-h5">Veces Prestadas</div>
        <div class="text-subtitle text-black">
          {{ prestamosStore.allBorrowingsProducts.length }}
        </div>
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section class="bg-white text-black">
        <div class="text-h5">Einer Pino Cabrera</div>
        <div class="text-subtitle2 text-black">{{ vecesPrestada }}</div>
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section class="bg-white text-black">
        <div class="text-h5">Joan y Jose Zap</div>
        <div class="text-subtitle text-black">6</div>
      </q-card-section>
    </q-card>
  </div>

  <SimpleTable
    :rows="prestamosStore.allBorrowingsProducts"
    :columns="productosStore.columnasDetalleProducto"
  />
</template>
<script setup>
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { useProductosStore } from "src/stores/productosStore";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import SimpleTable from "components/utils/SimpleTable.vue";
const props = defineProps(["id"]);
const route = useRoute();
const productoId = ref(route.params.id);

const prestamosStore = UsePrestamosStore();
const productosStore = useProductosStore();

const product = productosStore.productosDatabase.find(
  (producto) => producto.docId == productoId.value
);

const vecesPrestada = computed(() => {
  return prestamosStore.allBorrowingsProducts.reduce(
    (a, b) => a + parseInt(b.cantidadPrestada),
    0
  );
});

onMounted(async () => {
  await prestamosStore.getPrestamosByProduct(productoId.value);
});

watch(
  () => route.params.id,
  async (toId, fromId) => {
    productoId.value = toId;
    await prestamosStore.getPrestamosByProduct(productoId.value);
  }
);
</script>
