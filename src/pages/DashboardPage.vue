<template>
  <!-- lado izquierdo -->
  <div class="bg-grey-4 flex justify-around papaDeTodo">
    <!-- Inicio tarjeta central -->
    <div class="q-pa-md q-gutter-md" style="width: 70%; padding: 20px">
      <div class="flex no-wrap justify-evenly">
        <TarjetaEstad
          icono="event_available"
          titulo="202"
          subtitulo="Total de préstamos"
          iconColor="light-blue-13"
        />
        <TarjetaEstad
          icono="transfer_within_a_station"
          titulo="586"
          subtitulo="Devoluciones"
          iconColor="light-blue-13"
        />

        <TarjetaEstad
          icono="social_distance"
          titulo="300"
          subtitulo="Cambios"
          iconColor="light-blue-13"
        />
        <TarjetaEstad
          icono="error"
          titulo="121"
          subtitulo="Produc. agotados"
          iconColor="light-blue-13"
        />
      </div>
      <!-- Fin tarjetas centrales  -->

      <!-- grafica_principal -->

      <GraphPrueba
        idCanvas="pruebaCanvas"
        class="bg-white"
        style="max-height: 300px; text-align: center"
      />

      <!-- importacion de la tabla -->
      <TablaVue />
      <!-- fin importacion de la tabla -->
    </div>

    <!-- fin de lado derecho -->
    <div class="pequeño shadow-2 flex column" style="padding: 20px; gap: 2rem">
      <!-- inicio tarjetas laterales superiores -->
      <div class="flex no-wrap justify-evenly">
        <TarjetaEstad
          icono="inventory"
          titulo="586"
          subtitulo="Productos"
          iconColor="light-blue-13"
        />
        <TarjetaEstad
          icono="settings"
          titulo="586"
          subtitulo="Prestados"
          iconColor="light-blue-13"
        />
      </div>
      <div class="flex no-wrap justify-evenly">
        <TarjetaEstad
          icono="settings"
          titulo="586"
          subtitulo="Profesores"
          iconColor="light-blue-13"
        />
        <TarjetaEstad
          icono="settings"
          titulo="586"
          subtitulo="Estudiantes"
          iconColor="light-blue-13"
        />
      </div>
      <div class="shadow-3 bg-white" style="border-radius: 5px">
        <GraficasView idCanvas="myCanvas" />
      </div>

      <div class="shadow-3">
        <div class="flex justify-between items-center q-pa-sm">
          <span class="subtitle-1"> Productos de bajo Stock</span>
          <q-btn icon="visibility" />
        </div>
        <q-list
          bordered
          padding
          class="rounded-borders"
          style="max-width: 350px"
        >
          <LowStockItem
            v-for="item in lowStockItems"
            :key="item.name"
            :avatar-color="item.avatarColor"
            :icon="item.icon"
            :icon-color="item.iconColor"
            :name="item.name"
            :remaining-quantity="item.remainingQuantity"
          />
        </q-list>
      </div>
    </div>
  </div>

  <BarcodeGenerator />
</template>

<script setup>
import BarcodeGenerator from "components/dashboard/BarcodeGenerator.vue";
import TarjetaEstad from "components/dashboard/TarjetaEstad.vue";
import GraficasView from "components/dashboard/GraphVue.vue";
import TablaVue from "components/dashboard/TablaVue.vue";
import GraphPrueba from "components/dashboard/PruebaVue.vue";
import LowStockItem from "components/dashboard/LowStockItem.vue";

const lowStockItems = [
  {
    avatarColor: "accent",
    icon: "highlight_off",
    iconColor: "yellow-3",
    name: "Computador",
    remainingQuantity: "2",
  },
  {
    avatarColor: "accent",
    icon: "priority_high",
    iconColor: "yellow-3",
    name: "Destornillador",
    remainingQuantity: "12",
  },
  {
    avatarColor: "accent",
    icon: "notification_important",
    iconColor: "yellow-3",
    name: "Taladro",
    remainingQuantity: "1",
  },
  {
    avatarColor: "accent",
    icon: "notification_important",
    iconColor: "yellow-3",
    name: "Microfono",
    remainingQuantity: "5",
  },
  {
    avatarColor: "accent",
    icon: "battery_alert",
    iconColor: "yellow-3",
    name: "Cuadernos",
    remainingQuantity: "4",
  },
];
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  height:112px
  max-width: 250px
</style>
<style lang="sass" scoped>
.my-card-r
  width: 100%
  max-width: 180px
</style>

<style scoped>
.search-icon,
.clear-icon {
  padding: 6px;
  cursor: pointer;
}

.search-input {
  border: none;
  flex: 1;
  padding: 6px;
  outline: none;
}
</style>
