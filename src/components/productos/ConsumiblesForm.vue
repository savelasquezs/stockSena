<template>
  <div>
    <div class="flex justify-center">
      <q-avatar
        icon="save"
        color="primary"
        text-color="white"
        size="70px"
        class="q-mb-xl"
      />
    </div>
    <div class="text-h5 text-center">Productos Consumibles</div>
    <q-input label="Nombre" v-model="nombre" />

    <q-dialog v-model="openImage">
      <q-card class="bg-grey-4">
        <q-card-section class="row justify-end q-pb-none">
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1 text-center">Ejemplo de campos</div>
          <div class="text-caption text-grey-7 text-center">
            Este es un ejemplo para crear el producto consumible llamado
            'Computador'
          </div>
        </q-card-section>
        <q-card-section>
          <q-img
            src="public\img\ejemploProductosConsumibles.png"
            width="500px"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <div v-if="nombre">
      <p class="text-grey-7">
        Vamos a crear un formulario para poder registrar cada {{ nombre }}.
        Agrega uno a uno los campos que se necesitan para registrar uno de ellos
        <a class="text-blue-7" @click="openImage = true" style="cursor: pointer"
          >Ver ejemplo</a
        >
      </p>
      <div class="flex justify-center q-my-lg">
        <q-btn
          icon="add_circle"
          round
          color="accent"
          style="margin: 0 auto"
          @click="agregarCampo"
        />
      </div>
      <div>
        <div
          v-for="(campo, index) in listaCampos"
          :key="campo"
          style="width: 500px"
          class="flex justify-evenly q-ma-lg"
        >
          <q-input label="nombre del campo" v-model="campo.nombreCampo" />
          <q-select
            label="Tipo de dato"
            :options="tipoDatos"
            style="width: 200px"
            v-model="campo.tipoDato"
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
        <q-btn
          style="width: 100%"
          label="Guardar Consumible"
          icon="save"
          color="primary"
          @click="guardarConsumible"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDatabaseStore } from "src/stores/DatabaseStore";
import { ref } from "vue";

const emit = defineEmits(["productoGuardado"]);

const nombre = ref("");
const listaCampos = ref([]);
const tipoDatos = ["numero", "texto"];
const openImage = ref(false);
const databaseStore = useDatabaseStore();

function agregarCampo() {
  listaCampos.value.unshift({ nombreCampo: "", tipoDato: "" });
}
function deleteProductList(index) {
  listaCampos.value.splice(index, 1);
}

function guardarConsumible() {
  const data = {
    nombre: nombre.value,
    listaCampos: listaCampos.value,
  };
  console.log(data);

  databaseStore.saveElement(data, "consumables");
  emit("productoGuardado");
}
</script>

<style lang="scss" scoped></style>
