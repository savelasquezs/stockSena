<template>
  <div style="background-color: #f5f5f5"></div>
  <!-- Informacion de productos -->
  <div
    class="q-pa-md row items-start q-gutter-md"
    style="display: flex; justify-content: center"
  >
    <q-card class="my-card">
      <q-card-section
        class="bg- text-black"
        style="display: flex; flex-direction: column"
      >
        <div class="text-h5"><strong>Información del Producto</strong></div>
        <div class="flex">
          <div class="text-subtitle" style="flex: 1; margin: 8px">Ram: 8GB</div>
          <div class="text-subtitle3" style="text-align: right; margin: 8px">
            Disco Duro: 500 GB
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
    <q-card class="my-card">
      <q-card-section class="bg-white text-orange">
        <div class="text-h5">Veces Prestadas</div>
        <div class="text-subtitle text-black">12</div>
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section class="bg-white text-black">
        <div class="text-h5">Einer Pino Cabrera</div>
        <div class="text-subtitle2 text-black">6</div>
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section class="bg-white text-black">
        <div class="text-h5">Joan y Jose Zap</div>
        <div class="text-subtitle text-black">6</div>
      </q-card-section>
    </q-card>
  </div>
  <SimpleTable :columns="columnas" />
</template>
<script setup>
import SimpleTable from "../utils/SimpleTable.vue";

const columnas = [
  {
    name: "prestamo",
    required: true,
    label: "Día Prestamo",
    align: "left",
    field: (row) => row.prestamo,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "entrega",
    align: "center",
    label: "Día Entrega",
    field: "entrega",
    sortable: true,
  },
  {
    name: "prestador",
    label: "Nombre Prestador",
    field: "prestador",
    sortable: true,
  },
  { name: "cp", label: "Cantidad Prestada", field: "cp" },
];
</script>
