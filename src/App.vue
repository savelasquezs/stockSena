<template>
  <router-view />
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseInit";
import { provide, ref } from "vue";

const userEmail = ref("");
provide("userEmail", userEmail);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(user.email);
    userEmail.value = user.email;
    console.log("El usuario inicio la sesión (app)");
    // ...
  } else {
    console.log("El usuario cerro sesion (app)");
    // ...
  }
});
</script>
