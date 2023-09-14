<template>
  <div class="flex column flex-center q-pb-xl">
    <q-img src="public\img\Sena.png" width="125px" />
  </div>

  <q-form @submit="guardarCliente">
    <div class="row justify-evenly items-start content-start">
      <div class="col-4 self-start q-gutter-md">
        <q-select
          outlined
          label="Tipo documento"
          v-model="Tipo_documento"
          :options="options_Tipo_documento"
          transition-show="flip-up"
          transition-hide="flip-up"
        />
        <q-input
          outlined
          label="Numero documento"
          :rules="[(val) => val > 0 || 'Por favor ingrese documento valido']"
          v-model="Numero_documento"
        />
        <q-input
          outlined
          label="Nombre"
          v-model="Nombre"
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
          v-model="Apellido"
          :rules="[
            (val) => val.length > 2 || 'Por favor ingrese nombre valido',
          ]"
        />

        <q-select
          outlined
          label="Rol"
          v-model="Rol"
          :options="options_Rol"
          :rules="[(val) => !!val || 'Seleccione un Rol']"
        />
        <q-select
          outlined
          label="Area"
          v-model="Area"
          :options="options_Area"
          :rules="[(val) => !!val || 'Seleccione una opción']"
        />
        <q-btn type="submit" label="Guardar cliente" color="green-14" />
      </div>
    </div>
    <uploadData nomTabla="customers" tipo="customers" />
  </q-form>
</template>

<script setup>
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useQuasar } from "quasar";
import { db } from "src/firebaseInit";
import { ref } from "vue";
import uploadData from "components/utils/ExcelToJasonBtn.vue";
const Tipo_documento = ref(null);
const options_Tipo_documento = ref([
  "Cedula de ciudadania",
  "Tarjeta de identidad",
  "Pasaporte",
]);
const Numero_documento = ref("");
const Nombre = ref("");
const Apellido = ref("");
const Rol = ref(null);
const options_Rol = ref(["Instructor", "aprendiz"]);
const Area = ref(null);
const $q = useQuasar();

const emit = defineEmits(["clienteGuardado"]);
const options_Area = ref([
  "Tics",
  "Manufactura",
  "Electricidad",
  "Automotriz",
  "Automatizacion",
]);

function guardarCliente() {
  // Aquí puedes agregar la lógica para enviar los datos del formulario al servidor
  // Por ejemplo, puede usar Axios para realizar una solicitud POST al servidor.
  // Luego, puede manejar la respuesta según sea necesario.
  const data = {
    tipoDoc: Tipo_documento.value,
    numero_id: Numero_documento.value,
    nombre: Nombre.value,
    apellido: Apellido.value,
    rol: Rol.value,
    area: Area.value,
    enMora: false,
  };
  const docRef = doc(db, "customers", data.numero_id);
  setDoc(docRef, data).then(() => {
    emit("clienteGuardado");
    $q.notify({
      message: "Cliente guardado exitosamente",
      color: "accent",
    });
  });
}
</script>

<style scoped>
.complete {
  max-height: 100vh;
}
</style>
