<!--Día de la documentación: 1/09/2023
Descripción del archivo "consumiblesForm.vue":
 -->

<!--
  =============================================================================
  Eventos:
  "productoGuardado": Evento que se activa al darle al botón guardar elemento
  =============================================================================
  -->
<template>
  <!-- Contenido del formulario de productos devolutivos -->
  <div>
    <!-- Elemento visual del formulario -->
    <div class="flex justify-center">
      <q-avatar
        icon="save"
        color="primary"
        text-color="white"
        size="70px"
        class="q-mb-xl"
      />
    </div>
    <!-- Elemento visual del formulario -->

    <div class="text-h5 text-center">Productos Devolutivos</div>
    <!-- Campo para ingresar el nombre del producto devolutivo, el
    se almacen en la variable v-model="nombre" -->
    <q-input label="Nombre" v-model="nombre" />

    <!-- Diálogo de ejemplo de campos -->
    <q-dialog v-model="openImage">
      <!-- Tarjeta de diálogo -->
      <q-card class="bg-grey-4">
        <!-- Encabezado del diálogo -->
        <q-card-section class="row justify-end q-pb-none">
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <!-- Contenido del diálogo con información de ejemplo -->
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1 text-center">Ejemplo de campos</div>
          <div class="text-caption text-grey-7 text-center">
            Este es un ejemplo para crear el producto devolutivo llamado
            'Computador'
          </div>
        </q-card-section>
        <!-- Imagen de ejemplo de campos -->
        <q-card-section>
          <q-img
            src="public\img\ejemploProductosConsumibles.png"
            width="500px"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Contenido del formulario (se muestra si se ha ingresado un nombre) -->
    <div v-if="nombre">
      <!-- Instrucciones para agregar campos -->
      <p class="text-grey-7">
        Vamos a crear un formulario para poder registrar cada {{ nombre }}.
        Agrega uno a uno los campos que se necesitan para registrar uno de ellos
        <a class="text-blue-7" @click="openImage = true" style="cursor: pointer"
          >Ver ejemplo</a
        >
      </p>
      <div class="flex justify-center q-my-lg">
        <!-- Botón para agregar un nuevo campo -->
        <q-btn
          icon="add_circle"
          round
          color="accent"
          style="margin: 0 auto"
          @click="agregarCampo"
        />
      </div>
      <div>
        <!-- Lista de campos configurables -->
        <div
          v-for="(campo, index) in listaCampos"
          :key="campo"
          style="width: 500px"
          class="flex justify-evenly q-ma-lg"
        >
          <!-- Lista de campos configurables -->
          <q-input label="nombre del campo" v-model="campo.nombreCampo" />
          <!-- Lista desplegable para el tipo de dato -->
          <q-select
            label="Tipo de dato"
            :options="tipoDatos"
            style="width: 200px"
            v-model="campo.tipoDato"
          />
          <!-- Botón para eliminar el campo -->
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
        <!-- Botón para guardar -->
        <q-btn
          style="width: 100%"
          label="Guardar Consumible"
          icon="save"
          color="primary"
          @click="guardarDevolutivo"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// Importaciones
import { useDatabaseStore } from "src/stores/DatabaseStore";
import { ref } from "vue";

// definición del evento
const emit = defineEmits(["productoGuardado"]);

// Definición de variables
const nombre = ref("");
const listaCampos = ref([]);
const tipoDatos = ["numero", "texto"];
const openImage = ref(false);
const databaseStore = useDatabaseStore();

// Función para agregar campos al formulario
function agregarCampo() {
  listaCampos.value.unshift({ nombreCampo: "", tipoDato: "" });
}
// Función para borrar productos de la lista
function deleteProductList(index) {
  listaCampos.value.splice(index, 1);
}
// Función para guardar el producto devolutivo
function guardarDevolutivo() {
  const data = {
    nombre: nombre.value,
    listaCampos: listaCampos.value,
  };

  databaseStore.saveElement(data, "consumables");
  emit("productoGuardado");
}
</script>

<style lang="scss" scoped></style>
