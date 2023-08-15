<template>
  <StadisticTableBar :stadisticTableBarInfo="stadistics" />

  <q-dialog v-model="formOppened" full-width>
    <q-card>
      <q-card-section class="flex row justify-end q-pb-none">
        <q-btn dense round flat icon="close" v-close-popup style="width: 30px">
          <q-tooltip class="bg-white text-red">Cerrar</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section>
        <movimiento-form @movimientoGuardado="formOppened = false" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <TableReuse
    :dataArray="movimientosStore.movimientosDatabase"
    :columns="columns"
    title="Tabla de movimientos"
    :internalColumns="internalColumns"
    addText="Agregar Movimiento"
    @add="formOppened = true"
  />
</template>

<script setup>
import MovimientoForm from "components/Movimientos/MovimientoForm.vue";
import StadisticTableBar from "components/utils/StadisticTableBar.vue";
import TableReuse from "components/utils/TableReuse.vue";
import { ref } from "vue";
import { UseMovimientosStore } from "stores/movimientosStore";
const formOppened = ref(false);
const dataTableArray = ref([]);

const movimientosStore = UseMovimientosStore();

movimientosStore.listenChanges().then(() => {
  dataTableArray.value = movimientosStore.movimientosDatabase;
});

const columns = [
  {
    name: "TipoMovimiento",
    align: "center",
    label: "Tipo de movimiento",
    field: (row) => row.movimiento,
    sortable: true,
  },

  {
    name: "date",
    label: "Fecha Movimiento",
    field: (row) => row.fecha,
    format: (val) => new Date(val).toLocaleDateString(),
  },
  {
    name: "proveedor",
    label: "Proveedor",
    field: (row) => row.proveedor,
  },
];

const internalColumns = [
  {
    name: "docId",
    align: "center",
    label: "Id",
    field: (row) => row.docId,
    sortable: true,
  },
  {
    name: "nombre",
    align: "center",
    label: "Nombre elemento",
    field: (row) => row.nombre,
    sortable: true,
  },
  {
    name: "cantidad",
    align: "center",
    label: "Cantidad Ingresada",
    field: (row) => row.cantidad,
    sortable: true,
  },
  {
    name: "stockAnterior",
    align: "center",
    label: "Stock Anterior",
    field: (row) => row.stockAnterior,
    sortable: true,
  },
  {
    name: "nuevoStock",
    align: "center",
    label: "Nuevo Stock",
    field: (row) => row.nuevoStock,
    sortable: true,
  },
  {
    name: "notas",
    align: "center",
    label: "Descripción",
    field: (row) => row.notas,
    sortable: true,
  },
];

const stadistics = ref([
  {
    text_color: "text-light-green-14",
    titulo: "Total ingresos",
    valor: "210",
    periodo: "Ultima semana",
  },
  {
    text_color: "text-teal-6",
    titulo: "Total Salidas",
    valor: "210",
    periodo: "Ultima semana",
  },
  {
    text_color: "text-deep-orange-6",
    titulo: "Proveedor Estrella",
    valor: "Juan la roca",
    periodo: "Ultima semana",
  },
]);
</script>

<style lang="scss" scoped></style>
