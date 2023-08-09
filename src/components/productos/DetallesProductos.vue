<template>
  <div style="background-color: #f5f5f5">
    <!-- Contenido aquí -->

    <div class="q-pa-md">
      <div class="q-pa-md row items-start q-gutter-md flex justify-center">
        <q-item clickable to="/">
          <q-img
            src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png"
            loading="lazy"
            spinner-color="white"
            width="100px"
            class=""
          />
        </q-item>
        <StadisticTableItem
          titulo="Total Productos"
          valor="34.000"
          periodo="ultima semana"
          text-color="text-orange"
        />
        <StadisticTableItem
          titulo="Lo más Prestado"
          valor="6.890"
          periodo="ultima semana"
          text-color="text-green"
        />
        <StadisticTableItem
          titulo="Bajas"
          valor="4.000"
          periodo="ultima semana"
          text-color="text-red-6"
        />
      </div>
    </div>
    <div class="search-bar">
      <div class="search-icon">
        <i class="material-icons">search</i>
      </div>
      <input
        class="search-input"
        type="text"
        v-model="searchQuery"
        placeholder="Buscar producto"
      />
      <div class="clear-icon" v-if="searchQuery" @click="clearSearch">
        <i class="material-icons">clear</i>
      </div>
    </div>

    <div class="q-tables">
      <div class="flex q-my-sm justify-end">
        <q-btn style="width: 250px" class="q-mx-lg" rounded>
          <q-icon name="add_circle_outline" class="q-mr-sm" />
          <span>Agregar Producto</span></q-btn
        >
        <q-btn style="width: 200px" rounded>
          <q-icon name="download" class="q-mx-sm" /><span
            >Descargar</span
          ></q-btn
        >
      </div>
      <q-table
        style="height: 400px"
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="index"
        virtual-scroll
        :rows-per-page-options="[0]"
        class="my-card flex shadow-5 shadow-up-3"
        table-header-style="background-color:#00af00; color:#ffff; shadow-n"
      >
        a
      </q-table>
    </div>
  </div>
</template>

<style scoped>
.q-tables {
  padding: 20px;
  background-color: #f5f5f5;
}
.search-bar {
  display: flex;
  align-items: center;
  border: 2px solid #ccc;
  border-radius: 24px;
  padding: 3px;
  margin-bottom: 5px;
  max-width: 700px;
  margin: 0 auto;
  padding-right: 8px;
}

.search-icon,
.clear-icon {
  padding: 6px;
  cursor: pointer;
}

.search-input {
  border: none;
  flex: 1;
  padding: 6px;
  background-color: #f5f5f5;
  outline: none;
}
</style>

<script setup>
import { collection, onSnapshot } from "firebase/firestore";
import { ref } from "vue";
import { db } from "../../firebaseInit";
import StadisticTableItem from "../utils/StadisticTableItem.vue";

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
