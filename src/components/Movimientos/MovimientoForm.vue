<!-- Día de la documentación: 06/09/2023
Descripción del archivo "movimientosForm.vue":

Este archivo representa un componente Vue.js que se utiliza para registrar movimientos de inventario,
como ingresos y salidas de productos. El componente presenta un formulario interactivo que permite al usuario seleccionar
el tipo de movimiento (ingreso o salida), proporcionar detalles sobre los productos y el proveedor, y guardar los cambios en la base de datos.

Características clave:
- Permite al usuario registrar movimientos de inventario, como ingresos y salidas de productos.
- Proporciona opciones para especificar si se trata de un nuevo producto o uno existente durante un ingreso.
- Permite al usuario ingresar detalles como la cantidad, el proveedor y las notas.
- Interactúa con una lista de productos para rastrear los cambios en el inventario.

Props recibidos:
- Ninguno

Eventos emitidos:
- `movimientoGuardado`: Se emite cuando se guarda con éxito un movimiento en el inventario.

Uso:
- Este componente se utiliza en la interfaz de usuario para registrar movimientos de inventario, como ingresos y salidas de productos.
- Los detalles del movimiento se completan en el formulario y luego se envían para su registro en la base de datos.
-->
<template>
  <!-- Formulario para registrar movimientos de inventario -->
  <q-form @submit="guardarCambios">
    <!-- Selección del tipo de movimiento (Ingreso o Salida) -->
    <q-select
      v-model="movimiento"
      :options="tiposMovimiento"
      label="Selecciona un tipo de movimiento"
    />

    <!-- Opciones adicionales si v-if="movimiento == 'Ingreso entonces se activa
    el formulario -->s
    <div class="q-gutter-sm" v-if="movimiento == 'Ingreso'">
      <!-- Opción para registrar un nuevo producto -->
      <q-radio
        v-model="tipoIngreso"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        val="nuevo"
        label="Nuevo Producto"
      />
      <!-- Opción para seleccionar un producto existente -->
      <q-radio
        v-model="tipoIngreso"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        val="existente"
        label="Producto existente"
      />
    </div>

    <!-- Contenido específico según el tipo de ingreso -->
    <div class="flex flex-center">
      <!-- Formulario para un nuevo producto, en caso
      de que v-if="tipoIngreso == 'nuevo'-->
      <productos-form v-if="tipoIngreso == 'nuevo'" />
      <q-card
        class="q-pa-lg"
        v-else-if="tipoIngreso == 'existente'"
        style="min-width: 750px"
      >
        <!-- Contenido del formulario de ingreso de productos existentes -->
        <div class="flex column flex-center">
          <!-- Configuración del icono (avatar) -->
          <q-avatar
            icon="add_task"
            size="75px"
            color="accent"
            text-color="white"
          ></q-avatar>
          <!-- titulo -->
          <div class="text-h5 text-center q-my-xl">
            Ingreso de productos existentes
          </div>
        </div>
        <!-- "Botón" el cual añade productos nuevos a la lista -->
        <q-item class="flex flex-center" clickable @click="addproductList">
          <!-- Icono del "botón" y su configuración -->
          <q-icon name="add_circle" size="30px" color="primary"></q-icon>
        </q-item>
        <!-- inicio del area a la cual se le puede hacer "scroll" -->
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
              <!-- se llama al componente Autocompleteinput,
              para añadir algun posible -->
              <Autocompleteinput
                :stringOptions="productosStore.productosNombres"
                @cambioModel="
                  (nombreProducto) => setProduct(nombreProducto, index)
                "
              />
              <!-- Input para añadir la cantidad del producto, está vinculado
               con v-model="producto.cantidad" -->
              <q-input
                color="teal"
                outlined
                type="number"
                v-model="producto.cantidad"
                label="Cantidad"
                class="q-mx-sm"
              >
                <template v-slot:append>
                  <!-- Icono que acompaña al input -->
                  <q-icon
                    :name="
                      movimiento == 'Ingreso'
                        ? 'add_shopping_cart'
                        : 'remove_shopping_cart'
                    "
                  />
                </template>
              </q-input>
              <!-- Input para añadir las notas, está vinculado a
               v-model="producto.notas"  -->
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
              <!-- item (botón) clickable el cual esta conectado a la función
               @click="deleteProductList(index)" -->
              <q-item
                clickable
                dense
                class="items-center"
                style="height: 56px"
                @click="deleteProductList(index)"
              >
                <!-- Configuración del icono -->
                <q-icon name="delete" size="24px" color="red-8"></q-icon>
              </q-item>
            </q-card-section>
          </div>
          <!-- Fin del scroll-area -->
        </q-scroll-area>
        <q-card-section>
          <!-- Input para añadir el proveedor, el cual está conectando a la
          variable v-model="proveedor"  -->
          <q-input color="teal" outlined v-model="proveedor" label="Proveedor">
            <template v-slot:append>
              <q-icon
                name="precision_manufacturing
                "
              />
            </template>
          </q-input>
          <!-- Input para añadir las notas conectado a la variable: v-model="notas" -->
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
            <!-- Boton para guardar los datos ingresados en el formulario -->
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
//importaciones de los componentes
import ProductosForm from "components/productos/ProductosForm.vue";
import Autocompleteinput from "components/utils/autocompleteInput.vue";
//Importaciones necesarias
import { ref } from "vue";
import { useProductosStore } from "stores/productosStore";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "src/firebaseInit";

//Instancia de dunciones
const productosStore = useProductosStore();
// Declaración de las variables
const tiposMovimiento = ["Ingreso", "Salida"];
const movimiento = ref("");
const tipoIngreso = ref("");
const cantidad = ref(null);
const proveedor = ref("");
const notas = ref("");
const productosList = ref([]);

// evento
const emit = defineEmits(["movimientoGuardado"]);

/**
 * Guarda los cambios realizados en el inventario.
 * Si el movimiento es un ingreso y se trata de productos existentes,
 * actualiza el stock de los productos en la base de datos.
 * @returns {void}
 */
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

// Función para guardar los productos de la lista
function addproductList() {
  productosList.value.unshift({ producto: "", cantidad: 1, notas: "" });
}
/**
 * Elimina un producto de la lista de productos para ingresar.
 * @param {number} index - El índice del producto que se eliminará.
 * @returns {void}
 */
function deleteProductList(index) {
  productosList.value.splice(index, 1);
}

/**
 * Establece un producto en la lista de productos para ingresar.
 * Verifica si el producto ya existe en la lista para evitar duplicados.
 * @param {string} nombreProducto - El nombre del producto a establecer.
 * @param {number} index - El índice en la lista de productos.
 * @returns {void}
 */

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
