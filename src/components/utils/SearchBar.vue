<!-- Día de la documentación: 30/08/2023
Descripción del archivo "searchbar.vue":

Este archivo corresponde a un componente Vue.js y Quasar que implementa
una barra de búsqueda interactiva para filtrar una tabla de datos.

Características clave:
- Utiliza un componente Quasar llamado `<q-input>` para crear una barra de búsqueda
con funcionalidad de entrada de texto.
- La barra de búsqueda está vinculada a través de `v-model` a la variable
`searchQuery`, lo que permite al usuario ingresar términos de búsqueda.
- Cuando el usuario ingresa datos en la barra de búsqueda, se emite el evento
personalizado "cambioEstado" con el contenido de `searchQuery` como parámetro.
Esto permite la interacción con otros componentes o partes de la aplicación para actualizar y refrescar la tabla de datos.
- La barra de búsqueda es de estilo "outlined" y "dense" para una
apariencia limpia y compacta.
- Se aplican estilos CSS para personalizar la apariencia de la barra de búsqueda,
incluyendo bordes redondeados y un ancho máximo de 700 píxeles.
 -->

<template>
  <!-- Input de barra de busqueda, tiene una v-model="searchQuery",
  al ingresar datos emite un evento el cual cambia de estado la tabla -->
  <q-input
    outlined
    v-model="searchQuery"
    @input="$emit('cambioEstado', searchQuery)"
    label="Buscar"
    dense
    style="
      border-radius: 24px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      max-width: 700px;
    "
  >
  </q-input>
</template>

<script setup>
// importación de ref
import { ref } from "vue";

// definición del event
defineEmits(["cambioEstado"]);

// se da el valor de la variable
const searchQuery = ref("");
</script>
