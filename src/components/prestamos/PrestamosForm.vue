<template>
  <div>
    <div class="flex column flex-center">
      <q-avatar
        icon="real_estate_agent"
        color="accent"
        text-color="white"
        class="text-center"
      />
      <h3 class="text-h6 text-center">Registro de préstamos</h3>
    </div>
    <div class="" v-if="!cliente">
      <q-select
        outlined
        v-model="selectedDocumentType"
        :options="documentTypes"
        label="Tipo de documento"
        required
      />
      <q-input
        outlined
        v-model="documentNumber"
        label="Número de documento"
        :rules="[numberRule]"
        class="q-my-sm"
      />
      <q-btn
        @click="buscarCliente"
        color="positive"
        label="Buscar"
        class="q-mt-md"
        style="width: 250px"
      />
    </div>
    <q-form @submit="prestarProducto" v-if="cliente">
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
        <q-item-section>
          <q-item-label>Rol</q-item-label>
          <q-item-label caption>{{ cliente.rol }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>Area</q-item-label>
          <q-item-label caption>{{ cliente.area }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="flex flex-center" clickable @click="addproductList">
        <q-icon name="add_circle" size="30px" color="primary"></q-icon>
      </q-item>
      <q-scroll-area
        style="height: 200px; max-width: 700px; width: 500px"
        visible
      >
        <div
          class="flex q-my-sm"
          v-for="(producto, index) in productosList"
          :key="producto"
        >
          <AutocompleteInput
            :stringOptions="productosStore.productosNombres"
            class="q-mx-sm"
            @cambioModel="(nombreProducto) => setProduct(nombreProducto, index)"
          />

          <q-input
            type="number"
            outlined
            style="width: 150px"
            :disable="producto.maxQuantity == 0"
            v-model="producto.cantidad"
            :hint="
              producto.maxQuantity == 0
                ? '😔 No tenemos Stock de este producto'
                : ''
            "
            :rules="[
              (value) => value > 0 || 'La cantida debe ser mayor a 0',

              (value) =>
                value <= producto.maxQuantity ||
                `Solo contamos con ${producto.maxQuantity} unidades`,
            ]"
            :max="producto.maxQuantity"
          />

          <q-item
            clickable
            dense
            class="items-center"
            style="height: 56px"
            @click="deleteProductList(index)"
          >
            <q-icon name="delete" size="24px" color="red-8"></q-icon>
          </q-item>
        </div>
      </q-scroll-area>
      <q-input
        v-if="productosList.length > 0"
        label="Descripción"
        v-model="description"
        autogrow
        class="q-ma-sm"
        outlined
      />
      <q-btn
        v-if="productosList.length > 0"
        color="positive"
        type="submit"
        label="Prestar"
        class="q-mt-md"
        :loading="guardandoPrestamo"
      />
    </q-form>
  </div>
</template>

<script setup>
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDocsFromCache,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "src/firebaseInit";
import { ref, reactive, computed } from "vue";
import AutocompleteInput from "../utils/autocompleteInput.vue";
import { useQuasar } from "quasar";
import { useProductosStore } from "src/stores/productosStore";
import { data } from "autoprefixer";
import { useRouter } from "vue-router";

const emit = defineEmits(["prestamoGuardado"]);
const guardandoPrestamo = ref(false);
const router = useRouter();

const $q = useQuasar();
const productosStore = useProductosStore();
const productosList = ref([]);

function addproductList() {
  productosList.value.unshift({ producto: "", cantidad: 1 });
}
function deleteProductList(index) {
  productosList.value.splice(index, 1);
}

function setProduct(nombreProducto, index) {
  if (
    productosList.value.some((registro) => registro.producto == nombreProducto)
  ) {
    alert("Ya existe este producto en tu lista de prestamos");
    deleteProductList(index);
    return;
  }
  productosList.value[index].producto = nombreProducto;
  const producto = productosStore.productosDatabase.find(
    (producto) => producto.nombre == nombreProducto
  );

  if (producto.isConsumable) {
    productosList.value[index].unidadMedida = producto.unidadMedida;
  } else {
    productosList.value[index].estadoEntrega = producto.estadoFisico;
    productosList.value[index].custom = producto.custom;
  }
  productosList.value[index].maxQuantity =
    producto.stockTotal - producto.borrowedQuantity;
  productosList.value[index].docId = producto.docId;
  productosList.value[index].isConsumable = producto.isConsumable;
  productosList.value[index].cantidadPrestada = producto.borrowedQuantity;
}

const selectedDocumentType = ref(null);
const documentNumber = ref(null);
const cliente = ref(null);
const description = ref("");

async function buscarCliente() {
  $q.loading.show();
  const q = query(
    collection(db, "customers"),
    where("numero_id", "==", documentNumber.value)
  );
  let docs = null;
  let docsFromCache = await getDocsFromCache(q);
  if (!docsFromCache.empty) {
    docs = docsFromCache;
  } else {
    const docsFromServer = await getDocs(q);
    docs = docsFromServer;
  }
  const documents = [];

  docs.forEach((doc) => {
    documents.push(doc.data());
  });
  cliente.value = documents[0];

  $q.loading.hide();
  if (!cliente.value) {
    $q.dialog({
      title: "Alerta",
      message: "El usuario no existe, ¿Desea registrarlo?",

      cancel: {
        label: "cancelar",
        push: true,
      },
      ok: {
        label: "Registrar",
        push: true,
      },
    });
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

function prestarProducto() {
  guardandoPrestamo.value = true;
  const dateBorrowed = new Date().getTime();
  const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const dueDate = new Date(dateBorrowed + sevenDaysInMilliseconds).getTime();
  const listaProductos = productosList.value.map((registro) => {
    const data = {
      productId: registro.docId,
      product: registro.producto,
      quantity: registro.cantidad,
      isConsumable: registro.isConsumable,
      dateBorrowed,
      dueDate,
      returnedQuantity: 0,
    };
    if (registro.isConsumable) {
      data.unidadMedida = registro.unidadMedida;
    } else {
      data.estadoEntrega = registro.estadoEntrega;
      data.custom = registro.custom;
    }
    return data;
  });
  const data = {
    customerDocumentNumber: documentNumber.value,
    productosList: listaProductos,
    customer: {
      documentNumber: documentNumber.value,
      name: cliente.value.nombre,
      documentType: selectedDocumentType.value,
    },
    description: description.value,
    dateBorrowed,
  };

  productosList.value.forEach(async (product) => {
    const docref = doc(db, "products", product.docId);
    await updateDoc(docref, {
      borrowedQuantity:
        parseInt(product.cantidadPrestada) + parseInt(product.cantidad),
    });
  });

  addDoc(collection(db, "borrowings"), data).then((prestamo) => {
    const clienteDocRef = doc(db, "customers", documentNumber.value);
    listaProductos.forEach(async (producto, indexLista) => {
      const productoDocRef = doc(db, "products", producto.productId);
      const dataToProductos = {
        indexLista,
        diaPrestamo: producto.dateBorrowed,
        cantidadPrestada: producto.quantity,
        customer: {
          documentNumber: documentNumber.value,
          name: cliente.value.nombre,
          documentType: selectedDocumentType.value,
        },
      };
      if (!producto.isConsumable) {
        dataToProductos.estadoEntrega = producto.estadoEntrega;
      }
      const productoref = await addDoc(
        collection(productoDocRef, "borrowings"),
        dataToProductos
      );
      addDoc(collection(clienteDocRef, "borrowings"), {
        productoBorrowId: productoref.id,
        indexLista,
        prestamoId: prestamo.id,
        ...producto,
      }).then((resultado) => {});
    });

    emit("prestamoGuardado");
    $q.notify({
      message: "Pedido Guardado exitosamente",
      color: "accent",
    });
  });
}
</script>
