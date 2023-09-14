<template>
  <div class="flex justify-evenly content-center complete items-center">
    <q-page class="flex content-center window-height">
      <div
        class="q-gutter-lg row justify-center items-center"
        v-if="userCredential.role == 'administrador'"
      >
        <router-link to="/register">
          <q-btn
            label="Registrar"
            type="submit"
            color="green-14"
            class="q-ml-sm"
            style="width: 110px"
          />
        </router-link>
        <q-btn
          label="Permisos"
          color="green-14"
          @click="openPermissionDialog"
        />
      </div>
    </q-page>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="permissionDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6"></div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense label="Correo electrónico" v-model="userEmail" />
          <q-select
            outlined
            label="Rol"
            v-model="selectedRole"
            :options="options_Rol"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn
            label="Aceptar"
            color="positive"
            v-close-popup
            @click="grantPermission"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <div class="flex justify-evenly content-center complete items-center">
    <q-list bordered class="rounded-borders">
      <q-expansion-item>
        <template v-slot:header="{ expanded }">
          <q-item-section avatar>
            <q-avatar>
              <q-img src="/img/icono.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            Datos del usuario {{ expanded ? "" : "" }}
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div v-if="userCredential">
              <h4>Usuario Activo</h4>
              <p>Nombre: {{ userCredential.displayName }}</p>
              <p>Correo electrónico: {{ userCredential.email }}</p>
              <p>Rol: {{ userCredential.role }}</p>
            </div>
            <div v-else>
              <h2>Usuario Activo</h2>
              <p>Ningún usuario autenticado</p>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth } from "firebase/auth";

import { Notify } from "quasar";
import {
  getFirestore,
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { useDatabaseStore } from "src/stores/DatabaseStore";

const options_Rol = ref(["administrador", "invitado"]);
const prompt = ref(false);
const agregar = ref("");
const expanded = ref(false);
const userCredential = ref(null);
const users = ref([]);
const auth = getAuth();
const db = getFirestore();
const permissionDialog = ref(false);
const userEmail = ref("");
const selectedRole = ref("");
const databaseStore = useDatabaseStore();

function openPermissionDialog() {
  permissionDialog.value = true;
}

async function grantPermission() {
  const q = query(
    collection(db, "users"),
    where("email", "==", userEmail.value)
  );
  const docs = await getDocs(q);
  if (docs.empty) {
    userEmail.value = "";
    selectedRole.value = "";
    Notify.create({
      position: "center",
      message: "El email ingresado no existe",
      color: "red-5",
      timeout: 500,
    });
    return;
  }
  const idPerson = docs.docs[0].id;
  databaseStore.updateElement({ role: selectedRole.value }, "users", idPerson);
}

userCredential.value = JSON.parse(localStorage.getItem("user"));
</script>

<style scoped>
.complete {
  max-height: 35vh;
}
</style>
