<template>
  <div class="q-pa-md q-gutter-md q-flex">
    <div>
      <h5 class="text-h5 q-mb-md" style="">INGRESA A TU ALMACÉN</h5>
      <p class="q-mb-md" style="color: #858282">
        Ingresa con tu email y contraseña de tu almacén
      </p>
    </div>
    <div class="">
      <q-form @submit="recoverPasword" class="">
        <q-input
          filled
          type="email"
          v-model="email"
          label="Ingresa tu correo *"
          lazy-rules
          style="width: 340px"
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
      </q-form>
    </div>

    <div class="q-gutter-md">
      <q-btn
        @click="recoverPasword"
        color="primary"
        label="Recuperar contraseña"
      />
      <q-btn
        @click="returnLogin()"
        label="Regresar"
        style="background-color: red; color: #ffff"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { auth } from "src/firebaseInit";
import { sendPasswordResetEmail } from "firebase/auth";

//redireccion de rutas
import { useRouter } from "vue-router";
const router = useRouter();
const email = ref("");
const password = ref("");

function recoverPasword() {
  if (!isEmailValid()) {
    alert("Por favor, ingresa un correo válido de @misena.edu.co");
    return;
  }
  sendPasswordResetEmail(auth, email.value)
    .then(() => {
      // Password reset email sent!
      // ..
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

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
