<template>
  <StadisticTableBar :stadisticTableBarInfo="clientesStore.stadistics" />

  <q-dialog v-model="formOppened">
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="flex row justify-end q-pb-none">
        <q-btn dense round flat icon="close" v-close-popup style="width: 30px">
          <q-tooltip class="bg-white text-red">Cerrar</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section>
        <ClientesForm @clienteGuardado="formOppened = false" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <TableReuse
    :dataArray="clientesStore.clientesDatabase"
    :columns="clientesStore.columns"
    title="Tabla de clientes"
    :internalColumns="clientesStore.internalColumns"
    addText="Agregar Cliente"
    @add="formOppened = true"
  />
</template>

<script setup>
import StadisticTableBar from "components/utils/StadisticTableBar.vue";
import TableReuse from "components/utils/TableReuse.vue";
import { ref } from "vue";
import { UseClientesStore } from "stores/clientesStore";
import ClientesForm from "src/components/clientes/ClientesForm.vue";
import { data } from "autoprefixer";

const formOppened = ref(false);
const dataTableArray = ref([]);
const clientesStore = UseClientesStore();

clientesStore.listenChanges().then(() => {
  dataTableArray.value = clientesStore.clientesDatabase;
  console.log(clientesStore.clientesDatabase);
});
</script>

<style lang="scss" scoped></style>
