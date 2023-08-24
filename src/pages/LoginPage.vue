<template>
  <div class="flex flex-center">
    <div>
      <h5 class="text-h5 q-mb-md" style="">INGRESA A TU ALMACÉN</h5>
      <p class="q-mb-md" style="color: #858282">
        Ingresa con tu email y contraseña del tu alamcen
      </p>
    </div>
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          filled
          type="email"
          v-model="email"
          label="Ingresa tu correo*"
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

        <q-btn
          label="Ingresa"
          type="submit"
          color="primary"
          class="q-gutter-ml"
          style="width: 370px; height: 45px"
        />
        <p style="text-align: center; margin-top: 20px">
          <span
            style="color: #1976d2; cursor: pointer"
            @click="recoverPasword()"
          >
            Recuperar contraseña
          </span>
        </p>
        <p style="text-align: center; margin-top: 20px">
          <span> ¿No tienes cuenta </span>
          <span style="color: #1976d2; cursor: pointer" @click="registerUser()">
            Registrar Cuenta
          </span>
        </p>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "src/firebaseInit";
import { sendPasswordResetEmail } from "firebase/auth";

//redireccion de rutas
import { useRouter } from "vue-router";
import { collection, doc, getDoc } from "firebase/firestore";
const router = useRouter();
const email = ref("");
const password = ref("");

function onSubmit() {
  // if (!isEmailValid()) {
  //   alert("Por favor, ingresa un correo válido de @misena.edu.co");
  //   return;
  // }

  // Realizar el inicio de sesión con Firebase

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // El inicio de sesión fue exitoso, aquí puedes realizar acciones
      // como redireccionar al usuario a otra página o mostrar un mensaje de bienvenida.
      router.push("/");
      console.log("Inicio de sesión exitoso", userCredential.user);
    })
    .catch((error) => {
      // Si ocurre un error, puedes mostrar un mensaje de error al usuario.
      console.error("Error al iniciar sesión", error);
    });
}

function isEmailValid() {
  // Aquí verificamos si el correo contiene la extensión "@misena.edu.co"
  return email.value.endsWith("@misena.edu.co");
}

//Función para recuperar la contraseña
function recoverPasword() {
  router.push("/recover");
}
function registerUser() {
  router.push("/register");
}
</script>

<style>
.paginaCompleta {
  height: 100vh;
}
</style>
