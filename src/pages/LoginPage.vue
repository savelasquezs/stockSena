<template>
  <div class="flex flex-center">
    <div>
      <h5 class="text-h5 q-mb-md">INGRESA A TU ALMACÉN</h5>
      <p class="q-mb-md" style="color: #858282">
        Ingresa Correo y Contraseña de tu Almacén
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

        <!-- Mostrar mensaje de error -->
        <p
          style="color: red; text-align: center; margin-top: 10px"
          v-if="errorMessage"
        >
          {{ errorMessage }}
        </p>

        <p style="text-align: center; margin-top: 20px">
          <span
            style="color: #1976d2; cursor: pointer"
            @click="recoverPassword"
          >
            Recuperar contraseña
          </span>
        </p>
        <p style="text-align: center; margin-top: 20px">
          <span> ¿No tienes cuenta? </span>
          <span style="color: #1976d2; cursor: pointer" @click="registerUser">
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
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { collection, doc, getDoc } from "firebase/firestore";
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref(""); // Variable para mostrar mensajes de error

function onSubmit() {
  // Limpiar mensajes de error anteriores
  errorMessage.value = "";

  // Realizar el inicio de sesión con Firebase

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      router.push("/");

      // Muestra una notificación de éxito
      Notify.create({
        type: "positive", // Tipo de notificación de éxito
        message: "Inicio de sesión exitoso",
        position: "top",
        timeout: 3000, // Duración de la notificación en milisegundos
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      let errorMessage = "Error desconocido"; // Mensaje predeterminado

      switch (errorCode) {
        case "auth/invalid-email":
          errorMessage = "Correo electrónico inválido";
          break;
        case "auth/user-not-found":
          errorMessage = "Usuario no encontrado, inténtalo de nuevo";
          break;
        case "auth/invalid-password":
          errorMessage = "Contraseña inválida";
          break;
        case "auth/wrong-password":
          errorMessage = "La contraseña es incorrecta, inténtalo de nuevo";
          break;
      }

      // Muestra notificacion de error
      Notify.create({
        type: "negative", // Tipo de notificación de error
        message: errorMessage,
        position: "top",
        timeout: 3000, // Duración de la notificación en milisegundos
      });

      console.error("Error al iniciar sesión", error.code);
    });
}

function recoverPassword() {
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
