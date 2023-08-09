<template>
  <router-view />

</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseInit";
import { provide, ref } from "vue";
import { useProductosStore } from "stores/productosStore";
import { collection, doc, getDoc } from "firebase/firestore";

const productosStore = useProductosStore();
productosStore.listenChanges();
productosStore.ponerValores();
const usuario = ref("");
provide("user", usuario);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(user.email);


    getDoc(doc(collection(db,'users'),uid))
    .then((doc)=>{
      if(doc.exists()){
        console.log(doc.data().almacen)
        localStorage.setItem("user", JSON.stringify(doc.data()))

        usuario.value = doc.data();
      }
    })

    console.log("El usuario inicio la sesión (app)");
    // ...
  } else {
    console.log("El usuario cerro sesion (app)");
    localStorage.setItem("user", "");

    // ...
  }
});
</script>
