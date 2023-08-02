<template>
  <q-page class="q-pa-md">
    <q-container>
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h5">Detalles ingresados:</div>
          <div>Nombre: {{ detalles.nombre }}</div>
          <div>Consumible: {{ detalles.consumible }}</div>
          <div>Stock Total: {{ detalles.stockTotal }}</div>
          <div>Descripción: {{ detalles.descripcion }}</div>
          <div>Código de Barra: {{ detalles.codigoBarra }}</div>
          <div>Categoría: {{ detalles.categoria }}</div>
        </q-card-section>
      </q-card>
    </q-container>
  </q-page>
</template>

<script>
export default {
  props: ["detalles"],
};
</script>

<style>
/* Estilos personalizados */
/* ... */
</style>
