<template>
  <router-view />
</template>

<script setup>
import { useQuasar } from "quasar";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebaseInit";
import { provide, ref } from "vue";
import { useProductosStore } from "stores/productosStore";
import { useRouter } from "vue-router";
import { useDatabaseStore } from "stores/DatabaseStore";

const $q = useQuasar();

const router = useRouter();
import { collection, doc, getDoc } from "firebase/firestore";
const productosStore = useProductosStore();
const DatabaseStore = useDatabaseStore();
console.log(DatabaseStore);
DatabaseStore.escucharCambios(
  productosStore,
  "products",
  "nombre",
  "productosDatabase"
);

const usuario = ref("");
provide("user", usuario);

let timer;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user.email);
    localStorage.setItem("user", user.email);
    await getDoc(doc(collection(db, "users"), uid)).then((doc) => {
      if (doc.exists()) {
        console.log(doc.data().almacen);
        localStorage.setItem("user", JSON.stringify(doc.data()));
        usuario.value = doc.data();
      }
    });

    console.log("El usuario inicio la sesión (app)");
  } else {
    console.log("El usuario cerro sesion (app)");
    localStorage.setItem("user", "");
  }
});
</script>
