<template>
  <Qdialogo v-model="modalDevolucionIsOpen">
    <div class="flex flex-center">
      <q-avatar
        color="accent"
        text-color="white"
        icon="autorenew"
        size="70px"
        class="q-mb-lg"
      />
    </div>
    <div class="text-h5 q-mb-xl text-center">
      ¿Seguro que quiere devolver los siguientes items?
    </div>
    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 300px"
    >
      <q-item
        v-for="elemento in copySelectedRows"
        :key="elemento.index"
        class="shadow-3 q-my-lg"
      >
        <q-item-section side>
          <div class="flex flex-center">
            <q-avatar color="accent" size="40px" text-color="white">{{
              elemento.product[0]
            }}</q-avatar>
          </div>
        </q-item-section>
        <q-item-section caption>
          <div>
            {{ elemento.product }}
            {{ elemento.productId }}
          </div>
          <q-separator />
        </q-item-section>
        <q-item-section>
          <div class="flex flex-center">
            <q-btn
              icon="do_not_disturb_on"
              round
              color="red-5"
              @click="elemento.devolver--"
              :disable="elemento.devolver < 2"
            />
            <span class="text-subtitle2 q-mx-sm"
              ><span :class="elemento.quantity == 1 ? 'text-grey' : ''">{{
                elemento.devolver
              }}</span></span
            >
            <q-btn
              icon="add_circle"
              round
              color="primary"
              @click="elemento.devolver++"
              :disable="elemento.devolver == elemento.quantity"
            />
          </div>
        </q-item-section>
        <q-item-section side>
          <q-btn
            icon="delete"
            style="width: 50px"
            @click="deselectRow(elemento)"
          />
        </q-item-section>
      </q-item>
    </q-scroll-area>
    <q-btn
      class="q-mt-xl"
      icon="save"
      color="primary"
      style="width: 100%"
      label="Devolver Elementos"
      @click="devolver"
      :loading="guardando"
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

import { useDatabaseStore } from "src/stores/DatabaseStore";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "src/firebaseInit";
import { useProductosStore } from "src/stores/productosStore";

const selectedPrestamos = ref([]);
const copySelectedRows = ref([]);
const notasGeneralesDevolucion = ref("");
const modalDevolucionIsOpen = ref(false);
const databaseStore = useDatabaseStore();
const prestamosStore = UsePrestamosStore();
const clientesStore = UseClientesStore();
const productosStore = useProductosStore();
const route = useRoute();
const userId = ref(route.params.id);
const guardando = ref(false);
const loading = ref(false);
const router = useRouter();

const rows = databaseStore.escucharCambiosInternalCollection(
  prestamosStore,
  "customers",
  userId.value,
  "borrowings",
  "dateBorrowed",
  "allPersonDocs"
);
const verDetalles = (id) => {
  const producto = prestamosStore.allPersonDocs.find(
    (prestamo) => prestamo.docId == id
  );
  const productoId = producto.productId;
  router.push(`/productos/${productoId}`);
};

function devolver() {
  guardando.value = true;
  copySelectedRows.value.forEach(async (element) => {
    const docPrestamoRef = doc(db, "borrowings", element.prestamoId);
    let prestamo = await getDoc(docPrestamoRef);
    const estadoDevuelto =
      element.estadoDevuelto || element.estadoEntrega || "excelente";
    const notasDevolucion = element.notasDevolucion || "";
    const fechaDevolucion = new Date().getTime();

    //update prestamos
    const prestamoProductos = prestamo.data().productosList;
    prestamoProductos[element.indexLista].returnedQuantity =
      parseInt(prestamoProductos[element.indexLista].returnedQuantity) +
      parseInt(element.devolver);
    prestamoProductos[element.indexLista].returnedState = estadoDevuelto;

    prestamoProductos[element.indexLista].notasDevolucion = notasDevolucion;
    prestamoProductos[element.indexLista].fechaDevolucion = fechaDevolucion;

    await updateDoc(docPrestamoRef, {
      productosList: prestamoProductos,
      notasGeneralesDEvolucion: notasGeneralesDevolucion.value,
    });

    //update productos cantidad disponible

    const docProductoRef = doc(db, "products", element.productId);
    let productElement = productosStore.productosDatabase.find(
      (producto) => producto.docId == element.productId
    );
    const borrowedQuantity =
      parseInt(productElement.borrowedQuantity) - element.devolver;
    const data = {
      borrowedQuantity,
    };
    await updateDoc(docProductoRef, data);

    //update customers borrowings
    const docCustomerBorrowingRef = doc(
      db,
      "customers",
      userId.value.toString(),
      "borrowings",
      element.docId
    );

    await updateDoc(docCustomerBorrowingRef, {
      returnedQuantity: (element.returnedQuantity += parseInt(
        element.devolver
      )),
      fechaDevolucion,
      notasDevolucion,
      estadoDevuelto,
    });

    //update product borrowings
    const docProductBorrowingRef = doc(
      db,
      "products",
      element.productId,
      "borrowings",
      element.productoBorrowId
    );

    await updateDoc(docProductBorrowingRef, {
      returnedQuantity: (element.returnedQuantity += element.devolver),
      fechaDevolucion,
      notasDevolucion,
      estadoDevuelto,
    });

    modalDevolucionIsOpen.value = false;
    guardando.value = false;
  });
}

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

onMounted(async () => {
  loading.value = true;
  await prestamosStore.getPrestamosByPerson(userId.value).then(() => {
    loading.value = false;
  });
});

watch(
  () => route.params.id,
  async (toId, fromId) => {
    userId.value = toId;
    await prestamosStore.getPrestamosByPerson(toId);
  }
);
</script>
