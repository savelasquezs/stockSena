<template>
  <!-- Informacion de productos -->
  <div class="flex justify-center">
    <q-item style="width: 30%" class="q-pa-lg">
      <q-item-section avatar>
        <q-avatar color="accent" text-color="white"
          >{{ product.nombre[0] }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="flex flex-center"
          ><span class="text-h5 text-weight-bold">{{
            product.nombre
          }}</span></q-item-label
        >
        <q-item-label caption class="flex flex-center"
          >codigo de barra : {{ product.codigoBarra }}</q-item-label
        >
      </q-item-section>
    </q-item>
  </div>
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
    <div>
      <div class="shadow-2 q-pa-lg text-h6 text-accent text-weight-bold">
        Veces Prestadas

        <div class="text-subtitle text-black">
          {{ prestamosStore.allBorrowingsProducts.length }}
        </div>
      </div>
    </div>

    <div>
      <div class="shadow-2 q-pa-lg">
        <div class="text-h6 text-primary text-weight-bold">
          Cantidad En Prestamo
        </div>
        <div class="text-subtitle2 text-black">{{ vecesPrestada }}</div>
      </div>
    </div>

    <q-card-section class="bg-white text-orange">
      <div class="shadow-2 q-pa-lg text-h6 text-weight-bold">
        Cantidad en Almacén
        <div class="text-subtitle text-black">6</div>
      </div>
    </q-card-section>
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
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import SimpleTable from "components/utils/SimpleTable.vue";
const props = defineProps(["id"]);
const route = useRoute();
const router = useRouter();
const productoId = ref(route.params.id);
const product = ref({});
const customProperties = ref([]);

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
  product.value = productosStore.productosDatabase.find(
    (producto) => producto.docId == productoId.value
  );
  if (!product.value.isConsumable) {
    customProperties.value = Object.entries(product.value.custom);
  }
}
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

<style scoped>
.customProperties {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: 1fr 1fr;
  column-gap: 20px;
}
</style>
