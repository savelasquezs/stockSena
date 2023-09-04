<template>
  {{ product }}

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
            Unidad de medida:
          </div>
          <div>{{ product.unidadMedida }}</div>
        </div>
        <div class="flex justify-between">
          <div v-if="product.isConsumable" class="text-subtitle3">
            Stock Total:
          </div>
          <div>{{ product.stockTotal }}</div>
        </div>
        <div class="flex justify-between">
          <div v-if="product.isConsumable" class="text-subtitle3">
            Consumible:
          </div>
          <div>{{ product.isConsumable ? "Si" : "No" }}</div>
        </div>
      </div>

      <div class="derecha">
        <div class="flex justify-between">
          <div v-if="product.isConsumable" class="text-subtitle3">
            Stock Disponible :
          </div>
          <div>{{ product.stockTotal - product.borrowedQuantity }}</div>
        </div>
        <div class="flex justify-between">
          <div v-if="product.isConsumable" class="text-subtitle3">
            Stock Prestamo:
          </div>
          <div>{{ product.borrowedQuantity }}</div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="q-pa-md row items-center q-gutter-md"
    style="display: flex; justify-content: center"
  >
    <div>
      <div class="text-h5"><strong>Veces Prestadas</strong></div>

      <div class="text-subtitle text-black">
        {{ prestamosStore.allBorrowingsProducts.length }}
      </div>
    </div>

    <q-card class="my-card">
      <q-card-section class="bg-white text-accent">
        <div class="text-h5"><strong> Cantidad En Prestamo</strong></div>
        <div class="text-subtitle2 text-black">{{ vecesPrestada }}</div>
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section class="bg-white text-orange-5">
        <div class="text-h5"><strong>Cantidad en Almacén</strong></div>
        <div class="text-subtitle text-black">6</div>
      </q-card-section>
    </q-card>
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
