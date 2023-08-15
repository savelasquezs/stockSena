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
          titulo="TOTAL PRODUCTOS"
          valor="34.000"
          periodo="ultima semana"
          text-color="text-orange"
        />
        <StadisticTableItem
          titulo="LO MÁS PRESTADO"
          valor="6.890"
          periodo="ultima semana"
          text-color="text-green"
        />
        <StadisticTableItem
          titulo="BAJAS"
          valor="4.000"
          periodo="ultima semana"
          text-color="text-red-14"
        />
      </div>
      <div class="q-tables">
        <div class="q-mr-lg">
          <div>
            <q-input class="q-ml-sm" v-model="filtro" style="width: 410px" />
          </div>
          <div class="flex justify-end">
            <div>
              <q-btn
                @click="toggleVentanaEmergente"
                label="Agregar Producto"
                icon="add_circle_outline"
                color="primary"
                style="width: 210px"
                class="q-ml-sm"
              />
              <q-btn
                @click="exportTable"
                icon="file_download"
                color="primary"
                label="Descargar tabla"
                class="q-ml-sm"
                style="width: 210px"
              >
              </q-btn>
            </div>
          </div>
        </div>
        <div class="q-tables">
          <q-dialog v-model="mostrarVentanaEmergente">
            <q-card>
              <q-card-section>
                <productos-form />
              </q-card-section>

              <q-card-section> </q-card-section>

              <q-card-section> </q-card-section>

              <q-card-section> </q-card-section>

              <q-card-actions>
                <q-btn
                  dense
                  flat
                  round
                  icon="close"
                  @click="toggleVentanaEmergente"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-table
            style="height: 500px"
            flat
            bordered
            :rows="rows"
            :columns="columns"
            row-key="index"
            :rows-per-page-options="[0]"
            v-model="pagination"
            virtual-scroll
            :filter="filtro"
            class="my-card flex shadow-5 shadow-up-3"
            table-header-style="background-color:#00af00; color:#ffff; shadow-n"
          >
            <template v-slot:body-cell-acciones="props">
              <q-td :props="props">
                <q-btn
                  @click="verVentanaEmergente"
                  icon="visibility"
                  rounded
                  size="10px"
                  style="width: 20px; margin-right: 8px"
                  text-color="blue-5"
                />
                <q-btn
                  @click="editarVentanaEmergente"
                  icon="edit"
                  rounded
                  size="10px"
                  style="width: 20px; margin-right: 8px"
                  text-color="secondary"
                />
                <q-btn
                  @click="eliminarVentanaEmergente"
                  icon="delete_forever"
                  rounded
                  size="10px"
                  style="width: 20px; margin-right: 8px"
                  text-color="red-8"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.q-tables {
  padding: 5px;
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
import ProductosForm from "../components/productos/ProductosForm.vue";
import { defineComponent } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { ref } from "vue";
import { db } from "../firebaseInit";
import StadisticTableItem from "../components/utils/StadisticTableItem.vue";
import SearchBar from "components/utils/SearchBar.vue";
const mostrarVentanaEmergente = ref(false);
import { exportFile } from "quasar";

const filtro = ref("");
function toggleVentanaEmergente() {
  mostrarVentanaEmergente.value = !mostrarVentanaEmergente.value;
}
function verVentanaEmergente() {
  mostrarVentanaEmergente.value = !mostrarVentanaEmergente.value;
}
function editarVentanaEmergente() {
  mostrarVentanaEmergente.value = !mostrarVentanaEmergente.value;
}
const exportTable = () => {
  const columnLabels = columns.value.map((col) => col.label);
  const dataRows = rows.value.map((row) =>
    columns.value.map((col) =>
      wrapCsvValue(
        typeof col.field === "function"
          ? col.field(row)
          : row[col.field === void 0 ? col.name : col.field],
        col.format,
        row
      )
    )
  );

  const content = [columnLabels].concat(dataRows);
  const csvContent = content
    .map((row) => row.map((cell) => wrapCsvValue(cell)).join(";"))
    .join("\r\n");

  // Codificar el contenido en UTF-8 y agregar el BOM
  const encodedContent = new TextEncoder().encode("\uFEFF" + csvContent);

  const blob = new Blob([encodedContent], {
    type: "text/csv;charset=UTF-8",
  });

  // Descarga el archivo CSV utilizanseado Quasar exportFile
  exportFile("table-export.csv", blob);
};

const wrapCsvValue = (val, formatFn, row) => {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  return formatted;
};

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
  { name: "acciones", label: "Acciones", field: "acciones" },
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
