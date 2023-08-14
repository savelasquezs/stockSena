<template>
  <div class="bg-grey-2 flex justify-around" style="height: 100vh">
    <!-- Inicio tarjeta central -->
    <div class="q-pa-md q-gutter-md" style="width: 70%; padding: 20px">
      <div class="flex no-wrap justify-evenly">
        <TarjetaEstad
          icono="settings"
          titulo="586"
          subtitulo="Config"
          iconColor="light-blue-13"
        />
        <TarjetaEstad
          icono="settings"
          titulo="586"
          subtitulo="Config"
          iconColor="light-blue-13"
        />

        <TarjetaEstad
          icono="settings"
          titulo="586"
          subtitulo="Config"
          iconColor="light-blue-13"
        />
        <TarjetaEstad
          icono="settings"
          titulo="586"
          subtitulo="Config"
          iconColor="light-blue-13"
        />
      </div>
      <!-- Fin tarjetas centrales  -->

      <!-- grafica_principal -->
      <GraficasView idCanvas="mycanvas" />

      <!-- fin_grafica_principal -->
    </div>

    <div class="pequeño shadow-2" style="padding: 20px">
      <!-- inicio tarjetas laterales -->
      <div class="flex no-wrap justify-evenly">
        <TarjetaEstad
          icono="settings"
          titulo="586"
          subtitulo="Config"
          iconColor="light-blue-13"
        />
        <TarjetaEstad
          icono="settings"
          titulo="586"
          subtitulo="Config"
          iconColor="light-blue-13"
        />
      </div>
      <!-- fin tarjetas laterales infe -->
    </div>
  </div>
</template>

<script setup>
import TarjetaEstad from "./TarjetaEstad.vue";
import GraficasView from "components/dashboard/GraphVue.vue";
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  height:112px
  max-width: 180px
</style>
<style lang="sass" scoped>
.my-card-r
  width: 100%
  max-width: 180px
</style>
