<template>
  <div class="flex column flex-center q-pb-xl">
    <q-img src="/img/Sena.png" width="125px" />
  </div>

  <q-form @submit="editando ? updateCliente() : guardarCliente()">
    <div class="row justify-evenly items-start content-start">
      <div class="col-4 self-start q-gutter-md">
        <q-select
          outlined
          label="Tipo documento"
          v-model="cliente.tipoDoc"
          :options="options_Tipo_documento"
          transition-show="flip-up"
          transition-hide="flip-up"
          :rules="[(val) => val != '' || 'Por favor ingrese documento valido']"
        />
        <q-input
          outlined
          label="Numero documento"
          :disable="editando"
          :rules="[(val) => val > 0 || 'Por favor ingrese documento valido']"
          v-model="cliente.numero_id"
        />
        <q-input
          outlined
          label="Nombre"
          v-model="cliente.nombre"
          :rules="[
            (val) => val.length > 2 || 'Por favor ingrese nombre valido',
            [],
          ]"
        />
      </div>
      <div class="col-4 self-start q-gutter-md">
        <q-input
          outlined
          label="Apellido"
          v-model="cliente.apellido"
          :rules="[
            (val) => val.length > 2 || 'Por favor ingrese nombre valido',
          ]"
        />
        <q-input
          outlined
          label="Correo Electrónico"
          v-model="cliente.correo"
          :rules="[
            (val) => !!val || 'Por favor ingrese una dirección de correo',
            (val) =>
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val) ||
              'Por favor ingrese una dirección de correo válida',
          ]"
        />
        <q-select
          outlined
          label="Rol"
          v-model="cliente.rol"
          :options="options_Rol"
          :rules="[(val) => !!val || 'Seleccione un Rol']"
        />
        <q-select
          outlined
          label="Area"
          v-model="cliente.area"
          :options="options_Area"
          :rules="[(val) => !!val || 'Seleccione una opción']"
        />
        <q-btn
          type="submit"
          :label="editando ? 'Actualizar Cliente' : 'Guardar cliente'"
          color="green-14"
        />
      </div>
    </div>
    <uploadData nomTabla="customers" tipo="customers" />
  </q-form>
</template>

<script setup>
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useQuasar } from "quasar";
import { db } from "src/firebaseInit";
import { ref } from "vue";
import uploadData from "components/utils/ExcelToJasonBtn.vue";
import { UseUtilsStore } from "src/stores/utilsStore";
import { useDatabaseStore } from "src/stores/DatabaseStore";

const utilsStore = UseUtilsStore();
const databaseStore = useDatabaseStore();

const props = defineProps({ editando: Boolean, clienteEdit: Object });

const options_Tipo_documento = ref([
  "Cedula de ciudadania",
  "Tarjeta de identidad",
  "Pasaporte",
]);
const cliente = ref({});
const options_Rol = ref(["Instructor", "aprendiz"]);
const $q = useQuasar();

if (props.editando && props.clienteEdit) {
  console.log(props.clienteEdit);
  cliente.value = props.clienteEdit;
}

const emit = defineEmits(["clienteGuardado"]);
const options_Area = ref([
  "Tics",
  "Manufactura",
  "Electricidad",
  "Automotriz",
  "Automatizacion",
]);

async function updateCliente() {
  await databaseStore.updateElement(
    { ...cliente.value },
    "customers",
    cliente.value.numero_id
  );
  emit("clienteGuardado");
}

async function guardarCliente() {
  // Aquí puedes agregar la lógica para enviar los datos del formulario al servidor
  // Por ejemplo, puede usar Axios para realizar una solicitud POST al servidor.
  // Luego, puede manejar la respuesta según sea necesario.
  const data = {
    ...cliente.value,
    enMora: false,
  };
  const docRef = doc(db, "customers", data.numero_id);
  const alreadyExists = await getDoc(docRef);
  if (alreadyExists.exists()) {
    utilsStore.notifyError("El numero de documento ya esta registrado");
    cliente.value.numero_id = null;
    return;
  }

  setDoc(docRef, data).then(() => {
    emit("clienteGuardado");
    utilsStore.notifyError("Cliente guardado exitosamente", "positive");
  });
}
</script>

<style scoped>
.complete {
  max-height: 100vh;
}
</style>
