<template>
  <q-page class="flex justify-evenly content-center">
    <div class="q-gutter-md">
      <h6>Registro de prestamos</h6>
      <q-select
        outlined
        v-model="selectedDocumentType"
        :options="documentTypes"
        label="Tipo de documento"
      />
      <q-input
        outlined
        v-model="documentNumber"
        label="Número de documento"
        :rules="[numberRule]"
      />
      <q-btn
        @click="buscarCliente"
        color="positive"
        label="Buscar"
        class="q-mt-md"
      />
    </div>
    <div v-if="cliente">
      <q-item>
        <q-item-section top avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ cliente.nombre }}</q-item-label>
          <q-item-label caption>{{ cliente.numero_id }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="flex flex-center" clickable @click="addproductList">
        <q-icon name="add_circle" size="30px" color="primary"></q-icon>
      </q-item>
      <q-scroll-area style="height: 200px; max-width: 700px; width: 500px">
        <div
          class="flex q-my-lg"
          v-for="producto in productosList"
          :key="producto"
        >
          <AutocompleteInput :stringOptions="opciones" class="q-mx-sm" />
          <q-input v-model.number="cantidad" type="number" outlined />
        </div>
      </q-scroll-area>
      <q-input
        v-if="productosList.length > 0"
        label="Descripción"
        v-model="text"
        autogrow
        class="q-ma-sm"
        outlined
      />
      <q-btn
        v-if="productosList.length > 0"
        @click="prestarProducto"
        color="positive"
        label="Prestar"
        class="q-mt-md"
      />
    </div>
  </q-page>
</template>

<script setup>
import {
  collection,
  getDocs,
  getDocsFromCache,
  query,
  where,
} from "firebase/firestore";
import { db } from "src/firebaseInit";
import { ref, reactive, computed } from "vue";
import AutocompleteInput from "../utils/autocompleteInput.vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const productosList = ref([]);

function addproductList() {
  productosList.value.push({ producto: "", cantidad: 1 });
}

const selectedDocumentType = ref(null);
const documentNumber = ref(null);
const opciones = reactive(["Computador", "HDMI", "Cargador"]);
const cantidad = ref(1);
const cliente = ref(null);
const text = ref("");

async function buscarCliente() {
  $q.loading.show();
  const q = query(
    collection(db, "customers"),
    where("numero_id", "==", parseInt(documentNumber.value))
  );
  let docs = null;
  let docsFromCache = await getDocsFromCache(q);
  if (!docsFromCache.empty) {
    docs = docsFromCache;
  } else {
    const docsFromServer = await getDocs(q);
    docs = docsFromServer;
  }
  console.log(docs);
  const documents = [];

  docs.forEach((doc) => {
    documents.push(doc.data());
  });
  console.log(documents[0]);
  cliente.value = documents[0];
  if (cliente) {
    $q.loading.hide();
  }
}

const documentTypes = computed(() => {
  return ["C.C", "T.I", "C.E", "P.P"];
});

const numberRule = (val) => {
  // Validar que el campo contenga solo caracteres numéricos
  if (val.length > 6 && /^\d+$/.test(val)) {
    return true;
  }
  return "Este campo solo acepta caracteres numéricos mayores de 7 digitos";
};

const buscarDocumento = () => {
  // Aquí puedes realizar la acción de búsqueda utilizando los datos seleccionados en el formulario.
  // Por ejemplo, puedes mostrar una alerta con los datos ingresados para demostración:
  alert(
    `Tipo de documento: ${selectedDocumentType.value}\nNúmero de documento: ${documentNumber.value}`
  );
};
</script>
