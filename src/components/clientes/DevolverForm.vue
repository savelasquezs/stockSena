<template>
  {{ clienteReceptor }}
  <div class="text-h5 q-mb-xl text-center" v-if="tipoDev == 'devolucion'">
    ¿Seguro que quiere devolver los siguientes items?
  </div>
  <q-scroll-area style="height: 200px">
    <q-item
      v-for="elemento in listaElementos"
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
            :disable="
              elemento.devolver == elemento.quantity - elemento.returnedQuantity
            "
          />
        </div>
      </q-item-section>
      <q-item-section side>
        <q-btn
          icon="delete"
          style="width: 50px"
          @click="$emit('deselectRow', elemento)"
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
    v-if="tipoDev == 'devolucion'"
  />
  <q-btn
    class="q-mt-xl"
    icon="save"
    color="primary"
    style="width: 100%"
    label="Crear traspaso"
    @click="hacerTraspaso"
    :loading="guardando"
    v-else-if="tipoDev == 'cambioUser' && clienteReceptor.nombre"
  />
</template>

<script setup>
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "src/firebaseInit";
import { computed, ref } from "vue";
import { useProductosStore } from "src/stores/productosStore";
import { useRoute } from "vue-router";
import { UseClientesStore } from "src/stores/clientesStore";
import { data } from "autoprefixer";

const emit = defineEmits(["deselectRow", "devuelto"]);
const props = defineProps({ listaElementos: Array, tipoDev: String });
const guardando = ref(false);
const notasGeneralesDevolucion = ref("");
const route = useRoute();
const userId = ref(route.params.id);
const clientesStore = UseClientesStore();
const productosStore = useProductosStore();

const clienteReceptor = computed(() => {
  return clientesStore.currentCustomer;
});

const clienteEmisor = computed(() => {
  return productosStore.currentCustomer;
});

function dataToBorrow() {
  console.log(clientesStore.currentCustomer);
  let nuevaLista = [];
  const dueDate = new Date(
    new Date(new Date().toLocaleDateString()).getTime() + 23 * 60 * 60 * 1000
  );
  const dateBorrowed = new Date().getTime();
  props.listaElementos.forEach(async (element) => {
    console.log(element);
    const nuevoElemento = {
      barCode: element.barCode,
      dateBorrowed,
      descripcionProducto: element.descripcionProducto,
      dueDate,
      isConsumable: element.isConsumable,
      product: element.product,
      productId: element.productId,
      quantity: element.devolver,
      returnedQuantity: 0,
    };
    if (element.isConsumable) {
      nuevoElemento.unidadMedida = element.unidadMedida;
    } else {
      nuevoElemento.estadoEntrega =
        element.estadoEntrega || element.estadoFisico || "Excelente";
      nuevoElemento.custom = element.custom;
    }
    nuevaLista.push(dataToBorrow);
  });
  const dataToSave = {
    customerDocumentNumber: clientesStore.currentCustomer.numero_id,
    productosList: nuevaLista,
    customer: {
      documentNumber: clientesStore.currentCustomer.numero_id,
      name: clientesStore.currentCustomer.nombre,
      documentType: clientesStore.currentCustomer.tipoDoc,
    },
    description: notasGeneralesDevolucion,
    dateBorrowed,
  };
  console.log(dataToSave);
  return dataToSave;
}

async function prestarProducto() {
  const data = dataToBorrow();

  data.productosList.forEach(async (product) => {
    const docref = doc(db, "products", product.productId);
    await updateDoc(docref, {
      borrowedQuantity:
        parseInt(product.borrowedQuantity) + parseInt(product.prestar),
    });
  });

  await addDoc(collection(db, "borrowings"), data).then((prestamo) => {
    const clienteDocRef = doc(
      db,
      "customers",
      clientesStore.currentCustomer.numero_id
    );
    data.productosList.forEach(async (producto, indexLista) => {
      const productoDocRef = doc(db, "products", producto.productId);
      const dataToProductos = {
        indexLista,
        diaPrestamo: producto.dateBorrowed,
        cantidadPrestada: producto.quantity,
        customer: {
          documentNumber: clientesStore.currentCustomer.numero_id,
          name: clientesStore.currentCustomer.nombre,
          documentType: clientesStore.currentCustomer.tipoDoc,
        },
      };
      if (!producto.isConsumable) {
        dataToProductos.estadoEntrega = producto.estadoEntrega;
      }
      const productoref = await addDoc(
        collection(productoDocRef, "borrowings"),
        dataToProductos
      );
      await addDoc(collection(clienteDocRef, "borrowings"), {
        nombreEmisorTraspaso: clienteEmisor.value.nombre,
        docEmisorTraspaso: clienteEmisor.value.numero_id,
        productoBorrowId: productoref.id,
        indexLista,
        prestamoId: prestamo.id,
        ...producto,
      });
    });
  });
}

async function devolver() {
  guardando.value = true;
  props.listaElementos.forEach(async (element) => {
    console.log(element);
    const nuevoElemento = {
      barCode: element.barCode,
      dateBorrowed: new Date().getTime(),
      descripcionProducto: element.descripcionProducto,
      dueDate: new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
          23 * 60 * 60 * 1000
      ),
      isConsumable: element.isConsumable,
      product: element.product,
      productId: element.productId,
      quantity: element.devolver,
      returnedQuantity: 0,
    };
    if (element.isConsumable) {
      nuevoElemento.unidadMedida = element.unidadMedida;
    } else {
      nuevoElemento.estadoEntrega =
        element.estadoEntrega || element.estadoFisico || "Excelente";
      nuevoElemento.custom = element.custom;
    }
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
  });
  guardando.value = false;
  emit("devuelto");
}

async function hacerTraspaso() {
  guardando.value = true;

  await devolver();
  await prestarProducto();
  guardando.value = false;
  emit("devuelto");
}
</script>

<style lang="scss" scoped></style>
