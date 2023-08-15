<template>
  <StadisticTableBar :stadisticTableBarInfo="movimientosStore.stadistics" />

  <q-dialog v-model="formOppened" full-width>
    <q-card>
      <q-card-section class="flex row justify-end q-pb-none">
        <q-btn dense round flat icon="close" v-close-popup style="width: 30px">
          <q-tooltip class="bg-white text-red">Cerrar</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section>
        <movimiento-form @movimientoGuardado="formOppened = false" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <TableReuse
    :dataArray="movimientosStore.movimientosDatabase"
    :columns="movimientosStore.columns"
    title="Tabla de movimientos"
    :internalColumns="movimientosStore.internalColumns"
    addText="Agregar Movimiento"
    @add="formOppened = true"
  />
</template>

<script setup>
import MovimientoForm from "components/Movimientos/MovimientoForm.vue";
import StadisticTableBar from "components/utils/StadisticTableBar.vue";
import TableReuse from "components/utils/TableReuse.vue";
import { ref } from "vue";
import { UseMovimientosStore } from "stores/movimientosStore";

const formOppened = ref(false);
const dataTableArray = ref([]);
const movimientosStore = UseMovimientosStore();

movimientosStore.listenChanges().then(() => {
  dataTableArray.value = movimientosStore.movimientosDatabase;
});
</script>

<style lang="scss" scoped></style>
