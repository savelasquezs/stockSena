<template>
  <div style="background-color: #f5f5f5">
    <!-- Contenido aquí -->

    <div class="q-pa-md">
      <q-input v-model="searchTerm" label="Buscar" />

      <div class="q-pa-md row items-start q-gutter-md flex justify-center">
        <q-item clickable to="/">
          <q-img
            src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png"
            loading="lazy"
            spinner-color="white"
            width="80px"
            class=""
          />
        </q-item>
        <q-card class="my-card flex shadow-5 shadow-up-3">
          <q-card-section class="bg-white text-black">
            <div class="text-h5" style="font-size: 1.8em; font-weight: bold">
              Inventario General
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="bg-withe text-blue">
            <div class="text-h5" style="font-size: 1.1em; font-weight: bold">
              Total de Productos
            </div>
            <div class="text-subtitle2">1.809</div>
            <div class="text-subtitle3">Ultimos 7 dias</div>
          </q-card-section>

          <q-card-section class="bg-withe text-green">
            <div class="text-h5" style="font-size: 1.1em; font-weight: bold">
              Lo más Vendido
            </div>
            <div class="text-subtitle2">5</div>
            <div class="text-subtitle3">Ultimos 7 dias</div>
          </q-card-section>

          <q-card-section class="bg-withe-8 text-red">
            <div class="text-h5" style="font-size: 1.1em; font-weight: bold">
              Acciones de Bajas
            </div>
            <div class="text-subtitle2">334</div>
            <div class="text-subtitle3">Ultimos 7 dias</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-table
      style="height: 400px"
      flat
      bordered
      :rows="rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
      v-model="pagination"
      :rows-per-page-options="[0]"
      class="my-sticky-header-table q-mt-xl shadow-4 shadow-up-4"
      table-header-style="background-color:#00af00; color:#ffff; shadow-n"
    >
    </q-table>
  </div>
</template>

<script setup>
import { collection, onSnapshot } from "firebase/firestore";
import { ref } from "vue";
import { db } from "../../firebaseInit";

const columns = ref([
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
    field: "consumable",
    sortable: true,
  },
  {
    name: "Stock Total",
    label: "Stock Total",
    field: "totalStock",
    sortable: true,
  },

  {
    name: "Código de barra",
    label: "Código de barra",
    field: "barCode",
  },

  { name: "Stock-Prestamo", label: "Stock-Prestamo", field: "totalStock" },

  { name: "Almacen", label: "Almacen", field: "almacen" },
]);

const rows = ref([]);

const tableRef = collection(db, "products");
onSnapshot(tableRef, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type == "added") {
      rows.value.push(change.doc.data());
      console.log(rows.value);
    }
  });
});
</script>
