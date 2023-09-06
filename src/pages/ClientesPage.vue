<!-- Fecha documentacion 5/09/2023 -->
<!-- Este componente Vue.js se utiliza para mostrar estadísticas y una tabla de clientes, 
  permitiendo agregar nuevos clientes mediante un formulario en una ventana emergente 
  y ver detalles de clientes individuales. La interacción con la tienda Vuex clientesStore
  se utiliza para mantener los datos actualizados. -->
<template>
  <StadisticTableBar :stadisticTableBarInfo="clientesStore.stadistics" />
  <!-- Se crea una variable reactiva llamada formOppened para controlar la apertura y cierre de la ventana emergente de formulario. -->
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
  <!-- Boton con funcionalidad a visualizar las caracteristicas de los productos
  ingresados -->
  <SimpleTable
    agregarElementoLabel="Agregar Usuario"
    @agregando="formOppened = true"
    :rows="clientesStore.clientesDatabase"
    :columns="clientesStore.columns"
    @viendo="verDetalles"
  />
</template>
<!-- Se importa el componente StadisticTableBar, así como otros componentes relacionados, 
como ClientesForm y SimpleTable.Se importa el componente StadisticTableBar, 
así como otros componentes relacionados, como ClientesForm y SimpleTable. -->

<script setup>
import StadisticTableBar from "components/utils/StadisticTableBar.vue";
import TableReuse from "components/utils/TableReuse.vue";
import { ref } from "vue";
import { UseClientesStore } from "stores/clientesStore";
import ClientesForm from "src/components/clientes/ClientesForm.vue";
import { data } from "autoprefixer";
import SimpleTable from "components/utils/SimpleTable.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const formOppened = ref(false);
const dataTableArray = ref([]);
const clientesStore = UseClientesStore();
// verDetalles(id) es una función que se utiliza para redirigir al usuario a la
// página de detalles de un cliente específico cuando se hace clic en un cliente en
// la tabla. La función utiliza el enrutador Vue para navegar a la ruta correspondiente.
function verDetalles(id) {
  router.push(`clientes/${id}`);
}
clientesStore.listenChanges().then(() => {
  dataTableArray.value = clientesStore.clientesDatabase;
  console.log(clientesStore.clientesDatabase);
});
</script>

<style lang="scss" scoped></style>
