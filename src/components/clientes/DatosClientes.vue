<template>
  <PersonalInfo />
  {{ selectedPrestamos }}

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
    />
  </Qdialogo>

  <SimpleTable
    :agregarElementoLabel="selectedPrestamos.length > 0 ? 'Devolver' : null"
    @agregando="openDevolverModal"
    :rows="prestamosStore.allPersonDocs"
    :columns="clientesStore.columnsPrestamosPersona"
    seleccionar="true"
    @cambioSelected="(value) => (selectedPrestamos = value)"
  />
</template>

<script setup>
import PersonalInfo from "components/clientes/PersonalInfo.vue";
import SimpleTable from "components/utils/SimpleTable.vue";
import { UseClientesStore } from "src/stores/clientesStore";
import Qdialogo from "components/utils/QDialogo.vue";

import { useDatabaseStore } from "src/stores/DatabaseStore";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "src/firebaseInit";
import { useProductosStore } from "src/stores/productosStore";

const selectedPrestamos = ref([]);
const copySelectedRows = ref([]);
const modalDevolucionIsOpen = ref(false);
const databaseStore = useDatabaseStore();
const prestamosStore = UsePrestamosStore();
const clientesStore = UseClientesStore();
const productosStore = useProductosStore();

function devolver() {
  copySelectedRows.value.forEach(async (element) => {
    let prestamoElement = prestamosStore.allborrowingsPerson.find(
      (prestamo) => prestamo.docId == element.prestamoId
    );
    prestamoElement.productosList[element.indexPrestamo].returnedQuantity =
      prestamoElement.productosList[element.indexPrestamo].returnedQuantity +
      element.devolver;

    const docref = doc(db, "borrowings", element.prestamoId);
    await updateDoc(docref, { productosList: prestamoElement.productosList });

    let productElement = productosStore.productosDatabase.find(
      (producto) => producto.docId == element.productId
    );
    console.log(productElement);
    const data = {
      borrowedQuantity:
        parseInt(productElement.borrowedQuantity) - element.devolver,
    };

    const docrefProduct = doc(db, "products", productElement.docId);
    await updateDoc(docrefProduct, data);

    modalDevolucionIsOpen.value = false;
    console.log(prestamoElement);
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
    return { ...prestamo, devolver: prestamo.quantity };
  });
  modalDevolucionIsOpen.value = true;
}

const route = useRoute();
const userId = ref(route.params.id);

onMounted(async () => {
  await prestamosStore.getPrestamosByPerson(userId.value);
});

watch(
  () => route.params.id,
  (toId, fromId) => {
    userId.value = toId;
  }
);
</script>
