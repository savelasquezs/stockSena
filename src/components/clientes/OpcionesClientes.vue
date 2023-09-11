<!-- Fecha documentacion -->
<!-- Este componente de Vue.js con Quasar se utiliza para mostrar una página que contiene
  tres tarjetas con iconos y títulos, seguidas de una tabla de datos. La tabla de datos 
  se puede actualizar automáticamente cuando cambia el parámetro de ruta id en la URL, 
  gracias al uso de watch. Los estilos CSS también se aplican para dar formato a la
  interfaz de usuario. -->
<template>
  <q-item-section style="background-color: #f5f5f5">
    <div class="flex justify-evenly q-mt-lg">
      {{ userId }}
      <q-card class="my-card q-px-lg">
        <q-icon
          name="article"
          size="100px"
          color="primary"
          style="
             {
              margin: 0 auto;
            }
          "
        />
        <!--Importancion del componente que permite visualizar el historial de los elementos
      almacenados -->
        <q-card-section>
          <div class="tetxt-subtitle2 text-center">Historial</div>
        </q-card-section>
      </q-card>
      <q-card class="my-card q-px-lg">
        <q-icon
          name="real_estate_agent"
          size="100px"
          color="primary"
          style="
             {
              margin: 0 auto;
            }
          "
        />
        <!--Importancion del componente que permite prestar elementos
      almacenados -->
        <q-card-section>
          <div class="tetxt-subtitle2 text-center">Prestar</div>
        </q-card-section>
      </q-card>

      <q-card class="my-card q-px-lg">
        <q-icon
          name="published_with_changes"
          size="100px"
          color="primary"
          style="
             {
              margin: 0 auto;
            }
          "
        />
        <!--Importancion del componenete que permite el cambio elementos
      almacenados -->
        <q-card-section>
          <div class="tetxt-subtitle2 text-center">Cambio</div>
        </q-card-section>
      </q-card>
    </div>

    <div>
      <q-table
        :rows="tableData"
        :columns="tableColumns"
        row-key="id"
        class="my-sticky-header-table q-mt-lg"
        flat
        bordered
        table-header-style="background-color:#00af00; color:#ffff"
        virtual-scroll
        :rows-per-page-options="[0]"
      >
      </q-table>
    </div>
  </q-item-section>
</template>

<script setup>
import SearchBar from "components/utils/SearchBar.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute(); // Obtiene la información de la ruta actual utilizando useRoute de vue-router
const userId = ref(route.params.id); // Crea una variable reactiva userId y la inicializa con el valor del parámetro de ruta "id" de la URL actual

watch(
  () => route.params.id, // Observa el cambio en el parámetro "id" de la ruta
  (toId, fromId) => {
    userId.value = toId; // Actualiza el valor de userId cuando cambia el parámetro de ruta "id"
  }
);
// El código que proporcionaste define un array llamado tableColumns que se utiliza para
// configurar las columnas de una tabla de datos. Cada objeto dentro de tableColumns
// representa una columna específica en la tabla.
const tableColumns = [
  {
    name: "id",
    required: true,
    label: "ID",
    align: "left",
    field: "id",
    sortable: true,
  },
  {
    name: "codigo",
    required: true,
    label: "Codigo",
    align: "left",
    field: "codigo",
    sortable: true,
  },
  {
    name: "producto",
    required: true,
    label: "Producto",
    align: "left",
    field: "producto",
    sortable: true,
  },
  {
    name: "fecha_de_pedido",
    required: true,
    label: "Fecha de pedido",
    align: "left",
    field: "Fecha de pedido",
    sortable: true,
  },
];
// Define una serie de objetos que representan las columnas de la tabla de datos
// Cada objeto tiene propiedades como name, label, field, etc., que se utilizan para configurar la tabla

const tableData = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 },
  { id: 3, name: "Michael Johnson", age: 40 },
];
</script>

<script></script>

<style>
.bg-primary {
  background-color: #1976d2; /* Cambia el color a tu preferencia */
}
</style>
