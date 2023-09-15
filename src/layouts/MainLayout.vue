<template>
  <QDialogo v-model="modalPrestamoOpened" iconModal="real_estate_agent">
    <PrestamosFormVue @prestamoGuardado="modalPrestamoOpened = false" />
  </QDialogo>

  <QDialogo v-model="Codigo" iconModal="view_week">
    <BarcodeGenerator />
  </QDialogo>
  <QDialogo v-model="modalDevolverOpened" iconModal="real_estate_agent">
    <DevolverPrestamo @devuelto="modalDevolverOpened = false" />
  </QDialogo>

  <q-layout view="hHh lpR fFf" class="page-background-gray">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Sena Stock Management App </q-toolbar-title>
        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <q-btn
          color="accent"
          class="q-mx-sm"
          icon="view_week"
          @click="Codigo = true"
          label="Codigo Barra"
        />
        <q-btn
          color="accent"
          class="q-mx-sm"
          icon="real_estate_agent"
          @click="modalPrestamoOpened = true"
          label="Crear prestamo"
        />
        <q-btn
          color="accent"
          class="q-mx-sm"
          icon="autorenew"
          @click="modalDevolverOpened = true"
          label="Devolver"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
        <q-btn
          class="flex justify-cente"
          @click="logout()"
          label="Cerrar sesión"
          style="color: red; margin: auto; margin-top: 30px"
        />
      </q-scroll-area>

      <q-img class="absolute-top perfil" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="50px" class="q-mb-sm" style="margin-bottom: -1px">
            <q-img src="/img/icono.png" />
          </q-avatar>
          <div v-if="userCredential">
            <div
              class="text-weight-medium text-black"
              style="margin-bottom: -15px"
            >
              <span>{{ userCredential.email }}</span>
              <p class="text-subtitle1 text-accent">
                Almacen: {{ userCredential.almacen }}
              </p>
            </div>
          </div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
//importación cierre de sesión
import { signOut } from "firebase/auth";
import { auth } from "src/firebaseInit";
//redireccion
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import PrestamosFormVue from "components/prestamos/PrestamosFormVue.vue";
import BarcodeGenerator from "components/dashboard/BarcodeGenerator.vue";
import DevolverPrestamo from "components/prestamos/DevolverPrestamo.vue";

import QDialogo from "components/utils/QDialogo.vue";
const modalDevolverOpened = ref(false);

const userCredential = ref({});
const user = inject("user") || "raro";
const Codigo = ref(false);
const modalPrestamoOpened = ref(false);

const linksList = ref([
  {
    title: "Productos",
    caption: "Productos de almacén TICs",
    icon: "inventory",
    to: "/productos",
  },
  {
    title: "Usuarios",
    caption: "Profesores y aprendices del SENA registrados",
    icon: "people_alt",
    to: "/clientes",
  },
  {
    title: "Dashboard",
    caption: "Estadísticas y últimos movimientos",
    icon: "dashboard",
    to: "/dashboard",
  },
  {
    title: "Préstamos",
    caption: "Productos de almacén TICs",
    icon: "shopping_cart",
    to: "/prestamos",
  },
  {
    title: "Movimientos",
    caption: "Entradas y salidas de productos",
    icon: "compare_arrows",
    to: "/movimientos",
  },
  {
    title: "Permisos de cuentas",
    caption: "Autorización a nuevos usuarios",
    icon: "supervisor_account",
    to: "/cuentas",
  },
]);

function logout() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      router.push("/login");
    })
    .catch((error) => {});
}
//cierre de sesión del usuario
const router = useRouter();

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

(async () => {
  console.log(localStorage.getItem("user"));
  userCredential.value = await JSON.parse(localStorage.getItem("user"));
  console.log(localStorage.getItem("user"));
})();
</script>

<style scoped>
.perfil {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(128, 128, 128, 0.2391806722689075) 51%,
    rgba(250, 254, 255, 1) 100%
  );
}
</style>
