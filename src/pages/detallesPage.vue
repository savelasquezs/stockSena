<!-- Fecha Documentacion 5/09/2023 -->
<!-- Este componente muestra información detallada sobre un producto y se asegura de que 
  los datos se actualicen automáticamente cuando cambias el producto seleccionado a través
  de la ruta. Esto se logra mediante la observación de la ruta y la interacción con las 
  tiendas Vuex que contienen los datos relacionados con productos y préstamos. -->
<template>
  {{ product }}
  {{ id }}
  <div style="background-color: #f5f5f5"></div>
  <!-- Informacion de  productos -->
  <div
    class="q-pa-md row items-start q-gutter-md"
    style="display: flex; justify-content: center"
  >
    <q-card class="my-card">
      <q-card-section
        class="bg-accent text-white"
        style="display: flex; flex-direction: column"
      >
        <!-- Campo ingreso de Nombre-Consumible-Estado-->
        <div class="text-h5">
          <strong>{{ product.nombre }}</strong>
        </div>
        <div class="flex">
          <div class="text-subtitle" style="flex: 1; margin: 8px">
            Nombre: {{}}
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
    <!-- En la tabla de productos se mostrara los datos exactos que fueron prestados en total -->
    <q-card class="my-card">
      <q-card-section class="bg-white text-black">
        <div class="text-h5">Veces Prestadas</div>
        <div class="text-subtitle text-green">
          {{ prestamosStore.allBorrowingsProducts.length }}
        </div>
      </q-card-section>
    </q-card>
    <!-- En la tabla se visualizara la cantidad de prestamos exactos en total -->
    <q-card class="my-card">
      <q-card-section class="bg-brown-5 text-black">
        <div class="text-h5">Cantidad En Prestamo</div>
        <div class="text-subtitle2 text-black">{{ vecesPrestada }}</div>
      </q-card-section>
    </q-card>
    <!-- En la tabla se visualizara la cantidad de elementos que hay en el almacen -->
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
  />
</template>
<!-- Importa las tiendas Vuex UsePrestamosStore y useProductosStore que proporcionan
  acceso a los datos relacionados con préstamos y productos. -->
<script setup>
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { useProductosStore } from "src/stores/productosStore";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import SimpleTable from "components/utils/SimpleTable.vue";
const props = defineProps(["id"]);
const route = useRoute();
// Se definen variables reactivas, como productoId y product, para mantener el estado del componente.
const productoId = ref(route.params.id);
const product = ref({});
// La función ejecutarInicio se utiliza para cargar los datos iniciales del producto y los
//préstamos relacionados cuando el componente se monta. Esto se hace llamando a las acciones correspondientes de las tiendas Vuex.
const prestamosStore = UsePrestamosStore();
const productosStore = useProductosStore();
async function ejecutarInicio() {
  await prestamosStore.getPrestamosByProduct(productoId.value);
  product.value = productosStore.productosDatabase.find(
    (producto) => producto.docId == productoId.value
  );
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
