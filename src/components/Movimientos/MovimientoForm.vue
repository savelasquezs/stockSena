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
  <q-form ref="refForm">
    <!-- Selección del tipo de movimiento (Ingreso o Salida) -->
    <q-select
      v-model="movimiento"
      :options="tiposMovimiento"
      label="Selecciona un tipo de movimiento"
    />

    <!-- Opciones adicionales si v-if="movimiento == 'Ingreso entonces se activa
    el formulario -->
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
      <!-- Contenido específico según el tipo de ingreso -->
      <div class="flex flex-center">
        <!-- Formulario para un nuevo producto, en caso
      de que v-if="tipoIngreso == 'nuevo'-->
        <productos-form
          v-if="tipoIngreso == 'nuevo'"
          @enviado="console.log('recibido desde movements')"
        />
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
            <div class="text-h5 text-center q-mt-xl">
              Ingreso de productos existentes
            </div>
            <div class="text-grey-6">
              Solo puedes agregar existencias a productos consumibles, pues cada
              devolutivo es unico
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
                  :stringOptions="productosStore.nameColumnsConsumibles"
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
            <q-input
              color="teal"
              outlined
              v-model="proveedor"
              label="Proveedor"
            >
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
                @click="verificarValores"
              ></q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else-if="movimiento == 'Salida'">
      <div class="flex flex-center">
        <div>
          <q-radio
            v-model="tipoSalida"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="salida"
            label="Salida del almacen"
          />
        </div>
        <div>
          <q-radio
            v-model="tipoSalida"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="deshabilitar"
            label="Deshabilitar producto"
          />
        </div>
      </div>
      <div
        class="text-h5 text-center"
        v-if="tipoSalida == 'salida' || tipoSalida == 'deshabilitar'"
      >
        {{
          tipoSalida == "salida"
            ? "Sacar del almacen"
            : "Deshabilitar productos"
        }}
      </div>
      <SalidaDeAlmacen
        v-if="tipoSalida == 'salida' || tipoSalida == 'deshabilitar'"
        :tipoSalida="tipoSalida"
        @productSelected="agregarProducto"
        :productlist="productosList"
        @darSalida="guardarCambios"
        @deselectProduct="deselectRow"
      />
    </div>
  </q-form>
</template>

<script setup>
//importaciones de los componentes
import ProductosForm from "components/productos/ProductosForm.vue";
import Autocompleteinput from "components/utils/autocompleteInput.vue";
import SalidaDeAlmacen from "components/Movimientos/SalidaDeAlmacen.vue";
//Importaciones necesarias
import { ref, watch } from "vue";
import { useProductosStore } from "stores/productosStore";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "src/firebaseInit";
import { useDatabaseStore } from "src/stores/DatabaseStore";
import { UseUtilsStore } from "src/stores/utilsStore";
const refForm = ref(null);

function verificarValores() {
  refForm.value.validate().then((result) => {
    if (result) {
      guardarCambios(notas.value);
    }
  });
}

//Instancia de dunciones
const productosStore = useProductosStore();
// Declaración de las variables
const tiposMovimiento = ["Ingreso", "Salida"];
const movimiento = ref("");
const tipoIngreso = ref(null);
const cantidad = ref(null);
const proveedor = ref("");
const notas = ref(null);
const productosList = ref([]);
const tipoSalida = ref(null);

const DatabaseStore = useDatabaseStore();
const utils = UseUtilsStore();

const emit = defineEmits(["movimientoGuardado"]);

function deselectRow(id) {
  productosList.value = productosList.value.filter(
    (producto) => producto.docId != id
  );
}

// evento

function agregarProducto(producto) {
  console.log(producto);
  if (
    productosList.value.some((elemento) => elemento.docId == producto.docId)
  ) {
    utils.notifyError("Este producto ya esta en tu lista");
    return;
  }
  console.log(producto);
  if (
    producto.stockTotal -
      producto.borrowedQuantity -
      producto.unavailableQuantity <=
    0
  ) {
    utils.notifyError(
      "Lo sentimos, este producto esta prestado o deshabilitado"
    );
    return;
  }
  productosList.value.unshift({
    ...producto,
    prestar: 1,
  });
  console.log(productosList.value);
}

/**
 * Guarda los cambios realizados en el inventario.
 * Si el movimiento es un ingreso y se trata de productos existentes,
 * actualiza el stock de los productos en la base de datos.
 * @returns {void}
 */

function guardarCambios(notasSalida) {
  function calculartotalStock(stockAnterior, producto) {
    if (movimiento.value == "Ingreso") {
      if (tipoIngreso.value == "existente") {
        return (
          parseInt(stockAnterior) +
          parseInt(producto.cantidad || producto.prestar)
        );
      }
    } else if (movimiento.value == "Salida") {
      if (tipoSalida.value == "salida") {
        return (
          parseInt(stockAnterior) -
          parseInt(producto.cantidad || producto.prestar)
        );
      } else return producto.stockTotal;
    }
  }

  const productos = productosList.value.map((producto) => {
    console.log(producto);
    const stockAnterior = parseInt(producto.stockTotal);

    const stockTotal = calculartotalStock(stockAnterior, producto);
    const unavailableQuantity =
      movimiento.value == "Salida" && tipoSalida.value == "deshabilitar"
        ? parseInt(producto.unavailableQuantity) +
          (parseInt(producto.cantidad) || parseInt(producto.prestar))
        : parseInt(producto.unavailableQuantity);
    return {
      cantidad: producto.cantidad || producto.prestar,
      docId: producto.docId,
      nombre: producto.producto || producto.nombre,
      notas: producto.notas || producto.comentario,
      stockAnterior,
      stockTotal,
      unavailableQuantity,
    };
  });
  const data = {
    productosList: productos,
    fecha: new Date().getTime(),
    movimiento: `${movimiento.value} ${tipoIngreso.value || tipoSalida.value}`,
    proveedor: proveedor.value || "No aplica",
    notas: notas.value || "",
  };

  productos.forEach((registro) => {
    console.log(registro);
    DatabaseStore.updateElement(
      {
        stockTotal: registro.stockTotal,
        unavailableQuantity: registro.unavailableQuantity,
      },
      "products",
      registro.docId
    );
  });
  console.log(data);
  useDatabaseStore().saveElement(data, "stockMovements");

  emit("movimientoGuardado");
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

watch([movimiento, tipoIngreso, tipoSalida], () => {
  productosList.value = [];
});

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
    (producto) => producto.nombre == nombreProducto
  );

  productosList.value[index].maxQuantity =
    producto.stockTotal - producto.borrowedQuantity;
  productosList.value[index].docId = producto.docId;
  productosList.value[index].cantidadPrestada = producto.borrowedQuantity;
  productosList.value[index].stockTotal = producto.stockTotal;
  productosList.value[index].unavailableQuantity = producto.unavailableQuantity;
}
</script>

<style lang="scss" scoped></style>
