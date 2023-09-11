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
import CuentasManejoVue from "./pages/CuentasManejo.vue";

const productosStore = useProductosStore();
const DatabaseStore = useDatabaseStore();
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
    await getDoc(doc(collection(db, "users"), uid)).then((doc) => {
      if (doc.exists()) {
        localStorage.setItem("user", JSON.stringify(doc.data()));
        usuario.value = doc.data();
        router.push("/");
      }
    });
  } else {
    localStorage.setItem("user", "");
  }
});
</script>
