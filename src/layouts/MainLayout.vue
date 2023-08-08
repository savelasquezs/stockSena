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

        <q-toolbar-title> Quasar App </q-toolbar-title>
        <div>
          <p class="text-subtitle1 q-ma-sm">{{ userEmail }}</p>
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
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">Razvan Stoenescu</div>
          <div>@rstoenescu</div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { defineComponent, inject, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
//importación cierre de sesión
import { signOut } from "firebase/auth";
import { auth } from "src/firebaseInit";
//redireccion
import { useRouter } from "vue-router";

const userEmail = inject("userEmail");

const linksList = ref([
  {
    title: "Productos",
    caption: "Productos de almacen tics",
    icon: "inventory",
    to: "/productos",
  },
  {
    title: "Usuarios",
    caption: "Profesores y aprendices Sena registrados",
    icon: "people_alt",
    to: "/clientes",
  },
  {
    title: "Dashboard",
    caption: "Estadisticas y ultimos movimientos",
    icon: "dashboard",
    to: "/dashboard",
  },
  {
    title: "Prestamos",
    caption: "productos de Almacen tics",
    icon: "shopping_cart",
    to: "/prestamos",
  },
]);

//cierre de sesión del usuario
const router = useRouter();

function cerrarSesion() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("sesión cerrada exitosamente c:");
      router.push("/login");
    })
    .catch((error) => {});
}

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
