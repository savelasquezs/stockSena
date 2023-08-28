<template>
  <div class="flex flex-center content-center paginaCompleta">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-img
        src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png"
        loading="lazy"
        spinner-color="white"
        width="150px"
        class=""
        />
        <q-input
        filled
        type="text"
        v-model="username"
        label="Ingrese su nombre *"
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
              (val !== null && val !== '') || 'Ingresa tu contraseña correcta',(val) =>
              (val == password1) || 'la contraseña no coincide',
          ]"
        />



        <div>
          <q-btn label="Registrar" type="submit" color="primary" />
          <q-btn @click="returnLogin()" color="primary" label="Regresar" />
        </div>
      </q-form>
    </div>
  </div>

  <div class="message-container">
    <div class="success-message" v-if="successMessage">{{ successMessage }}</div>
    <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
  </div>

</template>

<script setup>
import { ref } from "vue";
import {sendEmailVerification,signOut,updateProfile,} from "firebase/auth";
import { auth, db } from "src/firebaseInit";
import { createUserWithEmailAndPassword } from "firebase/auth";
//redireccion de rutas
import { useRouter } from "vue-router";
import { doc, setDoc } from "firebase/firestore";


const router = useRouter();
const email = ref("");
const password1 = ref("");
const password2=ref("")
const username=ref("")
//const usuarioBD=JSON.parse(localStorage.getItem("user"));
const successMessage=ref("");
const errorMessage= ref("");


function showSuccessMessage(message){
  successMessage.value=message;
  setTimeout(()=>{
    successMessage.value="" ;

  },3000);
}

function showErrorMessage(message){
  errorMessage.value= message;
  setTimeout (()=>  {
    errorMessage.value="";
  },3000)
}


function onSubmit() {
  // if (!isEmailValid()) {
  //   alert("Por favor, ingresa un correo válido de @misena.edu.co");
  //   return;
  // }

  //Registrar un usuario
  createUserWithEmailAndPassword(auth, email.value, password1.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      updateProfile(user, {displayName:username.value})
      const almacen=localStorage.getItem("almacen") || ""
      const userData={
        email:user.email,
        displayName:username.value,
        role:"invitado",
        almacen:usuarioBD.almacen

      };
      const docRef=doc(db, 'users', user.uid)

      setDoc(docRef,userData)
      .then(()=>{
      console.log("user acepted");
      })
      .catch ((error)=>{
        console.error("error adding document: ", error);
        });

      sendEmailVerification(userCredential.user);
      signOut(auth);
      // ...
      returnLogin();

      showSuccessMessage("Usuario registrado exitosamente");

    })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode,errorMessage)
      // ..
    });

    showErrorMessage("No se pudo registrar el usuario");

  }



// function isEmailValid() {
//   // Aquí verificamos si el correo contiene la extensión "@misena.edu.co"
//   return email.value.endsWith("@misena.edu.co");
// }

function returnLogin() {
  router.push("/login");
}
</script>

<style>
.paginaCompleta {
  height: 100vh;
}
/* ... (otros estilos) ... */
.message-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 100%;
  z-index: 9999;
}

.success-message, .error-message {
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
