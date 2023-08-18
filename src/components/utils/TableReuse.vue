<template>
  <q-table
    flat
    bordered
    :title="title"
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
      <div class="col-2 q-table__title">{{ title }}</div>

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
      <q-btn
        color="primary"
        label="Descargar"
        icon="download"
        style="width: 200px"
      />
      <q-btn
        class="q-ml-sm"
        color="primary"
        :label="addText"
        icon="add_circle"
        @click="$emit('add')"
        style="width: 300px"
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
</template>

<script setup>
import { ref } from "vue";
import DatePicker from "../utils/DatePicker.vue";
const search = ref("");
const rangoFechas = ref(null);
const rows = ref([]);
const props = defineProps({
  dataArray: Array,
  columns: Array,
  title: String,
  internalColumns: Array,
  addText: String,
});
rows.value = props.dataArray;

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
    const filtro = props.dataArray.filter((item) => {
      if (props.table == "borrowings")
        return item.dateBorrowed > fromDate && item.dateBorrowed < toDate;
      return item.fecha > fromDate && item.fecha < toDate;
    });
    rows.value = filtro;
    rangoFechas.value = null;
  }
}

function resetTable() {
  rows.value = props.dataArray;
}
</script>

<style lang="scss" scoped></style>
