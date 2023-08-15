<template>
  <q-item-section style="background-color: #f5f5f5">
    <div class="flex justify-evenly q-mt-lg">
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
        <q-card-section>
          <div class="tetxt-subtitle2 text-center">Cambio</div>
        </q-card-section>
      </q-card>
      <tarjeta-estad />
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

const tableData = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 },
  { id: 3, name: "Michael Johnson", age: 40 },
];
</script>

<script>
import SearchBar from "components/utils/SearchBar.vue";
import TarjetaEstad from "../dashboard/TarjetaEstad.vue";
</script>

<style>
.bg-primary {
  background-color: #1976d2; /* Cambia el color a tu preferencia */
}
</style>
