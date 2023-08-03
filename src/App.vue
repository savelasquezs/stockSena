<template>
  <router-view />
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseInit";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(user, uid);
    console.log("El usuario inicio la sesión (app)");
    // ...
  } else {
    console.log("El usuario cerro sesion (app)");
    // ...
  }
});
</script>
