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
          text-color="text-orange-14"
        />
        <StadisticTableItem
          titulo="LO MÁS PRESTADO"
          valor="6.890"
          periodo="ultima semana"
          text-color="text-green-10"
        />
        <StadisticTableItem
          titulo="BAJAS"
          valor="4.000"
          periodo="ultima semana"
          text-color="text-red-14"
        />
      </div>
      <q-dialog v-model="mostrarVentanaEmergente">
        <q-card style="width: 700px; max-width: 80vw">
          <q-card-section>
            <q-card-section class="flex row justify-end q-pb-none">
              <q-btn
                dense
                round
                flat
                icon="close"
                v-close-popup
                style="width: 30px"
              >
                <q-tooltip class="bg-white text-red">Cerrar</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="q-tables">
          <q-dialog v-model="mostrarVentanaEmergente">
            <q-card style="width: 700px; max-width: 80vw">
              <q-card-section>
                <q-card-section class="flex row justify-end q-pb-none">
                  <q-btn
                    dense
                    round
                    flat
                    icon="close"
                    v-close-popup
                    style="width: 30px"
                  >
                    <q-tooltip class="bg-white text-red">Cerrar</q-tooltip>
                  </q-btn>
                </q-card-section>
                <productos-form />
              </q-card-section>
            </q-card>
          </q-dialog>
          <div class="q-tables">
            <!-- ventana emergente para ver detalle de producto -->
            <q-dialog v-model="mostrarVentanaEmergenteVer">
              <q-card style="width: 700px; max-width: 80vw">
                <q-card-section>
                  <q-card-section class="flex row justify-end q-pb-none">
                    <q-btn
                      dense
                      round
                      flat
                      icon="close"
                      v-close-popup
                      style="width: 30px"
                    >
                      <q-tooltip class="bg-white text-red">Cerrar</q-tooltip>
                    </q-btn>
                  </q-card-section>
                  <detalles-productos />
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
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
                  text-color="green-7"
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
                  @click="eliminarProducto(props.rowIndex)"
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
            </q-card-section>
            <productos-form />
          </q-card-section>
        </q-card>
      </q-dialog>
      //Aca va la tabla
      <SimpleTable
        :rows="dataTableArray"
        :columns="productosStore.columns"
        agregarElementoLabel="Agregar producto"
      />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import ProductosForm from "../components/productos/ProductosForm.vue";
import detallesProductos from "../components/productos/detallesProductos.vue";
import { defineComponent } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import StadisticTableItem from "components/utils/StadisticTableItem.vue";
import { useProductosStore } from "stores/productosStore";
import SimpleTable from "components/utils/SimpleTable.vue";
import { ref } from "vue";

const mostrarVentanaEmergente = ref(false);
const mostrarVentanaEmergenteVer = ref(false);
import { exportFile } from "quasar";

const filtro = ref("");
function toggleVentanaEmergente() {
  mostrarVentanaEmergente.value = !mostrarVentanaEmergente.value;
}
function verVentanaEmergente() {
  mostrarVentanaEmergenteVer.value = !mostrarVentanaEmergenteVer.value;
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
const productosStore = useProductosStore();
const dataTableArray = ref([]);
dataTableArray.value = productosStore.productosDatabase;
</script>
