<!-- Fecha documentación 4/09/23 -->
<!-- Este código crea una vista de inicio de sesión que permite a los usuarios ingresar
  con su correo electrónico y contraseña. Utiliza Firebase para la autenticación de 
  usuarios y Vue Router para la navegación entre páginas. Además, proporciona enlaces para
  recuperar la contraseña y registrar una nueva cuenta. La vista también incluye 
  validación de correo electrónico (aunque está comentada) y estilos para dar formato a la
  página. -->
<template>
  <div class="flex flex-center">
    <div>
      <h5 class="text-h5 q-mb-md">INGRESA A TU ALMACÉN</h5>
      <p class="q-mb-md" style="color: #858282">
        Ingresa con tu email y contraseña del tu almacen
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
        <!-- Se utiliza el componente q-input de Quasar para crear campos de entrada de texto para la contraseña. -->
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
        <!-- q-btn tipo sumbmit para el ingreso a la pagina principal -->
        <q-btn
          label="Ingresa"
          type="submit"
          color="primary"
          class="q-gutter-ml"
          style="width: 370px; height: 45px"
          :loading="loadingLogin"
        />
        <p style="text-align: center; margin-top: 20px">
          <span
            style="color: #1976d2; cursor: pointer"
            @click="recoverPassword"
          >
          </span>
        </p>
        <!-- Opcion de registro -->
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
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { collection, doc, getDoc } from "firebase/firestore";
const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref(""); // Variable para mostrar mensajes de error
const loadingLogin = ref(false);

// La función onSubmit se encarga de manejar el evento de envío del formulario.
// Cuando el usuario presiona el botón "Ingresar", esta función intenta iniciar sesión
// utilizando el correo electrónico y la contraseña proporcionados.
function onSubmit() {
  errorMessage.value = "";
  loadingLogin.value = true;
  // if (!isEmailValid()) {
  //   alert("Por favor, ingresa un correo válido de @misena.edu.co");
  //   return;
  // }

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
      loadingLogin.value = false;
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

onUnmounted(() => {
  loadingLogin.value = false;
});
</script>
<style>
.paginaCompleta {
  height: 100vh;
}
</style>
