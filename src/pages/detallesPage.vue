<!-- Fecha Documentacion 5/09/2023 -->
<!-- Este componente muestra información detallada sobre un producto y se asegura de que 
  los datos se actualicen automáticamente cuando cambias el producto seleccionado a través
  de la ruta. Esto se logra mediante la observación de la ruta y la interacción con las 
  tiendas Vuex que contienen los datos relacionados con productos y préstamos. -->
<template>
  {{ product }}
  {{ id }}
  <div style="background-color: #f5f5f5"></div>
  <!-- Informacion de productos -->
  <div
    class="q-pa-md row items-start q-gutter-md"
    style="display: flex; justify-content: center"
  >
    <q-card class="my-card">
      <q-card-section
        class="bg-accent text-white"
        style="display: flex; flex-direction: column"
      >
        <div class="text-h5">
          <strong>{{ product.nombre }}</strong>
        </div>
        <div class="flex justify-between">
          <div class="text-subtitle3">
            <q-icon name="inventory_2" color="primary" size="20px" />
            Stock Total:
          </div>
          <div>
            {{ product.stockTotal }}
          </div>
        </div>
        <div class="flex justify-between">
          <div class="text-subtitle3">
            <q-icon name="lunch_dining" color="primary" size="20px" />
            Consumible:
          </div>
          <div>{{ product.isConsumable ? "Si" : "No" }}</div>
        </div>
      </div>

      <div class="derecha">
        <div class="flex justify-between">
          <div class="text-subtitle3">
            <q-icon name="event_available" color="primary" size="20px" />
            Stock Disponible :
          </div>
          <div>{{ product.stockTotal - product.borrowedQuantity }}</div>
        </div>
        <div class="flex justify-between">
          <div class="text-subtitle3">
            <q-icon name="event_busy" color="primary" size="20px" />
            Stock Prestamo:
          </div>
          <div>{{ product.borrowedQuantity }}</div>
        </div>
      </div>
    </div>
    <div class="shadow-3 q-pa-lg customProperties" v-if="!product.isConsumable">
      <div
        class="flex justify-between"
        v-for="(property, index) in customProperties"
        :key="index"
      >
        <div class="text-subtitle3">{{ property[0] }}:</div>
        <div>{{ property[1] }}</div>
      </div>
    </div>
  </div>

  <div
    class="q-pa-md row items-center q-gutter-md"
    style="display: flex; justify-content: center"
  >
    <q-card class="my-card">
      <q-card-section class="bg-white text-black">
        <div class="text-h5">Veces Prestadas</div>
        <div class="text-subtitle text-green">
          {{ prestamosStore.allBorrowingsProducts.length }}
        </div>
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section class="bg-brown-5 text-black">
        <div class="text-h5">Cantidad En Prestamo</div>
        <div class="text-subtitle2 text-black">{{ vecesPrestada }}</div>
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section class="bg-light-green text-black">
        <div class="text-h5">Cantidad en Almacén</div>
        <div class="text-subtitle text-black">6</div>
      </q-card-section>
    </q-card>
  </div>
  <!-- Implementación de componente el cual toma las filas y columnas. -->
  <SimpleTable
    :rows="prestamosStore.allBorrowingsProducts"
    :columns="productosStore.columnasDetalleProducto"
    @viendo="verDetalles"
    customDetail
  />
</template>
<!-- Importa las tiendas Vuex UsePrestamosStore y useProductosStore que proporcionan
  acceso a los datos relacionados con préstamos y productos. -->
<script setup>
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { useProductosStore } from "src/stores/productosStore";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import SimpleTable from "components/utils/SimpleTable.vue";
const props = defineProps(["id"]);
const route = useRoute();
const productoId = ref(route.params.id);
const product = ref({});

const prestamosStore = UsePrestamosStore();
const productosStore = useProductosStore();
async function ejecutarInicio() {
  await prestamosStore.getPrestamosByProduct(productoId.value);
  product.value = productosStore.productosDatabase.find(
    (producto) => producto.docId == productoId.value
  );
  if (!product.value.isConsumable) {
    customProperties.value = Object.entries(product.value.custom);
  }
}
ejecutarInicio();
// Se utiliza una propiedad computada vecesPrestada para calcular la cantidad total de
// veces que se ha prestado el producto. Esto se hace sumando la propiedad cantidadPrestada
// de cada préstamo en
const vecesPrestada = computed(() => {
  return prestamosStore.allBorrowingsProducts.reduce(
    (a, b) => a + parseInt(b.cantidadPrestada),
    0
  );
});
// Se utiliza watch para observar cambios en la ruta y actualizar los datos del producto y
// los préstamos cuando cambia el id del producto en la ruta.
watch(
  () => route.params.id,
  async (toId, fromId) => {
    productoId.value = toId;
    await prestamosStore.getPrestamosByProduct(productoId.value);
  }
);
</script>

<style scoped>
.customProperties {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 1fr 1fr;
  column-gap: 20px;
}
</style>
