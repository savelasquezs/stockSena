<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      filled
      type="textarea"
      v-model="name"
      label="Ingrese su nombre *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input
      filled
      type="email"
      v-model="email"
      label="Ingresa tu correo *"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />

    <q-input
      filled
      type="password"
      v-model="password"
      label="Ingresa tu contraseña *"
      lazy-rules
      :rules="[
        (val) =>
          (val !== null && val !== '') || 'Ingresa tu contraseña correcta',
      ]"
    />
    <q-input
      filled
      type="password"
      v-model="password"
      label="Repita su contraseña *"
      lazy-rules
      :rules="[
        (val) =>
          (val !== null && val !== '') || 'Ingresa tu contraseña correcta',
      ]"
    />
    <div class="q-gutter-md">
      <q-btn label="Registrar" type="submit" color="primary" />
      <q-btn @click="returnLogin()" color="primary" label="Regresar" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "src/firebaseInit";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

//redireccion de rutas
import { useRouter } from "vue-router";
const router = useRouter();
const email = ref("");
const password = ref("");
const name = ref("");

function onSubmit() {
  if (!isEmailValid()) {
    alert("Por favor, ingresa un correo válido de @misena.edu.co");
    return;
  }

  //Registrar un usuario

  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, name.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      sendEmailVerification(userCredential.user);
      signOut(auth);
      // ...
      returnLogin();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}
sendEmailVerification;
function isEmailValid() {
  // Aquí verificamos si el correo contiene la extensión "@misena.edu.co"
  return email.value.endsWith("@misena.edu.co");
}

function returnLogin() {
  router.push("/login");
}
</script>

<style>
.paginaCompleta {
  height: 100vh;
}
</style>
