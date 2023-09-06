<template>
  <div class="flex flex-center">
    <q-avatar
      icon="real_estate_agent"
      color="accent"
      text-color="white"
      class="text-center"
    />
  </div>
  <div v-if="!cliente.nombre">
    <h3 class="text-h6 text-center">Ingresa un documento de identidad</h3>
    <q-input
      color="teal"
      filled
      v-model="documento"
      label="Documento"
      type="number"
      @change="buscarCliente"
    >
      <template v-slot:prepend>
        <q-icon name="person_search" />
      </template>
      <template v-slot:append>
        <q-btn icon="search" @click="buscarCliente" round />
      </template>
    </q-input>
  </div>
  <div v-else>
    <PersonalInfo />

    <div class="flex justify-evenly q-ma-md shadow-1 q-pa-md">
      <div>
        <q-item>
          <q-item-section avatar>
            <q-icon color="accent" size="3rem">
              <DevolutivosIcon />
            </q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>Prestar producto Devolutivo</q-item-label>
          </q-item-section>
        </q-item>
        <q-input
          bottom-slots
          v-model="devolutivoSearch"
          label="Codigo de barras"
          counter
          @change="setDevolutivo"
        >
          <template v-slot:append>
            <q-icon
              name="close"
              @click="devolutivoSearch = ''"
              class="cursor-pointer"
            />
          </template>

          <template v-slot:hint>
            <span> Codigo de barras producto devolutivo </span>
          </template>
        </q-input>
      </div>
      <q-separator vertical />
      <div>
        <q-item>
          <q-item-section avatar>
            <q-icon color="accent" size="3rem">
              <ConsumiblesIcon />
            </q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>Prestar producto Consumible</q-item-label>
          </q-item-section>
        </q-item>
        <AutocompleteInput
          hint="Busca el nombre del producto"
          :stringOptions="productosStore.nameColumnsConsumibles"
          @cambioModel="setConsumible"
          v-model="consumibleSelected"
        />
      </div>
    </div>
    <div class="q-pa-md">
      <q-scroll-area style="height: 300px" class="shadow-1">
        <div v-for="(producto, index) in productosList" :key="index">
          <q-expansion-item expand-icon-toggle expand-separator>
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar color="accent" text-color="white">{{
                  producto.nombre[0]
                }}</q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ producto.nombre }}</q-item-label>
                <q-item-label caption>{{ producto.codigoBarra }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <div class="flex flex-center" style="width: 200px">
                  <q-btn
                    icon="do_not_disturb_on"
                    round
                    color="red-5"
                    @click="producto.prestar--"
                    :disable="producto.prestar < 2"
                  />
                  <q-input
                    dense
                    class="text-subtitle2 q-mx-sm"
                    min="1"
                    :max="producto.stockTotal - producto.borrowedQuantity"
                    v-model="producto.prestar"
                    style="width: 80px"
                    type="number"
                    :rules="[
                      (val) => val >= 0 || 'La cantidad debe ser mayor a 0',
                      (val) =>
                        val <=
                          producto.stockTotal - producto.borrowedQuantity ||
                        `Solo ${
                          producto.stockTotal - producto.borrowedQuantity
                        } unidades disponibles`,
                    ]"
                  />

                  <q-btn
                    icon="add_circle"
                    round
                    color="primary"
                    @click="producto.prestar++"
                    :disable="
                      producto.prestar ==
                      producto.stockTotal - producto.borrowedQuantity
                    "
                  />
                </div>
              </q-item-section>
              <q-item-section>
                <div class="flex flex-center">
                  <DatePicker
                    options
                    @guardarFecha="(fecha) => (producto.fechaEntrega = fecha)"
                  />
                  <q-input disable v-model="producto.fechaEntrega"
                    ><template v-slot:hint>
                      <span> Entrega </span>
                    </template></q-input
                  >
                </div>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  icon="delete"
                  style="width: 50px"
                  @click="deselectRow(producto)"
                />
              </q-item-section>
            </template>

            <q-card>
              <q-card-section class="q-px-lg bg-grey-1">
                <q-separator />
                <div class="flex flex-center bg-white">
                  <span
                    class="q-ma-sm shadow-1 q-pa-sm q-pa-md"
                    style="width: 90%"
                  >
                    <span class="text-subtitle2">Notas producto:</span>
                    {{ producto.descripcion || producto.notas }}
                  </span>
                </div>
                <div class="flex justify-evenly">
                  <CustomPropertiesTable
                    style="height: 90px; width: 45%"
                    :producto="producto"
                    v-if="!producto.isConsumable"
                    class="bg-white"
                  />
                  <div
                    class="q-pa-md q-card--bordered shadow-3 bg-white"
                    style="height: 90px; width: 45%"
                  >
                    <q-input
                      v-model="producto.comentario"
                      autogrow
                      label="Ingrese comentarios"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />
        </div>
      </q-scroll-area>
      <div class="flex flex-center q-ma-lg">
        <q-btn label="Crear prestamo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { computed, onBeforeUnmount, ref } from "vue";
import PersonalInfo from "components/clientes/PersonalInfo.vue";
import { useRoute } from "vue-router";
import ConsumiblesIcon from "components/icons/ConsumiblesIcon.vue";
import DevolutivosIcon from "components/icons/DevolutivosIcon.vue";
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import { useProductosStore } from "src/stores/productosStore";
import DatePicker from "components/utils/DatePicker.vue";
import CustomPropertiesTable from "components/productos/CustomPropertiesTable.vue";
import { addDoc, collection } from "firebase/firestore";
import { db } from "src/firebaseInit";
const productosList = ref([]);
const consumibleSelected = ref("");
const $q = useQuasar();
const documento = ref("");
const prestamosStore = UsePrestamosStore();
const devolutivoSearch = ref("");
const currentProduct = ref({});
const productosStore = useProductosStore();

function deselectRow(elemento) {
  productosList.value = productosList.value.filter(
    (producto) => producto.docId != elemento.docId
  );
}

function notifyProduct(message) {
  $q.notify({
    type: "negative",
    message,
    position: "center",
    timeout: 1500,
  });
}

function setConsumible(nombreProducto) {
  const producto = productosStore.getConsumableByName(nombreProducto);
  currentProduct.value = producto;
  if (
    productosList.value.some((elemento) => elemento.docId == producto.docId)
  ) {
    notifyProduct("Este producto ya esta en tu lista");
    return;
  }
  productosList.value.unshift({
    ...producto,
    prestar: 1,
    fechaEntrega: new Date().toLocaleDateString("es-CO"),
  });
}

function setDevolutivo(codigoBarras) {
  const producto = productosStore.getConsumableByCodeBar(codigoBarras);
  if (!producto) {
    notifyProduct("No encontramos el codigo de barras ingresado");
    return;
  }
  if (
    productosList.value.some((elemento) => elemento.docId == producto.docId)
  ) {
    notifyProduct("Este producto ya esta en tu lista");
    return;
  }
  productosList.value.unshift({
    ...producto,
    prestar: 1,
    fechaEntrega: new Date().toLocaleDateString("es-CO"),
  });
  devolutivoSearch.value = "";
}

async function buscarCliente() {
  console.log(documento.value);
  await prestamosStore.getPrestamosByPerson(documento.value);
}

const cliente = computed(() => {
  return prestamosStore.currentCustomer;
});

const route = useRoute();
onBeforeUnmount(() => {
  const rutaCompleta = route.path.split("/");
  if (!(rutaCompleta.length > 2 && !!Number(rutaCompleta[2]))) {
    console.log("si es esta");
    prestamosStore.resetCurrentCustomer();
  }
});

function prestarProducto() {
  guardandoPrestamo.value = true;
  const dateBorrowed = new Date().getTime();
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

<style lang="scss" scoped></style>
