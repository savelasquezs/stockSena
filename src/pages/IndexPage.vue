<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          v-model="name"
          label="Your name *"
          hint="Name and surname"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          filled
          type="number"
          v-model="age"
          label="Your age *"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Please type your age',
            (val) => (val > 0 && val < 100) || 'Please type a real age',
          ]"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
        <autocomplete-input
          :stringOptions="options"
          @cambioModel="(algo) => (pais = algo)"
        />
      </q-form>
    </div>
    <q-list bordered separator>
      <q-item clickable v-ripple v-for="registro in data" :key="registro.docId">
        <q-item-section>{{ registro.name }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import { db } from "src/firebaseInit";
import { ref } from "vue";

const options = ref(["Hola", "care", "nalgas"]);
const name = ref("");
const age = ref("");
const pais = ref("");

const tabla = collection(db, "customers");
const onSubmit = async () => {
  const docRef = await addDoc(tabla, {
    name: name.value,
    age: age.value,
    algo: pais.value,
  });
  console.log(
    "the data was saved successfully with id: ",
    docRef.id,
    docRef.data
  );
};

const data = ref([]);
onSnapshot(tabla, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      data.value.push({ docId: change.doc.id, ...change.doc.data() });
    }
    if (change.type === "modified") {
      console.log("Modified city: ", change.doc.data());
    }
    if (change.type === "removed") {
      console.log("Removed city: ", change.doc.data());
    }
  });
});
</script>
