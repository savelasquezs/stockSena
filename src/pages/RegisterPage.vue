<template>
  <div class="flex flex-center content-center">
    <div class="form-container">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div class="logo-container">
          <q-img src="/img/Sena.png" width="125px" style="top: -25px" />
        </div>

        <q-input
          filled
          type="text"
          v-model="username"
          label="Ingresa tu nombre *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          filled
          type="email"
          v-model="email"
          label="Ingresa tu email *"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          filled
          type="password"
          v-model="password1"
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
          v-model="password2"
          label="Repita su contraseña *"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Ingresa tu contraseña correcta',
            (val) => val == password1 || 'la contraseña no coincide',
          ]"
        />
        <q-btn label="Registrar" type="submit" color=" primary" />

        <q-btn @click="returnManejo()" color="primary" label="Regresar" />
      </q-form>
    </div>

    <div class="message-container">
      <div class="success-message" v-if="successMessage">
        {{ successMessage }}
      </div>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { httpsCallable } from "firebase/functions";

import { createUserWithEmailAndPassword } from "firebase/auth";
//redireccion de rutas
import { useRouter } from "vue-router";
import { useDatabaseStore } from "src/stores/DatabaseStore";
import { auth } from "src/firebaseInit";
const databaseStore = useDatabaseStore();

const router = useRouter();
const email = ref("");
const password1 = ref("");
const password2 = ref("");
const username = ref("");
const usuarioBD = JSON.parse(localStorage.getItem("user"));
const successMessage = ref("");
const errorMessage = ref("");

function showSuccessMessage(message) {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = "";
  }, 3000);
}

function showErrorMessage(message) {
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = "";
  }, 3000);
}

function onSubmit() {
  const almacen = JSON.parse(localStorage.getItem("user")).almacen;
  if (password1.value == password2.value) {
    createUserWithEmailAndPassword(auth, email.value, password1.value).then(
      (credentials) => {
        console.log(credentials);
        const uid = credentials.user.uid;
        const data = {
          name: username.value,
          almacen,
          email: email.value,
          role: "invitado",
        };
        databaseStore.setElement(data, "users", uid);
        //crear el nuevo usuario en la base de datos
      }
    );
  }
}
</script>

<style>
.paginaCompleta {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}

.form-container {
  max-width: 600px;
  background-color: #fff; /* Cambia el color de fondo del formulario */
  padding: 100px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Agrega sombra al formulario */
}
.logo-container {
  text-align: center;
  margin-bottom: 20px;
}
.message-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 100%;
  z-index: 9999;
}

.success-message,
.error-message {
  padding: 10px 20px;
  border-radius: 5px;
  margin: 5px;
  opacity: 0.9;
  transition: opacity 0.5s;
}

.success-message {
  background-color: #4caf50;
  color: white;
}

.error-message {
  background-color: #f44336;
  color: white;
}
</style>
