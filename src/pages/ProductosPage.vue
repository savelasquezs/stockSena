<template>
  <div style="background-color: #f5f5f5">
    <q-input type="file" @change="handleFileSelect" v-model="fileInput" />
    <!-- Contenido aquí -->

    {{ nombresColumnas }}
    <QDialogo
      v-model="openedForm"
      colorButton="secondary"
      iconButton="add_circle"
      labelButton="Agregar producto consumible"
    >
      <ProductosForm
        @enviado="openedForm = false"
        :editando="editando"
        :item="itemToEdit"
        :editandoConsumible="editandoConsumible"
      />
    </QDialogo>

    <div class="q-pa-md">
      <StadisticTableBar
        :stadisticTableBarInfo="productosStore.stadisticTableBarInfo"
      />
      <div class="flex justify-end">
        <QDialogo
          visibleButton
          v-model="openConsumableForm"
          colorButton="secondary"
          iconButton="add_circle"
          labelButton="Agregar producto consumible"
        >
          <ComsumiblesForm @productoGuardado="openConsumableForm = false" />
        </QDialogo>
      </div>
    </div>
    <Tabs :tabs="tabs"
      ><template #consumibles
        ><SimpleTable
          :rows="productosStore.productosConsumibles"
          :columns="productosStore.columns"
          agregarElementoLabel="Agregar producto"
          @agregando="resetForm"
          @editando="editElement"
        />
      </template>
      <template #devolutivos>
        <TableReuse
          :dataArray="productosStore.devolutivosRows"
          :columns="productosStore.devolutivosCols"
          :internalColumns="productosStore.devolutivosInternalCols"
          @editando="editarRetornable"
        />
      </template>
    </Tabs>
  </div>
</template>

<style scoped></style>

<script setup>
import Tabs from "components/utils/Tabs.vue";
import QDialogo from "components/utils/QDialogo.vue";
import ProductosForm from "../components/productos/ProductosForm.vue";
import StadisticTableItem from "components/utils/StadisticTableItem.vue";
import { useProductosStore } from "stores/productosStore";
import SimpleTable from "components/utils/SimpleTable.vue";
import TableReuse from "components/utils/TableReuse.vue";
import StadisticTableBar from "components/utils/StadisticTableBar.vue";
import ComsumiblesForm from "components/productos/ConsumiblesForm.vue";
import { computed, onMounted, ref } from "vue";
import { QDialog } from "quasar";
const openedForm = ref(false);
const filtro = ref("");
const editando = ref(false);
const editandoConsumible = ref(false);
const itemToEdit = ref(null);
const openConsumableForm = ref(false);
const openForm = ref(false);
const tabs = [
  { name: "consumibles", label: "Consumibles" },
  { name: "devolutivos", label: "Devolutivos" },
];

const nombresColumnas = computed(() => {
  if (productosStore.productosConsumibles.length > 0) {
    return Object.keys(productosStore.productosConsumibles[0]);
  } else {
    return [];
  }
});

const fileInput = ref(null);

function editElement(object) {
  let obj;
  console.log(object);
  if (object.productosList) {
    obj = object.productosList.find((product = product.docId == object.docId));
  }
  editandoConsumible.value = true;
  console.log(obj);
  editando.value = true;
  itemToEdit.value = object;
  openedForm.value = true;
}

function editarRetornable(id) {
  editando.value = true;
  const object = productosStore.productosDatabase.find(
    (product) => product.docId == id
  );
  itemToEdit.value = object;
  editando.value = true;
  openedForm.value = true;
}

function resetForm() {
  editando.value = false;
  itemToEdit.value = null;
  openedForm.value = true;
}

function handleFileSelect() {
  const file = fileInput.value[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const worksheet = workbook.SheetNames[0];

    const XL_row_object = XLSX.utils.sheet_to_row_object_array(
      workbook.Sheets[worksheet]
    );

    console.log(XL_row_object);

    databaseStore.saveElement();
  };
  reader.onerror = (ex) => {
    console.log(ex);
  };
  reader.readAsBinaryString(file);
}

const rows = ref([]);

const productosStore = useProductosStore();
</script>
