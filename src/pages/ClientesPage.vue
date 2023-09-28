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
        <ClientesForm
          @clienteGuardado="formOppened = false"
          :editando="editando"
          :clienteEdit="clienteEdit"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

  <SimpleTable
    agregarElementoLabel="Agregar Usuario"
    @agregando="agregarCliente"
    :rows="clientesStore.clientesDatabase"
    :columns="clientesStore.columns"
    @editando="editarCliente"
    editable
    tablaUrl="clientes"
  />
</template>

<script setup>
import StadisticTableBar from "components/utils/StadisticTableBar.vue";
import TableReuse from "components/utils/TableReuse.vue";
import { ref } from "vue";
import { UseClientesStore } from "stores/clientesStore";
import ClientesForm from "src/components/clientes/ClientesForm.vue";
import { data } from "autoprefixer";
import SimpleTable from "components/utils/SimpleTable.vue";
import { useRouter } from "vue-router";
import { useDatabaseStore } from "src/stores/DatabaseStore";

const router = useRouter();
const editando = ref(false);
const formOppened = ref(false);

const clientesStore = UseClientesStore();
const databaseStore = useDatabaseStore();
const clienteEdit = ref({});

function agregarCliente() {
  clienteEdit.value = null;
  editando.value = false;
  formOppened.value = true;
}

function editarCliente(cliente) {
  editando.value = true;
  clienteEdit.value = cliente;
  formOppened.value = true;
}

clientesStore.listenChanges();

//-----------------------------------------
</script>

<style lang="scss" scoped></style>
