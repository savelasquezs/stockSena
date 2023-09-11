<!-- Día de la documentación: 06/09/2023
Descripción del archivo "TablaVue.vue":

Este archivo representa un componente Vue.js que muestra una tabla de datos utilizando el componente "q-table" de Quasar Framework.
La tabla muestra información de préstamos, incluyendo documento, nombre, ficha, fecha de préstamo y cantidad. También permite expandir filas para ver más detalles de cada préstamo.

Características clave:
- Utiliza el componente "q-table" de Quasar Framework para mostrar datos en forma de tabla.
- Permite ordenar los datos por columna haciendo clic en los encabezados de columna.
- Proporciona la capacidad de expandir filas para ver detalles adicionales de cada préstamo.

Props recibidos:
- Ninguno

Eventos emitidos:
- Ninguno

Uso:
- Este componente se utiliza para visualizar y gestionar datos de préstamos en forma de tabla en una página o vista de la aplicación.

Nota: por ahora los datos mostrados en la tabla son ingresados directamente en el codigo.
Es necesario volcer el codigo mas reactivo-->
<template>
  <!-- Contenedor principal de la tabla -->
  <div class="q-pa-md" style="background-color: #f5f5f5">
    <q-table
      flat
      bordered
      title="Préstamos"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <!-- Definición de la estructura de la cabecera de la tabla -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <!-- Celda de expansión automática -->
          <q-th auto-width />
          <!-- Generación de las columnas de cabecera -->
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{
            col.label
          }}</q-th>
        </q-tr>
      </template>

      <!-- Definición de la estructura del cuerpo de la tabla -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- Botón de expansión de fila -->
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
          <!-- Generación de las celdas de datos -->
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{
            col.value
          }}</q-td>
        </q-tr>
        <!-- Fila adicional que se muestra al expandir una fila -->
        <q-tr v-show="props.expand" :props="props">
          <!-- Contenido de descripción de préstamo -->
          <q-td colspan="100%"
            ><div class="text-left">Descripción préstamo:</div></q-td
          >
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
// Definición de las columnas de la tabla
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
  { name: "amout", label: "Cantidad", field: "amout" },
];
// Datos de ejemplo para llenar la tabla
const rows = [
  { document: 159, name: "Frozen Yogurt", ficha: 6.0, date: 24, amout: 4.0 },
  {
    document: 237,
    name: "Ice cream sandwich",
    ficha: 9.0,
    date: 37,
    amout: 4.3,
  },
  { document: 262, name: "Eclair", ficha: 16.0, date: 23, amout: 6.0 },
  { document: 305, name: "Cupcake", ficha: 3.7, date: 67, amout: 4.3 },
  { document: 356, name: "Gingerbread", ficha: 16.0, date: 49, amout: 3.9 },
  { document: 375, name: "Jelly bean", ficha: 0.0, date: 94, amout: 0.0 },
  { document: 392, name: "Lollipop", ficha: 0.2, date: 98, amout: 0 },
  { document: 408, name: "Honeycomb", ficha: 3.2, date: 87, amout: 6.5 },
  { document: 452, name: "Donut", ficha: 25.0, date: 51, amout: 4.9 },
  { document: 518, name: "KitKat", ficha: 26.0, date: 65, amout: 7 },
];
</script>
