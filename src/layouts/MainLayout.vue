<template>
  <QDialogo v-model="modalPrestamoOpened" iconModal="real_estate_agent">
    <PrestamosFormVue @prestamoGuardado="modalPrestamoOpened = false" />
  </QDialogo>

  <QDialogo v-model="Codigo" iconModal="view_week">
    <BarcodeGenerator />
  </QDialogo>

  <q-layout view="hHh lpR fFf">
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
        <q-btn @click="Codigo = true" label="Codigo Barra" />
        <q-btn @click="modalPrestamoOpened = true" label="Crear prestamo" />
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

      <q-img class="absolute-top" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="50px" class="q-mb-sm" style="margin-bottom: -1px">
            <q-img src="public\img\icono.png" />
          </q-avatar>
          <div v-if="userCredential">
            <div
              class="text-weight-medium text-black"
              style="margin-bottom: 8px"
            >
              <p>{{ userCredential.displayName }}</p>
              <p>Almacén: {{ userCredential.almacen }}</p>
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

import QDialogo from "components/utils/QDialogo.vue";

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
    icon: "real_estate_agent",
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
