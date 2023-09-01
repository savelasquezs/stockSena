<template>
  <q-form @submit="guardarCambios">
    <q-select
      v-model="movimiento"
      :options="tiposMovimiento"
      label="Selecciona un tipo de movimiento"
    />

    <div class="q-gutter-sm" v-if="movimiento == 'Ingreso'">
      <q-radio
        v-model="tipoIngreso"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        val="nuevo"
        label="Nuevo Producto"
      />
      <q-radio
        v-model="tipoIngreso"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        val="existente"
        label="Producto existente"
      />
    </div>

    <div class="flex flex-center">
      <productos-form v-if="tipoIngreso == 'nuevo'" />
      <q-card
        class="q-pa-lg"
        v-else-if="tipoIngreso == 'existente'"
        style="min-width: 750px"
      >
        <div class="flex column flex-center">
          <q-avatar
            icon="add_task"
            size="75px"
            color="accent"
            text-color="white"
          ></q-avatar>
          <div class="text-h5 text-center q-my-xl">
            Ingreso de productos existentes
          </div>
        </div>
        <q-item class="flex flex-center" clickable @click="addproductList">
          <q-icon name="add_circle" size="30px" color="primary"></q-icon>
        </q-item>
        <q-scroll-area
          style="height: 150px; max-width: 1000px; width: 700px"
          visible
        >
          <div
            class="flex q-my-sm"
            v-for="(producto, index) in productosList"
            :key="producto"
          >
            <q-card-section horizontal>
              <Autocompleteinput
                :stringOptions="productosStore.productosNombres"
                @cambioModel="
                  (nombreProducto) => setProduct(nombreProducto, index)
                "
              />

              <q-input
                color="teal"
                outlined
                type="number"
                v-model="producto.cantidad"
                label="Cantidad"
                class="q-mx-sm"
              >
                <template v-slot:append>
                  <q-icon
                    :name="
                      movimiento == 'Ingreso'
                        ? 'add_shopping_cart'
                        : 'remove_shopping_cart'
                    "
                  />
                </template>
              </q-input>
              <q-input
                color="teal"
                outlined
                v-model="producto.notas"
                label="Notas"
                autogrow
              >
                <template v-slot:append>
                  <q-icon
                    name="inventory_2
                "
                  />
                </template>
              </q-input>
              <q-item
                clickable
                dense
                class="items-center"
                style="height: 56px"
                @click="deleteProductList(index)"
              >
                <q-icon name="delete" size="24px" color="red-8"></q-icon>
              </q-item>
            </q-card-section>
          </div>
        </q-scroll-area>
        <q-card-section>
          <q-input color="teal" outlined v-model="proveedor" label="Proveedor">
            <template v-slot:append>
              <q-icon
                name="precision_manufacturing
                "
              />
            </template>
          </q-input>
          <q-input
            color="teal"
            outlined
            v-model="notas"
            label="Notas"
            class="q-my-lg"
          >
            <template v-slot:append>
              <q-icon
                name="chat
                "
              />
            </template>
          </q-input>
          <q-card-actions>
            <q-btn
              color="primary"
              icon="save"
              text-color="white"
              label="Guardar"
              type="submit"
            ></q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import ProductosForm from "components/productos/ProductosForm.vue";
import Autocompleteinput from "components/utils/autocompleteInput.vue";
import { useProductosStore } from "stores/productosStore";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "src/firebaseInit";

const productosStore = useProductosStore();
const tiposMovimiento = ["Ingreso", "Salida"];
const movimiento = ref("");
const tipoIngreso = ref("");
const cantidad = ref(null);
const proveedor = ref("");
const notas = ref("");
const productosList = ref([]);

const emit = defineEmits(["movimientoGuardado"]);

function guardarCambios() {
  if (movimiento.value == "Ingreso") {
    if (tipoIngreso.value == "existente") {
      productosList.value.forEach((registro) => {
        const docRef = doc(db, "products", registro.docId);
        updateDoc(docRef, {
          totalStock:
            parseInt(registro.totalStock) + parseInt(registro.cantidad),
        }).then(() => {});
      });
      const productos = productosList.value.map((producto) => {
        return {
          cantidad: producto.cantidad,
          docId: producto.docId,
          nombre: producto.producto,
          notas: producto.notas,
          stockAnterior: producto.totalStock,
          nuevoStock:
            parseInt(producto.totalStock) + parseInt(producto.cantidad),
        };
      });
      const data = {
        productosList: productos,
        fecha: new Date().getTime(),
        movimiento: movimiento.value,
        proveedor: proveedor.value,
        notas: notas.value,
      };

      addDoc(collection(db, "stockMovements"), data).then(() => {
        emit("movimientoGuardado");
      });
    }
  }
}

function addproductList() {
  productosList.value.unshift({ producto: "", cantidad: 1, notas: "" });
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
    (producto) => producto.name == nombreProducto
  );

  productosList.value[index].maxQuantity =
    producto.totalStock - producto.borrowedQuantity;
  productosList.value[index].docId = producto.docId;
  productosList.value[index].cantidadPrestada = producto.borrowedQuantity;
  productosList.value[index].totalStock = producto.totalStock;
}
</script>

<style lang="scss" scoped></style>
