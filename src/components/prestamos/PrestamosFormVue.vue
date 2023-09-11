<template>
  <InputClienteSearch v-if="!cliente.nombre" />

  <div v-else>
    <PersonalInfo />
    <SearchProducts @productSelected="agregarProducto" />

    <div class="q-pa-md">
      <q-scroll-area
        style="height: 200px"
        class="shadow-1"
        v-if="productosList.length > 0"
      >
        <ExpansionItem
          :productosList="productosList"
          @deselectElement="deselectRow"
        />
      </q-scroll-area>
      <div v-if="productosList.length > 0">
        <q-input
          label="Notas del prestamo"
          v-model="generalDescription"
          autogrow
          class="q-ma-sm"
          outlined
        />
        <q-btn
          color="accent"
          @click="prestarProducto"
          label="Prestar"
          class="q-mt-md"
          :loading="guardandoPrestamo"
          style="width: 100%"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import SearchProducts from "components/prestamos/SearchProducts.vue";
import { computed, onBeforeUnmount, ref } from "vue";
import PersonalInfo from "components/clientes/PersonalInfo.vue";
import { useRoute } from "vue-router";
import { useProductosStore } from "src/stores/productosStore";
import DatePicker from "components/utils/DatePicker.vue";
import CustomPropertiesTable from "components/productos/CustomPropertiesTable.vue";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "src/firebaseInit";
import ExpansionItem from "components/prestamos/ExpansionItem.vue";
import InputClienteSearch from "components/prestamos/InputClienteSearch.vue";
import { UseUtilsStore } from "src/stores/utilsStore";
const productosList = ref([]);
const $q = useQuasar();
const prestamosStore = UsePrestamosStore();
const productosStore = useProductosStore();
const generalDescription = ref("");
const guardandoPrestamo = ref(false);
const utils = UseUtilsStore();

const emit = defineEmits(["prestamoGuardado"]);
function deselectRow(id) {
  console.log(id);
  productosList.value = productosList.value.filter(
    (producto) => producto.docId != id
  );
}
const cliente = computed(() => {
  console.log(prestamosStore.currentCustomer);
  return prestamosStore.currentCustomer;
});

function agregarProducto(producto) {
  if (
    productosList.value.some((elemento) => elemento.docId == producto.docId)
  ) {
    utils.notifyError("Este producto ya esta en tu lista");
    return;
  }
  console.log(producto);
  if (producto.stockTotal - producto.borrowedQuantity <= 0) {
    utils.notifyError("Lo sentimos, no tenemos mas disponibles");
    return;
  }
  productosList.value.unshift({
    ...producto,
    prestar: 1,
    fechaEntrega: new Date().toLocaleDateString("es-CO"),
  });
  console.log(productosList.value);
}

function datosPreparados() {
  guardandoPrestamo.value = true;
  const dateBorrowed = new Date().getTime();
  const listaProductos = productosList.value.map((registro) => {
    let separador = registro.fechaEntrega.includes("-") ? "-" : "/";
    const fechaEntregaArray = registro.fechaEntrega.split(separador);
    registro.fechaEntrega =
      fechaEntregaArray[1] +
      "-" +
      fechaEntregaArray[0] +
      "-" +
      fechaEntregaArray[2];
    const milisecondsDay = 23 * 60 * 60 * 1000;
    const data = {
      productId: registro.docId,
      product: registro.nombre,
      quantity: registro.prestar,
      isConsumable: registro.isConsumable,
      barCode: registro.codigoBarra,
      dateBorrowed,
      dueDate: new Date(registro.fechaEntrega).getTime() + milisecondsDay,
      descripcionProducto: registro.notas || registro.descripcion || "",
      returnedQuantity: 0,
    };
    if (registro.isConsumable) {
      data.unidadMedida = registro.unidadMedida;
    } else {
      data.estadoEntrega = registro.estadoEntrega || registro.estadoFisico;
      data.custom = registro.custom;
    }
    return data;
  });
  const dataToSave = {
    customerDocumentNumber: cliente.value.numero_id,
    productosList: listaProductos,
    customer: {
      documentNumber: cliente.value.numero_id,
      name: `${cliente.value.nombre} ${cliente.value.apellido}`,
      documentType: cliente.value.tipoDoc,
      rol: cliente.value.rol,
    },
    description: generalDescription.value,
    dateBorrowed,
  };
  console.log(dataToSave);
  return dataToSave;
}

const route = useRoute();
onBeforeUnmount(() => {
  const rutaCompleta = route.path.split("/");
  if (!(rutaCompleta.length > 2 && !!Number(rutaCompleta[2]))) {
    console.log("si es esta");
    prestamosStore.resetCurrentCustomer();
  }
});

function prestarProducto() {
  const data = datosPreparados();

  productosList.value.forEach(async (product) => {
    const docref = doc(db, "products", product.docId);
    await updateDoc(docref, {
      borrowedQuantity:
        parseInt(product.borrowedQuantity) + parseInt(product.prestar),
    });
  });

  addDoc(collection(db, "borrowings"), data).then((prestamo) => {
    const clienteDocRef = doc(db, "customers", cliente.value.numero_id);
    data.productosList.forEach(async (producto, indexLista) => {
      const productoDocRef = doc(db, "products", producto.productId);
      const dataToProductos = {
        indexLista,
        diaPrestamo: producto.dateBorrowed,
        cantidadPrestada: producto.quantity,
        customer: {
          documentNumber: cliente.value.numero_id,
          name: `${cliente.value.nombre} ${cliente.value.apellido}`,
          documentType: cliente.value.tipoDoc,
          rol: cliente.value.rol,
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

<style lang="scss" scoped></style>
