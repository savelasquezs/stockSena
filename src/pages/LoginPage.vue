<template>
  <div class="flex flex-center">
    <div>
      <h5 class="text-h5 flex flex-center">BIENVENIDO/A</h5>
      <p class="q-mb-md" style="color: #858282">
        Ingresa Correo y Contraseña de tu almacén
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
          :rules="[
            (val) => (val && val.length > 0) || 'El correo no puede ir vacio',
          ]"
        />

        <q-input
          filled
          type="password"
          v-model="password"
          label="Ingresa tu contraseña *"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Debes ingresar una contraseña',
          ]"
        />

        <q-btn
          label="Ingresa"
          type="submit"
          color="primary"
          class="q-gutter-ml"
          style="width: 370px; height: 45px"
          :loading="loadingLogin"
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
          <span style="color: #1976d2; cursor: pointer" @click="registerUser">
          </span>
        </p>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, ref } from "vue";

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
const loadingLogin = ref(false);

let failedLoginAttempts = 0; // Contador de intentos fallidos
const maxFailedAttempts = 3; // Límite de intentos fallidos antes de mostrar la opción de recuperación de contraseña

function onSubmit() {
  errorMessage.value = "";
  loadingLogin.value = true;

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      failedLoginAttempts = 0; // Restablecer el contador de intentos fallidos en caso de inicio de sesión exitoso

      Notify.create({
        type: "positive",
        message: "Inicio de sesión exitoso",
        position: "top",
        timeout: 3000,
      });
      router.push("/");
    })
    .catch((error) => {
      loadingLogin.value = false;
      const errorCode = error.code;
      let errorMessage = "Error desconocido";

      switch (errorCode) {
        case "auth/invalid-email":
          errorMessage = "Correo electrónico inválido";
          break;
        case "auth/user-not-found":
          errorMessage = "Usuario no encontrado, inténtalo de nuevo";
          break;
        case "auth/wrong-password":
          errorMessage = "La contraseña es incorrecta, inténtalo de nuevo";
          failedLoginAttempts++; // Incrementar el contador de intentos fallidos
          break;
      }

      Notify.create({
        type: "negative",
        message: errorMessage,
        position: "top",
        timeout: 3000,
      });

      // Verificar si se supera el límite de intentos fallidos
      if (failedLoginAttempts >= maxFailedAttempts) {
        // Mostrar un mensaje para recuperar la contraseña
        Notify.create({
          type: "warning",
          message:
            "Has superado el límite de intentos fallidos. ¿Deseas recuperar tu contraseña?",
          position: "top",
          timeout: 5000, // Aumenta el tiempo para dar tiempo al usuario de hacer clic en el enlace/botón
          actions: [
            {
              label: "Recuperar Contraseña",
              color: "positive",
              handler: () => {
                router.push("/recover");
              },
            },
          ],
        });
      }
    });
}

function recoverPassword() {
  router.push("/recover");
}

function registerUser() {
  router.push("/register");
}

onUnmounted(() => {
  loadingLogin.value = false;
});
</script>

<style>
.paginaCompleta {
  height: 100vh;
}
</style>
