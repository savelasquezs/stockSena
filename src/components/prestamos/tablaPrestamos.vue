<template>
  <div style="background-color: #f5f5f5">
    <div class="q-pa-md">
      <stadisticTableBar :stadisticTableBarInfo="stadisticTableBarInfo" />
    </div>

    <q-dialog v-model="openedForm">
      <q-card>
        <q-card-section class="row justify-end q-pb-none">
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <prestamos-form @prestamoGuardado="openedForm = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-table
      flat
      bordered
      title="Prestamos"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="search"
      virtual-scroll
      :rows-per-page-options="[0]"
      style="height: 600px"
      class="q-mx-sm"
    >
      <template v-slot:top>
        <div class="col-2 q-table__title">Productos</div>

        <q-space />
        <div class="flex shadow-1 q-pa-lg q-mx-lg">
          <q-input v-model="search" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <DatePicker
            range
            @guardarFecha="filterByDate"
            @cleanedDates="resetTable"
          />
        </div>

        <q-space />
        <q-btn color="primary" label="Descargar" icon="download" />
        <q-btn
          v-if="rows.length !== 0"
          class="q-ml-sm"
          color="primary"
          label="Agregar prestamo"
          icon="add_circle"
          @click="openedForm = true"
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
              color="accent"
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
import stadisticTableBar from "../utils/StadisticTableBar.vue";
import dataRange from "../utils/dataRange.vue";
import DatePicker from "../utils/DatePicker.vue";
import PrestamosForm from "components/prestamos/PrestamosForm.vue";

import { ref } from "vue";

const openedForm = ref(false);
const search = ref("");
const rangoFechas = ref(null);
const rows = ref([]);
const prestamosStore = UsePrestamosStore();

prestamosStore.listenChanges().then(() => {
  console.log(prestamosStore.prestamosDatabase);
  resetTable();
});

function resetTable() {
  rows.value = prestamosStore.prestamosDatabase;
}

function configureFecha(fecha) {
  const fechaNormal = fecha.split("-");
  const nuevaFecha =
    fechaNormal[1] + "-" + fechaNormal[0] + "-" + fechaNormal[2];
  return nuevaFecha;
}

function filterByDate(valorFechas) {
  rangoFechas.value = valorFechas;
  if (rangoFechas.value != null) {
    const fromDate = new Date(configureFecha(rangoFechas.value.from)).getTime();
    const toDate = new Date(configureFecha(rangoFechas.value.to)).setHours(
      23,
      59,
      59
    );
    const filtro = prestamosStore.prestamosDatabase.filter((prestamo) => {
      return prestamo.dateBorrowed > fromDate && prestamo.dateBorrowed < toDate;
    });
    rows.value = filtro;
    rangoFechas.value = null;
  }
}

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
    text_color: "text-yellow",
    titulo: "Total productos",
    valor: "15000",
    periodo: "Ultima semana",
  },
  {
    text_color: "text-pink",
    titulo: "Diandry",
    valor: "8569522",
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
