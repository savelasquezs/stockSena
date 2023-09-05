<template>
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
        <div>
          <p class="text-subtitle1 q-ma-sm">{{ user.email }}</p>
        </div>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <q-btn @click="cerrarSesion" label="Cerrar Sesión" />
      </q-toolbar>
    </q-header>
    <!--
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

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
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="50px" class="q-mb-sm" style="margin-bottom: -1px;">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
            <div v-if="userCredential">

              <div class="text-weight-bold" style="margin-bottom: -15px;">
                  <p >{{ userCredential.email }}</p>
                  <p>{{ userCredential.almacen }}</p>
                  {{ userCredential.displayName}}
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

import { inject, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
//importación cierre de sesión
import { signOut } from "firebase/auth";
import { auth } from "src/firebaseInit";
//redireccion
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";

const userCredential = ref(null);
const user = inject("user") || "raro";

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

//cierre de sesión del usuario
const router = useRouter();

function cerrarSesion() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      router.push("/login");
    })
    .catch((error) => {});
}

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
userCredential.value = JSON.parse(localStorage.getItem("user"));
</script>
