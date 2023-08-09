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
</template>

<script setup>
import { inject, ref } from "vue";
import {
  sendEmailVerification,

  signOut,

updateProfile,
} from "firebase/auth";
import { auth, db } from "src/firebaseInit";
import { createUserWithEmailAndPassword } from "firebase/auth";
//redireccion de rutas
import { useRouter } from "vue-router";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";


const router = useRouter();
const email = ref("");
const password1 = ref("");
const password2=ref("")
const username=ref("")

const usuarioBD=JSON.parse(localStorage.getItem("user"))



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

    })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode,errorMessage)
      // ..
    });

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
</style>
