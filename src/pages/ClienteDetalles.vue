<!-- Día de la documentación: 05/09/2023

Descripción del archivo "ClientesDetalles.vue": -->
<template>
  <!-- Muestra la información personal del cliente -->
  <PersonalInfo />

  <!-- Componente Tabs para alternar entre "Prestamos Activos" e "Historial de prestamos"
  Contenido de la pestaña "Prestamos Activos" -->
  <Tabs :tabs="tabs" v-model="selectedTab"
    ><template #activos>
      <!-- Tabla de Prestamos Activos -->
      <TablaActivos @devuelto="selectedTab = 'historial'" />
    </template>
    <!-- Contenido de la pestaña "Historial de prestamos" -->
    <template #historial>
      <!-- Tabla de Historial de prestamos -->
      <SimpleTable
        :rows="prestamosStore.allPersonDocs"
        :columns="clientesStore.columnsPrestamosPersona"
        @viendo="verDetalles"
        customDetail
      />
    </template>
  </Tabs>
</template>

<script setup>
// Importación de componentes y funciones necesarias
import Tabs from "components/utils/Tabs.vue";
import PersonalInfo from "components/clientes/PersonalInfo.vue";
import TablaActivos from "components/clientes/TablaActivos.vue";
import SimpleTable from "components/utils/SimpleTable.vue";
import { UseClientesStore } from "src/stores/clientesStore";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { useRouter } from "vue-router";
import { ref } from "vue";

// Instancia de almacenes (stores) y enrutador
const clientesStore = UseClientesStore();
const prestamosStore = UsePrestamosStore();
const router = useRouter();
const tabs = [
  { name: "activos", label: "Prestamos Activos" },
  { name: "historial", label: "Historial de prestamos" },
];

// Estado de la pestaña seleccionada
const selectedTab = ref("activos");

// Función para ver detalles de un préstamo
const verDetalles = (id) => {
  const producto = prestamosStore.allPersonDocs.find(
    (prestamo) => prestamo.docId == id
  );
  const productoId = producto.productId;
  router.push(`/productos/${productoId}`);
};
</script>

<style lang="scss" scoped></style>
