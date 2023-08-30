<template>
  <PersonalInfo />
  <Tabs :tabs="tabs"
    ><template #activos>
      <TablaActivos />
    </template>
    <template #historial>
      <SimpleTable
        :rows="prestamosStore.allPersonDocs"
        :columns="clientesStore.columnsPrestamosPersona"
        @viendo="verDetalles"
      />
    </template>
  </Tabs>
</template>

<script setup>
import Tabs from "components/utils/Tabs.vue";
import PersonalInfo from "components/clientes/PersonalInfo.vue";
import TablaActivos from "components/clientes/TablaActivos.vue";
import SimpleTable from "components/utils/SimpleTable.vue";
import { UseClientesStore } from "src/stores/clientesStore";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { useRouter } from "vue-router";
const clientesStore = UseClientesStore();
const prestamosStore = UsePrestamosStore();
const router = useRouter();
const tabs = [
  { name: "activos", label: "Prestamos Activos" },
  { name: "historial", label: "Historial de prestamos" },
];
const verDetalles = (id) => {
  const producto = prestamosStore.allPersonDocs.find(
    (prestamo) => prestamo.docId == id
  );
  const productoId = producto.productId;
  console.log(producto);
  router.push(`/productos/${productoId}`);
};
</script>

<style lang="scss" scoped></style>
