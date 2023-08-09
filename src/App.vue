<template>
  <router-view />
  <li>
    {{ productosStore.productosDatabase }}
  </li>
</template>

<script setup>
import { useQuasar } from "quasar";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseInit";
import { provide, ref } from "vue";
import { useProductosStore } from "stores/productosStore";
import { useRouter } from "vue-router";

const $q = useQuasar();

const router = useRouter();

const productosStore = useProductosStore();
productosStore.listenChanges();
const userEmail = ref("");
provide("userEmail", userEmail);
let timer;

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(user.email);
    localStorage.setItem("user", user.email);
    userEmail.value = user.email;
    console.log("El usuario inicio la sesión (app)");
    timer = setTimeout(async () => {
      await signOut(auth);
      router.push("/login");
      $q.notify("Ha superado el tiempo de inactividad");
      $q.notify("Ha superado el tiempo de inactividad");
      $q.dialog({
        title: "Sesión Expirada",
        message: "Se supero el tiempo de inactividad",
      });
      console.log("Ya");
      document.addEventListener("mousemove", resetTimer);
      document.addEventListener("mousedown", resetTimer);
      document.addEventListener("keypress", resetTimer);
      document.addEventListener("touchmove", resetTimer);
    }, 1000 * 60);
    // ...
  } else {
    console.log("El usuario cerro sesion (app)");
    localStorage.setItem("user", "");
    clearTimeout(timer);
    document.removeEventListener("mousemove", resetTimer);
    document.removeEventListener("mousedown", resetTimer);
    document.removeEventListener("keypress", resetTimer);
    document.removeEventListener("touchmove", resetTimer);
    // ...
  }
});

function resetTimer() {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    await signOut(auth);
    router.push("/login");
    $q.dialog({
      title: "Sesión Expirada",
      message: "Se supero el tiempo de inactividad",
    });
  }, 1000 * 60);
}
</script>
