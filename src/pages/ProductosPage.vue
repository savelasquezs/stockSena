<!-- Fecha documentacion 4/09/2023 -->
<!--este componente Vue.js se utiliza para mostrar y gestionar productos consumibles y 
  devolutivos. Permite agregar, editar y ver detalles de productos, cargar datos desde un 
  archivo y muestra estadísticas relacionadas con los productos. También utiliza 
  componentes reutilizables y pestañas para organizar la información.  -->
<template>
  <div style="background-color: #f5f5f5">
    <!-- <q-input type="file" @change="handleFileSelect" v-model="fileInput" />: Este elemento <q-input> permite 
    al usuario cargar un archivo. Cuando se selecciona un archivo, el evento @change llama
     a la función handleFileSelect, que procesa el archivo seleccionado y lo carga en la 
     aplicación. -->
    <q-input type="file" @change="handleFileSelect" v-model="fileInput" />
    {{ nombresColumnas }}
    <!-- Se hace funcion de QDialogo el cual lanza una ventana emergente la cual cuenta con
    opciones para agregar producto en el apartado de consumible.-->
    <QDialogo
      v-model="openedForm"
      colorButton="secondary"
      iconButton="add_circle"
      labelButton="Agregar producto consumible"
    >
      <!--  -->
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
      <!-- Implementacion de boton para ingreso de un nuevo producto consumible-->
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
          @viendo="verDetalles"
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
      <uploadData nomTabla="products" />
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

import { useRouter } from "vue-router";
const openedForm = ref(false);
const filtro = ref("");
const editando = ref(false);
const editandoConsumible = ref(false);
const itemToEdit = ref(null);
const openConsumableForm = ref(false);
const openForm = ref(false);

const router = useRouter();

function verDetalles(id) {
  router.push(`productos/${id}`);
}
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
