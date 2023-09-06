<!-- Fecha documentación 6/09/2023 -->
<!-- Este componente Vue.js crea un formulario de registro de clientes que recopila 
información sobre un cliente y la envía a Firebase Firestore. Luego, muestra una 
notificación de éxito al usuario y emite un evento personalizado cuando se guarda el cliente. -->
<template>
  <div class="flex column flex-center q-pb-xl">
    <q-img
      src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png"
      loading="lazy"
      style="width: 90px"
    />
  </div>
  <!--Boton de almacenamiento de clientes con campos correspondientes del tipo de 
  documento.-->
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
        <!-- Campo ingreso de numero de documento con su validacion correspondiente
        en dado caso de no ser el correcto. -->
        <q-input
          outlined
          label="Numero documento"
          :rules="[(val) => val > 0 || 'Por favor ingrese documento valido']"
          v-model="Numero_documento"
        />
        <!-- Campo ingreso del nombre del individuo con su validacion correspondiente
          en dado caso de no ser el correct. -->
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
      <!-- Campo ingreso del apellido del individuo con su validacion correspondiente. -->
      <div class="col-4 self-start q-gutter-md">
        <q-input
          outlined
          label="Apellido"
          v-model="Apellido"
          :rules="[
            (val) => val.length > 2 || 'Por favor ingrese nombre valido',
          ]"
        />
        <!-- Opcion para seleccionar el rol y las diferentes area de almacenes de la cede -->
        <q-select outlined label="Rol" v-model="Rol" :options="options_Rol" />

        <q-select
          outlined
          label="Area"
          v-model="Area"
          :options="options_Area"
        />
        <!-- Al haber seleccionado las opciones cuenta con un boton para guardar la 
        informacion almacenada. -->
        <q-btn type="submit" label="Guardar cliente" color="green-14" />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useQuasar } from "quasar";
import { db } from "src/firebaseInit";
import { ref } from "vue";
// Se crean varias variables reactivas usando ref. Cada variable representa un campo del
// formulario de registro de clientes.
const Tipo_documento = ref(null);
const options_Tipo_documento = ref([
  "Cedula de ciudadania",
  "Tarjeta de indentidad",
  "Pasaporte",
]);
const Numero_documento = ref("");
const Nombre = ref("");
const Apellido = ref("");
const Rol = ref(null);
const options_Rol = ref(["Instructor", "aprendiz"]);
const Area = ref(null);
const $q = useQuasar();
// options_Area: Es un arreglo que contiene las opciones disponibles para el área.
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
  // const docRef = doc(db, "customers", data.numero_id);: Se crea una referencia al
  //  documento en la colección "customers" de Firebase Firestore. db es la instancia
  //  de la base de datos Firestore previamente importada, y data.numero_id se utiliza
  // como identificador del documento. Esto implica que cada cliente se guarda con su
  //  número de documento como identificador único en la base de datos Firestore.
  const docRef = doc(db, "customers", data.numero_id);
  setDoc(docRef, data)
    .then(() => {
      emit("clienteGuardado");
      $q.notify({
        message: "Cliente guardado exitosamente",
        color: "accent",
      });
    })
    .catch((err) => console.log(err));
}
</script>

<style scoped>
.complete {
  max-height: 100vh;
}
</style>
