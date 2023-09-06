<!-- Día de la documentación: 06/09/2023
Descripción del archivo "lowStockItem.vue":

Este archivo representa un componente Vue.js diseñado para mostrar un elemento de lista de un artículo con bajo stock.
El componente muestra el nombre del artículo, la cantidad restante en stock y un icono de advertencia en un formato de lista.

Características clave:
- Muestra el nombre del artículo.
- Muestra la cantidad restante en stock del artículo.
- Utiliza un ícono personalizado para representar el artículo.
- Cambia el color de fondo del ícono y el color del texto del ícono según la configuración proporcionada.

Props recibidos:
- icon: Un string que representa el ícono a mostrar.
- avatarColor: Color de fondo para el avatar (icono).
- iconColor: Color del texto del ícono.
- name: Nombre del artículo.
- remainingQuantity: Cantidad restante en stock del artículo (debe ser un string).

Eventos emitidos:
- Ninguno

Uso:
- Este componente se utiliza para representar un artículo con bajo stock en una lista o vista de elementos con una advertencia visual.
-->
<template>
  <!-- Elemento de lista para el artículo con bajo stock -->
  <q-item>
    <q-item-section avatar top>
      <!-- Avatar (icono) del artículo con color personalizado -->
      <q-avatar :icon="icon" :color="avatarColor" :text-color="iconColor" />
    </q-item-section>

    <q-item-section>
      <!-- Nombre del artículo -->
      <q-item-label lines="1">{{ name }}</q-item-label>
      <!-- Cantidad restante en stock con una leyenda -->
      <q-item-label caption
        >Solo quedan {{ remainingQuantity }} unidad{{
          remainingQuantity > 1 ? "es" : ""
        }}</q-item-label
      >
    </q-item-section>

    <q-item-section side>
      <!-- Un distintivo (badge) de advertencia con la cantidad restante -->
      <q-badge color="red">
        {{ remainingQuantity }}
        <q-icon name="warning" color="white" class="q-ml-xs" />
      </q-badge>
    </q-item-section>
  </q-item>
</template>

<script setup>
// Declaracion de los props
const props = defineProps({
  icon: String,
  avatarColor: String,
  iconColor: String,
  name: String,
  remainingQuantity: String,
});
</script>

<style lang="scss" scoped></style>
