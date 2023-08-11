<template>
  <div style="background-color: #f5f5f5">
    <div class="q-pa-md">
      <div class="flex justify-center">
        <stadisticTableBar :stadisticTableBarInfo="stadisticTableBarInfo" />
      </div>
    </div>
    <q-table
      flat
      bordered
      title="Préstamos"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="search"
    >
      <template v-slot:top>
        <q-input v-model="search" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <q-btn color="primary" label="Descargar" icon="download" />
        <q-btn
          v-if="rows.length !== 0"
          class="q-ml-sm"
          color="primary"
          label="Remove row"
        />
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              color="positive"
              round
              @click="props.row.expand = !props.row.expand"
              :icon="props.row.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.row.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              Descripción préstamo:
              <q-table
                :rows="props.row.productosList"
                :columns="internalColumns"
                dark
              >
              </q-table>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script setup>
import SearchBar from "../utils/SearchBar.vue";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import stadisticTableBar from "../prestamos/StadisticTableBar.vue";

import { ref } from "vue";

const search = ref("");

const rows = ref([]);
const prestamosStore = UsePrestamosStore();
prestamosStore.listenChanges().then(() => {
  console.log(prestamosStore.prestamosDatabase);
  rows.value = prestamosStore.prestamosDatabase;
});

const stadisticTableBarInfo = ref([
  {
    text_color: "light-green-14",
    titulo: "Productos devueltos",
    valor: "210",
    periodo: "Ultima semana",
  },
  {
    text_color: "light-green-14",
    titulo: "Productos prestados",
    valor: "300",
    periodo: "Ultima semana",
  },
  {
    text_color: "light-green-14",
    titulo: "Total productos",
    valor: "15000",
    periodo: "Ultima semana",
  },
  {
    text_color: "pink",
    titulo: "Total pink",
    valor: "15000000",
    periodo: "Ultima semana",
  },
]);

const columns = [
  {
    name: "document",
    align: "center",
    label: "Documento",
    field: (row) => row.customer.documentNumber,
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.customer.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: "ficha", label: "Ficha", field: "ficha", sortable: true },
  {
    name: "date",
    label: "Fecha préstamo",
    field: (row) => row.dateBorrowed,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    name: "amout",
    label: "Cantida",
    field: (row) => row.productosList[0].quantity,
  },
];

const internalColumns = [
  {
    name: "productoId",
    align: "center",
    label: "Id Producto",
    field: (row) => row.productId,
    sortable: true,
  },
  {
    name: "product",
    required: true,
    label: "Producto",
    align: "left",
    field: (row) => row.product,
    sortable: true,
  },
  {
    name: "cantidad",
    label: "Cantidad",
    field: (row) => row.quantity,
    sortable: true,
  },
  {
    name: "fechaPrestado",
    label: "Fecha préstamo",
    field: (row) => row.dateBorrowed,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    name: "fechaEntrega",
    label: "Fecha Entrega",
    field: (row) => row.dueDate,
    format: (val) => new Date(val).toLocaleDateString(),
  },
];
</script>
