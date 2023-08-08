<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      type="email"
      filled
      v-model="email"
      label="Ingresa tu correo *"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || 'Por favor ingresa tu correo',
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
          (val !== null && val !== '') || 'Ingresa tu contraseña correcta',
      ]"
    />

    <q-btn
      label="Entrar"
      type="submit"
      color="primary"
      class="q-gutter-ml"
      style="he"
    />
    <q-btn
      @click="recoverPasword()"
      color="primary"
      label="Recuperar contraseña"
    />
    <q-btn @click="registerUser()" color="primary" label="Registrar Cuenta" />
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "src/firebaseInit";
import { sendPasswordResetEmail } from "firebase/auth";

//redireccion de rutas
import { useRouter } from "vue-router";
const router = useRouter();
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
      if (userCredential.user.emailVerified) {
        router.push("/");
        console.log("Inicio de sesión exitoso", userCredential.user);
      } else {
        alert("Por favor verifica tu email");
        signOut(auth);
      }
      // El inicio de sesión fue exitoso, aquí puedes realizar acciones
      // como redireccionar al usuario a otra página o mostrar un mensaje de bienvenida.
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
