<template>
  <div class="flex flex-center content-center paginaCompleta">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="recoverPasword" class="q-gutter-md">
        <q-img
          src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png"
          loading="lazy"
          spinner-color="white"
          width="300px"
          class=""
        />
        <q-input
          filled
          type="email"
          v-model="email"
          label="Ingresa tu correo *"
          hint="Correo electronico"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />
      </q-form>
      <div>
        <q-btn
          @click="recoverPasword"
          color="primary"
          label="Recuperar contraseña"
        />
      </div>
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
      console.log("recuperando contraseña");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      console.log(errorCode, errorMessage);
      console.log();
    });
}

function isEmailValid() {
  // Aquí verificamos si el correo contiene la extensión "@misena.edu.co"
  return email.value.endsWith("@misena.edu.co");
}
</script>

<style>
.paginaCompleta {
  height: 100vh;
}
</style>
