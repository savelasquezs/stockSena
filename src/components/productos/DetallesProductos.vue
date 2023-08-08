<template>
  <div class="q-pa-md">
    <h5 class="text text-center">Tabla Productos asdsd</h5>
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
      <template v-slot:body-cell-name="props">
        <q-td :props="props" auto-width>
          <q-item>
            <q-item-section side>
              <q-item-label caption lines="2">{{
                props.row.description
              }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>Single line item</q-item-label>
              <q-item-label caption lines="2"
                >Secondary line text. Lorem ipsum dolor sit amet, consectetur
                adipiscit elit.</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { collection, onSnapshot } from "firebase/firestore";
import { ref } from "vue";
import { db } from "../../firebaseInit";

const columns = ref([
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
    field: "consumable",
    sortable: true,
  },
  {
    name: "Stock Total",
    label: "Stock Total",
    field: "totalStock",
    sortable: true,
  },
  { name: "Descripción", label: "Descripción", field: "description" },
  {
    name: "Código de barra",
    label: "Código de barra",
    field: "barCode",
  },
  { name: "Categoria", label: "Categoria", field: "category" },
  { name: "Fecha-Ingreso", label: "Fecha-Ingreso", field: "created" },
  { name: "Stock-Prestamo", label: "Stock-Prestamo", field: "totalStock" },
  {
    name: "Fecha-Vencimiento",
    label: "Fecha-Vencimiento",
    field: "dueDate",
  },
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
