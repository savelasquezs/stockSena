<!-- Día de la documentación: 05/09/2023

Descripción del archivo "DashboardPage.vue": -->
<template>
  <!-- Panel de control -->
  <div class="bg-grey-4 flex justify-around papaDeTodo">
    <!-- lado izquierdo -->
    <!-- Inicio tarjeta central -->
    <div class="q-pa-md q-gutter-md" style="width: 70%; padding: 20px">
      <!-- Tarjetas centrales con estadísticas -->
      <div class="flex no-wrap justify-evenly">
        <!-- Tarjeta para mostrar el total de préstamos -->
        <TarjetaEstad
          icono="event_available"
          :titulo="dashboardStore.prestamosQuantity"
          subtitulo="Total de préstamos"
          iconColor="accent"
        />
        <TarjetaEstad
          icono="transfer_within_a_station"
          titulo="586"
          subtitulo="Devoluciones"
          iconColor="light-blue-13"
        />
        <!-- Tarjeta para mostrar el número de cambios -->
        <TarjetaEstad
          icono="social_distance"
          titulo="300"
          subtitulo="Cambios"
          iconColor="light-blue-13"
        />
        <!-- Tarjeta para mostrar el número de productos agotados -->
        <TarjetaEstad
          icono="error"
          :titulo="dashboardStore.productosAgotados"
          subtitulo="Produc. agotados"
          iconColor="accent"
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
      <TableReuse
        :dataArray="prestamosStore.prestamosDatabase"
        :columns="prestamosStore.columns"
        title="Tabla de Prestamos"
        :internalColumns="prestamosStore.internalColumns"
        tablaUrl="productos"
        buscarPorFecha
      />
    </div>

    <!-- Sección derecha del panel de control -->
    <div class="pequeño shadow-2 flex column" style="padding: 20px; gap: 2rem">
      <!-- inicio tarjetas laterales superiores -->
      <div class="flex no-wrap justify-evenly">
        <!-- Tarjetas laterales superiores -->
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
          :titulo="dashboardStore.cantidadInstructores"
          subtitulo="Profesores"
          iconColor="accent"
        />
        <TarjetaEstad
          icono="settings"
          titulo="586"
          subtitulo="Estudiantes"
          iconColor="light-blue-13"
        />
      </div>
      <!-- Tarjetas laterales superiores -->
      <div class="shadow-3 bg-white" style="border-radius: 5px">
        <GraficasView idCanvas="myCanvas" />
      </div>
      <!-- Lista de productos de bajo stock -->
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
          <!-- Iteración sobre elementos de bajo stock -->
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
</template>

<script setup>
import BarcodeGenerator from "components/dashboard/BarcodeGenerator.vue";
import TarjetaEstad from "components/dashboard/TarjetaEstad.vue";
import GraficasView from "components/dashboard/GraphVue.vue";
import GraphPrueba from "components/dashboard/PruebaVue.vue";
import LowStockItem from "components/dashboard/LowStockItem.vue";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import stadisticTableBar from "components/utils/StadisticTableBar.vue";
import TableReuse from "components/utils/TableReuse.vue";
import { UseDashboardStore } from "stores/dashboardStore";

import { ref } from "vue";

const dashboardStore = UseDashboardStore();

const openedForm = ref(false);
const prestamosStore = UsePrestamosStore();
const dataTableArray = ref([]);

prestamosStore.listenChanges().then(() => {
  dataTableArray.value = prestamosStore.prestamosDatabase;
});

// Datos de productos de bajo stock
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
