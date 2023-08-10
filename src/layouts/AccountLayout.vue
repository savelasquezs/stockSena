<template>
  <q-layout view="hHh lpR fFf">
    <div class="flex content-evenly paginaCompleta">
      <div class="q-pa-md" style="display: flex; max-width: 100%; margin: auto">
        <!-- Imagen a la izquierda -->
        <div style="flex: 1" class="q-ml-xl">
          <q-img
            src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png"
            loading="lazy"
            spinner-color="white"
            width="300px"
          />
        </div>

        <!-- Datos de inicio de sesión a la derecha -->
        <div style="flex: 1; margin-left: 20px">
          <q-page-container>
            <router-view />
          </q-page-container>
        </div>
      </div>
    </div>
  </q-layout>
</template>
<style>
.paginaCompleta {
  height: 100vh;
}
</style>
