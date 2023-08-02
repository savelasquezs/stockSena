<template>
  <div class="flex flex-center content-center paginaCompleta">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          filled
          type="email"
          v-model="email"
          label="Ingresa tu correo *"
          hint="Correo electronico"
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

        <div>
          <q-btn label="Entrar" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "firebaseInit.js";
const email = ref("");
const password = ref("");

function onSubmit() {
  if (!isEmailValid()) {
    alert("Por favor, ingresa un correo válido de @misena.edu.co");
    return;
  }

  // Realizar el inicio de sesión con Firebase

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // El inicio de sesión fue exitoso, aquí puedes realizar acciones
      // como redireccionar al usuario a otra página o mostrar un mensaje de bienvenida.
      console.log("Inicio de sesión exitoso", userCredential.user);
    })
    .catch((error) => {
      // Si ocurre un error, puedes mostrar un mensaje de error al usuario.
      console.error("Error al iniciar sesión", error);
    });
}

function isEmailValid() {
  // Aquí verificamos si el correo contiene la extensión "@misena.edu.co"
  return name.endsWith("@misena.edu.co");
}
</script>

<style>
.paginaCompleta {
  height: 100vh;
}
</style>
