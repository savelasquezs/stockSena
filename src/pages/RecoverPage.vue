<!-- Fecha documentación 4/09/23 -->
<!-- Este código crea una página de recuperación de contraseña para un almacén utilizando 
  Vue.js y Firebase. Los usuarios pueden ingresar su dirección de correo electrónico 
  y recibir un correo electrónico de recuperación de contraseña si el correo electrónico 
  es válido. También pueden regresar a la página de inicio de sesión. -->
<template>
  <div class="q-pa-md q-gutter-md q-flex">
    <div>
      <h5 class="text-h5 q-mb-md" style="">INGRESA A TU ALMACÉN</h5>
      <p class="q-mb-md" style="color: #858282">
        Ingresa con tu email y contraseña de tu almacén
      </p>
    </div>
    <!-- Se utiliza el componente q-input de Quasar para crear campos de entrada de
    texto para el correo electronico -->
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
    <!-- Se utiliza el componente q-btn de Quasar para crear un 
    boton recuperar contraseña-->
    <div class="q-gutter-md">
      <q-btn
        @click="recoverPasword"
        color="primary"
        label="Recuperar contraseña"
      />
      <!-- Se utiliza el componente q-btn de Quasar para crear un 
    boton de regreso a la pagina de inicio de sesion-->
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

// Se importa auth y sendPasswordResetEmail de Firebase para manejar la autenticación y
// enviar correos electrónicos de recuperación de contraseña.
import { auth } from "src/firebaseInit";
import { sendPasswordResetEmail } from "firebase/auth";

//Redireccion de rutas
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
    });
}
function isEmailValid() {
  // Aquí verificamos si el correo contiene la extensión "@misena.edu.co"
  return email.value.endsWith("@misena.edu.co");
}
// returnLogin es una función que redirige al usuario a la página de inicio de sesión
// cuando se hace clic en el botón "Regresar".
function returnLogin() {
  router.push("/login");
}
</script>

<style>
.paginaCompleta {
  height: 100vh;
}
</style>
