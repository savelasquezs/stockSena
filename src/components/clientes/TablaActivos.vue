<template>
  <Qdialogo v-model="modalDevolucionIsOpen" iconModal="autorenew">
    <div class="flex flex-center column">
      <div class="text-h6">Que quieres hacer hoy?</div>
      <q-separator />
      <div>
        <q-radio
          v-model="tipoDev"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="devolucion"
          label="Una devolución"
        />
        <q-radio
          v-model="tipoDev"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="cambioUser"
          label="Traspasar productos a otro usuario"
        />
      </div>
    </div>
    <TraspasoForm v-if="tipoDev == 'cambioUser'" />

    <DevolverForm
      v-if="tipoDev"
      :tipoDev="tipoDev"
      :listaElementos="copySelectedRows"
      @deselectRow="deselectRow"
      @devuelto="devolver"
    />
  </Qdialogo>

  <SimpleTable
    @viendo="verDetalles"
    customDetail
    :loading="loading"
    :agregarElementoLabel="selectedPrestamos.length > 0 ? 'Devolver' : null"
    @agregando="openDevolverModal"
    :rows="
      prestamosStore.allPersonDocs.filter(
        (prestamo) => prestamo.returnedQuantity < prestamo.quantity
      )
    "
    seleccionar
    :columns="clientesStore.columnsPrestamosPersona"
    @cambioSelected="(value) => (selectedPrestamos = value)"
  />
</template>

<script setup>
import SimpleTable from "components/utils/SimpleTable.vue";
import { UseClientesStore } from "src/stores/clientesStore";
import Qdialogo from "components/utils/QDialogo.vue";
import TraspasoForm from "components/clientes/TraspasoForm.vue";

import { useDatabaseStore } from "src/stores/DatabaseStore";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import DevolverForm from "components/clientes/DevolverForm.vue";

const selectedPrestamos = ref([]);
const copySelectedRows = ref([]);

const modalDevolucionIsOpen = ref(false);
const databaseStore = useDatabaseStore();
const prestamosStore = UsePrestamosStore();
const clientesStore = UseClientesStore();

const route = useRoute();
const userId = ref(route.params.id);
const guardando = ref(false);
const loading = ref(false);
const router = useRouter();
const emit = defineEmits(["devuelto"]);
const tipoDev = ref(null);

const rows = databaseStore.escucharCambiosInternalCollection(
  prestamosStore,
  "customers",
  userId.value,
  "borrowings",
  "dateBorrowed",
  "allPersonDocs"
);

function devolver() {
  emit("devuelto");
  modalDevolucionIsOpen.value = false;
}
const verDetalles = (id) => {
  const producto = prestamosStore.allPersonDocs.find(
    (prestamo) => prestamo.docId == id
  );
  const productoId = producto.productId;
  router.push(`/productos/${productoId}`);
};

function deselectRow(row) {
  // Find the index of the row in the selected array
  copySelectedRows.value = copySelectedRows.value.filter(
    (item) => item !== row
  );
  if (copySelectedRows.value.length == 0) modalDevolucionIsOpen.value = false;
}

function openDevolverModal() {
  copySelectedRows.value = selectedPrestamos.value.map((prestamo) => {
    return {
      ...prestamo,
      devolver: prestamo.returnedQuantity
        ? prestamo.quantity - prestamo.returnedQuantity
        : prestamo.quantity,
    };
  });
  modalDevolucionIsOpen.value = true;
}

(async () => {
  loading.value = true;
  await prestamosStore.getPrestamosByPerson(userId.value).then(() => {
    loading.value = false;
  });
})();

watch(
  () => route.params.id,
  async (toId, fromId) => {
    userId.value = toId;
    await prestamosStore.getPrestamosByPerson(toId);
  }
);
watch(modalDevolucionIsOpen, (newValue) => {
  if (!newValue) {
    tipoDev.value = null;
    clientesStore.currentCustomer = {};
  }
});
</script>
