<template>
  <!-- Informacion de productos -->
  <ProductMainInfo :product="product" />
  <q-separator />

  <div
    class="q-pa-md row items-start q-gutter-md"
    style="display: flex; justify-content: center"
  >
    <div class="shadow-3 q-pa-lg flex">
      <div class="izquierda q-mr-lg">
        <div class="flex justify-between">
          <div v-if="product.isConsumable" class="text-subtitle3">
            <q-icon name="poll" color="primary" size="20px" />
            Unidad de medida:
          </div>
          <div>{{ product.unidadMedida }}</div>
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

    <CustomPropertiesTable
      :producto="product"
      v-if="product && !product.isConsumable"
    />
  </div>

  <div
    class="q-pa-md row items-center q-gutter-md"
    style="display: flex; justify-content: center"
  >
    <div>
      <div class="shadow-3 q-pa-lg text-h6 text-accent text-weight-bold">
        Veces Prestadas

        <div class="text-subtitle2 text-black flex justify-center">
          {{ prestamosStore.allBorrowingsProducts.length }}
        </div>
      </div>
    </div>

    <div>
      <div class="shadow-3 q-pa-lg">
        <div class="text-h6 text-primary text-weight-bold">
          Cantidad En Prestamo
        </div>
        <div class="text-subtitle3 text-black flex justify-center">
          {{ vecesPrestada }}
        </div>
      </div>
    </div>

    <div class="shadow-3 q-pa-lg">
      <div class="bg-white text-orange text-h6 text-weight-bold">
        Cantidad En Almacén
        <div>
          <div class="text-subtitle2 text-black flex justify-center">
            {{ product.stockTotal }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <SimpleTable
    :rows="prestamosStore.allBorrowingsProducts"
    :columns="productosStore.columnasDetalleProducto"
    @viendo="verDetalles"
    customDetail
  />
</template>
<script setup>
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { useProductosStore } from "src/stores/productosStore";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import SimpleTable from "components/utils/SimpleTable.vue";
import CustomPropertiesTable from "components/productos/CustomPropertiesTable.vue";
import ProductMainInfo from "components/productos/ProductMainInfo.vue";
const props = defineProps(["id"]);
const route = useRoute();
const router = useRouter();
const productoId = ref(route.params.id);

function verDetalles(id) {
  const prestamo = prestamosStore.allBorrowingsProducts.find(
    (prestamo) => prestamo.docId == id
  );
  const clienteId = prestamo.customer.documentNumber;
  router.push(`/clientes/${clienteId}`);
}

const prestamosStore = UsePrestamosStore();
const productosStore = useProductosStore();
async function ejecutarInicio() {
  await prestamosStore.getPrestamosByProduct(productoId.value);
}
const product = computed(() => {
  return productosStore.productosDatabase.find(
    (producto) => producto.docId == productoId.value
  );
});

ejecutarInicio();

const vecesPrestada = computed(() => {
  return prestamosStore.allBorrowingsProducts.reduce(
    (a, b) => a + parseInt(b.cantidadPrestada),
    0
  );
});

watch(
  () => route.params.id,
  async (toId, fromId) => {
    productoId.value = toId;
    await prestamosStore.getPrestamosByProduct(productoId.value);
  }
);
</script>
