<template>
  <div style="background-color: #f5f5f5">
    <!-- Contenido aquí -->
    <q-dialog v-model="openedForm">
      <q-card style="width: 500px">
        <q-card-section class="row justify-end q-pb-none">
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <ProductosForm
            @enviado="openedForm = false"
            :editando="editando"
            :item="itemToEdit"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="openConsumableForm">
      <q-card>
        <q-card-section class="row justify-end q-pb-none">
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <ComsumiblesForm @productoGuardado="openConsumableForm = false" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="q-pa-md">
      <StadisticTableBar
        :stadisticTableBarInfo="productosStore.stadisticTableBarInfo"
      />
      <div class="flex justify-end">
        <q-btn
          label="Agregar producto consumible"
          icon="add_circle"
          color="secondary"
          @click="openConsumableForm = true"
        />
      </div>
      <SimpleTable
        :rows="dataTableArray"
        :columns="productosStore.columns"
        agregarElementoLabel="Agregar producto"
        @agregando="resetForm"
        @editando="editElement"
      />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import ProductosForm from "../components/productos/ProductosForm.vue";
import StadisticTableItem from "components/utils/StadisticTableItem.vue";
import { useProductosStore } from "stores/productosStore";
import SimpleTable from "components/utils/SimpleTable.vue";
import StadisticTableBar from "components/utils/StadisticTableBar.vue";
import ComsumiblesForm from "components/productos/ConsumiblesForm.vue";
import { ref } from "vue";
const openedForm = ref(false);
const filtro = ref("");
const editando = ref(false);
const itemToEdit = ref(null);
const openConsumableForm = ref(false);

function editElement(object) {
  editando.value = true;
  itemToEdit.value = object;
  openedForm.value = true;
}
function resetForm() {
  editando.value = false;
  itemToEdit.value = null;
  openedForm.value = true;
}

const rows = ref([]);

const productosStore = useProductosStore();
const dataTableArray = ref([]);
dataTableArray.value = productosStore.productosDatabase;
</script>
