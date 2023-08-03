<template>
  <div class="q-pa-md">
    <q-table
      style="height: 400px"
      flat
      bordered
      title="Tabla de Productos"
      :rows="rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    />
  </div>
</template>

<script>
import { ref } from "vue";

const columns = [
  {
    name: "index",
    label: "Id",
    field: "index",
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
  {
    name: "Consumible",
    align: "center",
    label: "Consumible",
    field: "Consumible",
    sortable: true,
  },
  {
    name: "Stock Total",
    label: "Stock Total",
    field: "Stock Total",
    sortable: true,
  },
  { name: "Descripción", label: "Descripción", field: "Descripción" },
  {
    name: "Código de barra",
    label: "Código de barra",
    field: "Código de barra",
  },
  { name: "Categoria", label: "Categoria", field: "Categoria" },
  { name: "Fecha-Ingreso", label: "Fecha-Ingreso", field: "Fecha-Ingreso" },
  { name: "Stock-Prestamo", label: "Stock-Prestamo", field: "Stock-Prestamo" },
  {
    name: "Fecha-Vencimiento",
    label: "Fecha-Vencimiento",
    field: "Fecha-Vencimiento",
  },
  { name: "Almacen", label: "Almacen", field: "Almacen" },
];

const seed = [
  {
    name: "",
    Consumible: "",
    Stock_Total: "",
    Descripcion: "",
    Codigo_barra: "",
    Categoria: "",
    Fecha_Ingreso: "",
    Stock_Prestamo: "",
    Fecha_Vencimiento: "",
    Almacen: "",
  },
  {
    name: "",
    Consumible: "",
    Stock_Total: "",
    Descripcion: "",
    Codigo_barra: "",
    Categoria: "",
    Fecha_Ingreso: "",
    Stock_Prestamo: "",
    Fecha_Vencimiento: "",
    Almacen: "",
  },
  {
    name: "",
    Consumible: "",
    Stock_Total: "",
    Descripcion: "",
    Codigo_barra: "",
    Categoria: "",
    Fecha_Ingreso: "",
    Stock_Prestamo: "",
    Fecha_Vencimiento: "",
    Almacen: "",
  },
  {
    name: "",
    Consumible: "",
    Stock_Total: "",
    Descripcion: "",
    Codigo_barra: "",
    Categoria: "",
    Fecha_Ingreso: "",
    Stock_Prestamo: "",
    Fecha_Vencimiento: "",
    Almacen: "",
  },
  {
    name: "",
    Consumible: "",
    Stock_Total: "",
    Descripcion: "",
    Codigo_barra: "",
    Categoria: "",
    Fecha_Ingreso: "",
    Stock_Prestamo: "",
    Fecha_Vencimiento: "",
    Almacen: "",
  },
  {
    name: "",
    Consumible: "",
    Stock_Total: "",
    Descripcion: "",
    Codigo_barra: "",
    Categoria: "",
    Fecha_Ingreso: "",
    Stock_Prestamo: "",
    Fecha_Vencimiento: "",
    Almacen: "",
  },
  {
    name: "",
    Consumible: "",
    Stock_Total: "",
    Descripcion: "",
    Codigo_barra: "",
    Categoria: "",
    Fecha_Ingreso: "",
    Stock_Prestamo: "",
    Fecha_Vencimiento: "",
    Almacen: "",
  },
  {
    name: "",
    Consumible: "",
    Stock_Total: "",
    Descripcion: "",
    Codigo_barra: "",
    Categoria: "",
    Fecha_Ingreso: "",
    Stock_Prestamo: "",
    Fecha_Vencimiento: "",
    Almacen: "",
  },
  {
    name: "",
    Consumible: "",
    Stock_Total: "",
    Descripcion: "",
    Codigo_barra: "",
    Categoria: "",
    Fecha_Ingreso: "",
    Stock_Prestamo: "",
    Fecha_Vencimiento: "",
    Almacen: "",
  },
  {
    name: "",
    Consumible: "",
    Stock_Total: "",
    Descripcion: "",
    Codigo_barra: "",
    Categoria: "",
    Fecha_Ingreso: "",
    Stock_Prestamo: "",
    Fecha_Vencimiento: "",
    Almacen: "",
  },
];

// we generate lots of rows here
let rows = [];
for (let i = 0; i < 10; i++) {
  rows = rows.concat(seed.slice(0).map((r) => ({ ...r })));
}
rows.forEach((row, index) => {
  row.index = index;
});

export default {
  setup() {
    return {
      columns,
      rows,

      pagination: ref({
        rowsPerPage: 0,
      }),
    };
  },
};
</script>
