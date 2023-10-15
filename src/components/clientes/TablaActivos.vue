<template>
  <Qdialogo v-model="modalDevolucionIsOpen" iconModal="autorenew">
    <TraspasoForm v-if="tipoDev == 'cambioUser'" />

    <DevolverForm
      v-if="tipoDev"
      :tipoDev="tipoDev"
      :listaElementos="copySelectedRows"
      :clienteReceptor="clientesStore.currentCustomer"
      :clienteEmisor="prestamosStore.currentCustomer"
      @deselectRow="deselectRow"
      @devuelto="devolver"
    />
  </Qdialogo>

  <Qdialogo v-model="modalCambiarFechaOpen" iconModal="today">
    <div class="flex flex-center column">
      <div class="text-h5">Cambiar fecha limite de entrega</div>
      <ProductMainInfo
        :product="cambiarFechaProducto"
        noAvatar
        class="shadow-1 bg-grey-2"
      />
      <q-form @submit="cambiarFecha">
        <q-input
          filled
          v-model="nuevaFechaLimite"
          label="Fecha limite"
          mask="##/##/####"
          unmasked-value
          hint="formato: dd/mm/aaaa"
          :rules="rules"
          class="q-ma-xl"
        >
          <template v-slot:prepend>
            <DatePicker
              options
              @guardarFecha="(fecha) => (nuevaFechaLimite = fecha)"
            />
          </template>
        </q-input>
        <q-btn label="Cambiar fecha" type="submit" style="width: 100%" />
      </q-form>
    </div>
  </Qdialogo>

  <SimpleTable
    @viendo="verDetalles"
    :segundoBotonActivo="selectedPrestamos.length > 0"
    @segundoBotonClicked="openDevolverModal('traspaso')"
    segundoBotonLabel="Traspasar"
    customDetail
    :loading="loading"
    :agregarElementoLabel="selectedPrestamos.length > 0 ? 'Devolver' : null"
    @agregando="openDevolverModal('devolucion')"
    :rows="prestamosStore.activeBorrowings"
    seleccionar
    :columns="clientesStore.columnsPrestamosPersona"
    @cambioSelected="(value) => (selectedPrestamos = value)"
    @editando="editarPrestamo"
  />
</template>

<script setup>
import { Notify } from "quasar";
import SimpleTable from "components/utils/SimpleTable.vue";
import { UseClientesStore } from "src/stores/clientesStore";
import Qdialogo from "components/utils/QDialogo.vue";
import TraspasoForm from "components/clientes/TraspasoForm.vue";

import { useDatabaseStore } from "src/stores/DatabaseStore";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProductMainInfo from "components/productos/ProductMainInfo.vue";

import DevolverForm from "components/clientes/DevolverForm.vue";
import DatePicker from "components/utils/DatePicker.vue";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "src/firebaseInit";
import { UseUtilsStore } from "src/stores/utilsStore";
const selectedPrestamos = ref([]);
const copySelectedRows = ref([]);

const modalDevolucionIsOpen = ref(false);
const databaseStore = useDatabaseStore();
const prestamosStore = UsePrestamosStore();
const clientesStore = UseClientesStore();
const guardando = ref(false);
const loading = ref(false);
const router = useRouter();
const emit = defineEmits(["devuelto"]);
const tipoDev = ref("devolucion");
const cambiarFechaProducto = ref({});
const nuevaFechaLimite = ref(null);

const modalCambiarFechaOpen = ref(false);

const route = useRoute();

const rules = [
  (v) => !!v || "Este campo es obligatorio",
  (v) =>
    validarFecha(v) || "Formato de fecha incorrecto o no es del año actual",
];

const validarFecha = (inputDate) => {
  console.log(inputDate);
  const today = new Date();
  const currentYear = today.getFullYear();
  const regex = /^(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])\d{4}$/;

  if (inputDate.match(regex)) {
    console.log("pasa");

    const string = inputDate.toString();
    const day = string.substring(0, 2);
    const month = string.substring(2, 4);
    const year = string.substring(4, 8);

    const inputYear = parseInt(year, 10);

    if (inputYear === currentYear) {
      const inputMonth = parseInt(month, 10) - 1;
      const inputDay = parseInt(day, 10);
      const inputDateObj = new Date(inputYear, inputMonth, inputDay);

      if (
        inputDateObj.getFullYear() === inputYear &&
        inputDateObj.getMonth() === inputMonth &&
        inputDateObj.getDate() === inputDay
      ) {
        return true;
      }
    }
  }
  return false;
};

function editarPrestamo(item) {
  cambiarFechaProducto.value = item;
  nuevaFechaLimite.value = new Date(item.dueDate).toLocaleDateString("es-CL");
  modalCambiarFechaOpen.value = true;
}

const userId = computed(() => {
  const id = route.params.id;
  console.log(prestamosStore.currentCustomer);
  return id ? id : prestamosStore.currentCustomer.numero_id;
});

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

function convertDateFormat(string) {
  const splitter = string.includes("-") ? "-" : "/";
  var info = string.split(splitter).reverse().join("/");

  return info;
}

function cambiarFecha() {
  if (
    nuevaFechaLimite.value !=
    new Date(cambiarFechaProducto.value.dueDate).toLocaleDateString("es-CL")
  ) {
    const string = nuevaFechaLimite.value.toString();
    console.log(string);
    nuevaFechaLimite.value =
      string.substring(0, 2) +
      "/" +
      string.substring(2, 4) +
      "/" +
      string.substring(4, 8);
  }
  const nuevaFecha = convertDateFormat(nuevaFechaLimite.value);
  const nuevaFechaNumber = new Date(nuevaFecha).getTime();
  const docRef = doc(
    db,
    "customers",
    prestamosStore.currentCustomer.numero_id,
    "borrowings",
    cambiarFechaProducto.value.docId
  );
  updateDoc(docRef, { dueDate: nuevaFechaNumber, enMora: false });
  modalCambiarFechaOpen.value = false;
}

function openDevolverModal(tipo) {
  console.log(selectedPrestamos.value);
  if (
    tipo == "traspaso" &&
    selectedPrestamos.value.some((producto) => producto.enMora)
  ) {
    UseUtilsStore().notifyError(
      "No puedes hacer traspasos de productos en Mora"
    );
    return;
  }
  copySelectedRows.value = selectedPrestamos.value.map((prestamo) => {
    return {
      ...prestamo,
      devolver: prestamo.returnedQuantity
        ? prestamo.quantity - prestamo.returnedQuantity
        : prestamo.quantity,
      consumido: 0,
    };
  });

  if (tipo == "traspaso") {
    tipoDev.value = "cambioUser";
  }

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
  (toId) => {
    userId.value = toId;
    prestamosStore.getPrestamosByPerson(toId);
  }
);
watch(modalDevolucionIsOpen, (newValue) => {
  if (!newValue) {
    tipoDev.value = null;
    clientesStore.currentCustomer = {};
    emit("devuelto");
  }
});
</script>
