<!-- Día de la documentación: 30/08/2023
Descripción del archivo "Qdialogo.vue":

Este archivo contiene un componente Vue.js y Quasar que implementa un
diálogo modal personalizable.

=============================================================================
Props recibidos:
-modelValue: Boolean:
-colorButton: String
-iconButton: String
-labelButton: String
-visibleButton: Boolean:  Esta opcion decide si el botón se muestra o no
-width: String

(Estos props definen las caracteristicas visuales del componente)
==============================================================================

Características clave:
- Utiliza elementos Quasar como "q-dialog", "q-card", y "q-btn" para crear un
diálogo modal.
- El diálogo se controla mediante la variable "openDialog". Cuando "openDialog"
es "true",
 el diálogo se muestra; cuando es "false", se oculta.
- Incluye un botón de cierre en el encabezado del diálogo que permite a
los usuarios cerrar el diálogo.
- Proporciona una sección de contenido personalizable dentro del diálogo utilizando
un slot.
- Las propiedades del botón de apertura del diálogo, como etiqueta ("label"),
ícono ("icon"), color ("color"), y visibilidad ("v-show"), son configurables mediante props.
- El ancho del diálogo se puede personalizar mediante la propiedad "width". -->

<template>
  <!-- se crea un botón dinamico el cual usa props
  para definir sus propiedades. -->
  <q-btn
    @click="openDialog = true"
    :label="labelButton"
    :icon="iconButton"
    :color="colorButton"
    v-show="visibleButton"
  />

  <q-dialog v-model="openDialog">
    <q-card style="width: 1000px; max-width: 1500px">
      <q-card-section class="row justify-end q-pb-none">
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div class="flex flex-center">
        <q-avatar :icon="iconModal" color="accent" text-color="white" />
      </div>
      <q-card-section>
        <!-- Espacio para incluir contenido personalizado dentro del diálogo -->
        <slot />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
// importaciones
import { useVModel } from "@vueuse/core";
import { defineProps } from "vue";
// Definición de props para el componente

// NOTA: modelValue pertenece a una de las caracteristica unicas de
// useVModel, por ende al usar el componente y declarar un v-model="xvariable"
// este automaticamente tiene valor True
const props = defineProps({
  modelValue: Boolean,
  colorButton: String,
  iconButton: String,
  labelButton: String,
  visibleButton: Boolean,
  width: String,
  iconModal: String,
});
// se envian los props y modelValue, si model value == True
// openDialog heredara el valor del v-model declarado al
// utilizar este componente.
// ejemplo <QDialogo v-model=="rocio"/>
// en este caso openDialog tendra reactivamente el valor de rocio.
const openDialog = useVModel(props, "modelValue");
</script>

<style lang="scss" scoped></style>
