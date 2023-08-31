<template>
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
  </div>

  <q-page class="flex flex-center"> </q-page>
</template>

<script setup>
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import { db } from "src/firebaseInit";
import { ref } from "vue";
import DatePicker from "components/utils/DatePicker.vue";

const options = ref(["Hola", "care", "nalgas"]);
const name = ref("");
const age = ref("");
const pais = ref("");
const dueDate = ref(new Date().toLocaleDateString());

const tabla = collection(db, "customers");
const onSubmit = async () => {
  const docRef = await addDoc(tabla, {
    name: name.value,
    age: age.value,
    algo: pais.value,
  });
};

const data = ref([]);
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
