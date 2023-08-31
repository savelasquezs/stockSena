<!-- Día de la documentación: 30/08/2023
Descripción del archivo "StadisticTableBar.vue":

Características clave:
- El componente se utiliza para mostrar información estadística en la parte superior de una página o aplicación.
- Utiliza el componente Quasar `<q-item>` para crear un elemento interactivo.
- Contiene la imagen del logotipo del SENA que sirve como enlace a la página de inicio.
- Utiliza un componente personalizado llamado "StadisticTableItem" para mostrar estadísticas individuales.
- Itera a través de un arreglo de objetos "stadisticTableBarInfo" utilizando "v-for" para generar dinámicamente estadísticas en la barra.
- Cada estadística se representa como un componente "StadisticTableItem" con propiedades como:
 "titulo", "valor", "periodo" y "textColor" para personalizar la apariencia de las estadísticas.
- El estilo de la barra de estadísticas se administra mediante hojas de estilo CSS locales (scoped).
:-->
<template>
  <!-- Contenedor principal de la barra de estadísticas -->
  <div class="flex justify-center">
    <q-item clickable to="/">
      <!-- etiqueta en la cual se guarda la imagen -->
      <q-img
        src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png"
        loading="lazy"
        spinner-color="white"
        width="100px"
        class=""
      />
      <!-- aqui se llama al componente "StadisticTableItem"
      en el cual se pueden especificar las caracteristicas del item-->
      <StadisticTableItem
        v-for="stadistic in stadisticTableBarInfo"
        :key="stadistic.titulo"
        :textColor="stadistic.text_color"
        :titulo="stadistic.titulo"
        :valor="stadistic.valor"
        :periodo="stadistic.periodo"
      />
    </q-item>
  </div>
</template>

<script setup>
// importación de "StadisticTableItem"
import StadisticTableItem from "./StadisticTableItem.vue";
// Definición de los props
const props = defineProps(["stadisticTableBarInfo"]);
</script>

<style lang="scss" scoped></style>
