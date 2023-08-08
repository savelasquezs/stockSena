<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Préstamos"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
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
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">Descripción préstamo:</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script setup>
const columns = [
  {
    name: "document",
    align: "center",
    label: "Documento",
    field: "document",
    sortable: true,
  },
  {
    name: "name",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: "ficha", label: "Ficha", field: "ficha", sortable: true },
  { name: "date", label: "Fecha préstamo", field: "date" },
  { name: "amout", label: "Cantida", field: "amout" },
];

const rows = [
  {
    document: 159,
    name: "Frozen Yogurt",
    ficha: 6.0,
    date: 24,
    amout: 4.0,
  },
  {
    document: 237,
    name: "Ice cream sandwich",
    ficha: 9.0,
    date: 37,
    amout: 4.3,
  },
  {
    document: 262,
    name: "Eclair",
    ficha: 16.0,
    date: 23,
    amout: 6.0,
  },
  {
    document: 305,
    name: "Cupcake",
    ficha: 3.7,
    date: 67,
    amout: 4.3,
  },
  {
    document: 356,
    name: "Gingerbread",
    ficha: 16.0,
    date: 49,
    amout: 3.9,
  },
  {
    document: 375,
    name: "Jelly bean",
    ficha: 0.0,
    date: 94,
    amout: 0.0,
  },
  {
    document: 392,
    name: "Lollipop",
    ficha: 0.2,
    date: 98,
    amout: 0,
  },
  {
    document: 408,
    name: "Honeycomb",
    ficha: 3.2,
    date: 87,
    amout: 6.5,
  },
  {
    document: 452,
    name: "Donut",
    ficha: 25.0,
    date: 51,
    amout: 4.9,
  },
  {
    document: 518,
    name: "KitKat",
    ficha: 26.0,
    date: 65,
    amout: 7,
  },
];
</script>

