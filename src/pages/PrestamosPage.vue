<template>
  <div style="background-color: #f5f5f5">
    <div class="q-pa-md">
      <stadisticTableBar
        :stadisticTableBarInfo="prestamosStore.stadisticTableBarInfo"
      />
    </div>

    <q-dialog v-model="openedForm">
      <q-card>
        <q-card-section class="row justify-end q-pb-none">
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <prestamos-form @prestamoGuardado="openedForm = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <TableReuse
      :dataArray="prestamosStore.prestamosDatabase"
      :columns="prestamosStore.columns"
      title="Tabla de Prestamos"
      :internalColumns="prestamosStore.internalColumns"
      @add="openedForm = true"
      tablaUrl="productos"
      buscarPorFecha
      table="borrowings"
    />
  </div>
</template>
<script setup>
import { UsePrestamosStore } from "src/stores/prestamosStore";
import stadisticTableBar from "components/utils/StadisticTableBar.vue";
import PrestamosForm from "components/prestamos/PrestamosForm.vue";
import TableReuse from "components/utils/TableReuse.vue";

import { ref } from "vue";

const openedForm = ref(false);
const prestamosStore = UsePrestamosStore();
const dataTableArray = ref([]);

prestamosStore.listenChanges().then(() => {
  dataTableArray.value = prestamosStore.prestamosDatabase;
});
</script>
