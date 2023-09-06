<!-- Fecha documentación 4/09/23 -->
<!-- Este componente Vue.js representa una página web que muestra tarjetas
   y un componente de selección de fecha. Los datos ingresados en el formulario pueden 
   enviarse a Firebase Firestore, y los cambios en Firestore se reflejan en tiempo real 
   en la lista data. Además, se muestra la fecha seleccionada en la consola cuando se 
   utiliza el componente date-picker. -->
<template>
  <!-- Sección principal con tarjetas y un componente de selección de fecha -->
  <div class="flex justify-evenly q-mt-lg">
    <q-card class="my-card q-px-lg">
      <q-icon
        name="article"
        size="100px"
        color="primary"
        style="
           {
            margin: 0 auto;
          }
        "
      />
      <!--Importancion del componenete que permite visualizar el historial de los elementos
      almacenados -->
      <q-card-section>
        <div class="text-subtitle2 text-center">Historial</div>
      </q-card-section>
    </q-card>
    <q-card class="my-card q-px-lg">
      <q-icon
        name="article"
        size="100px"
        color="primary"
        style="
           {
            margin: 0 auto;
          }
        "
      />
      <q-card-section>
        <div class="text-subtitle2 text-center">Historial</div>
      </q-card-section>
    </q-card>

    <date-picker @guardarFecha="(fecha) => console.log(fecha)" />
  </div>
  <!-- Página principal -->
  <q-page class="flex flex-center"> </q-page>
</template>
<!-- Se utiliza onSnapshot para observar cambios en la colección tabla. 
  Cuando se agrega un nuevo documento (change.type === "added"), se agrega a la lista data. Cuando se modifica o elimina un documento, se muestra un mensaje en la consola. -->
<script setup>
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import { db } from "src/firebaseInit";
import { ref } from "vue";
import DatePicker from "components/utils/DatePicker.vue";

// Variables reactivas
const options = ref(["Hola", "care", "nalgas"]);
const name = ref("");
const age = ref("");
const pais = ref("");
const dueDate = ref(new Date().toLocaleDateString());
// Colección en Firestore
const tabla = collection(db, "customers");
// Función para enviar datos a Firestore
const onSubmit = async () => {
  const docRef = await addDoc(tabla, {
    name: name.value,
    age: age.value,
    algo: pais.value,
  });
};
// Lista reactiva para almacenar datos de Firestore
const data = ref([]);
// Observador de cambios en Firestore
onSnapshot(tabla, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      data.value.push({ docId: change.doc.id, ...change.doc.data() });
    }
    if (change.type === "modified") {
    }
    if (change.type === "removed") {
    }
  });
});
</script>
