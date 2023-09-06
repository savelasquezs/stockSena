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
      <h5 class="text-h5 q-mb-md" style="">INGRESA A TU ALMACÉN</h5>
      <p class="q-mb-md" style="color: #858282">
        <!-- Se utiliza el componente q-input de Quasar para crear campos de entrada de texto para el correo electronico -->
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
        <!-- Se utiliza el componente q-input de Quasar para crear campos de entrada de texto para la contraseña. -->
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
        <!-- q-btn tipo sumbmit para el ingreso a la pagina principal -->
        <q-btn
          label="Ingresa"
          type="submit"
          color="primary"
          class="q-gutter-ml"
          style="width: 370px; height: 45px"
        />
        <!--La recuperacion de la contraseña -->
        <p style="text-align: center; margin-top: 20px">
          <span
            style="color: #1976d2; cursor: pointer"
            @click="recoverPasword()"
          >
          </span>
        </p>
        <!-- Opcion de registro -->
        <p style="text-align: center; margin-top: 20px">
          <span> ¿No tienes cuenta? </span>
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
// Importacion de funciones de Firebase Authentication necesarias, signInWithEmailAndPassword y sendPasswordResetEmail
// para restablecimiento.
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "src/firebaseInit";
import { sendPasswordResetEmail } from "firebase/auth";

//redireccion de rutas
import { useRouter } from "vue-router";
import { collection, doc, getDoc } from "firebase/firestore";
const router = useRouter();
const email = ref("");
const password = ref("");

// La función onSubmit se encarga de manejar el evento de envío del formulario.
// Cuando el usuario presiona el botón "Ingresar", esta función intenta iniciar sesión
// utilizando el correo electrónico y la contraseña proporcionados.
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
// Funcion para registrarse
function registerUser() {
  router.push("/register");
}
</script>
<style>
.paginaCompleta {
  height: 100vh;
}
</style>
