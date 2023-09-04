<!-- Día de la documentación: 30/08/2023
Descripción del archivo "autocompleteinput.vue":

Este archivo corresponde a un componente Vue.js y Quasar
que implementa un campo input  y un select, a medida que se escribe en
un input las opciones del select se van filtrando y
 cuando se elije una de estas opciones se emite un evento "cambioModel".

el campo input permite a los usuarios buscar elementos
en un array (props.stringOptions), afectando los atributos recibidos:

========================================================================
Props recibidos:
-stringOptions: Array (es un array de string que corresponden a las
opciones que se van a filtrar).
-modelValue: String

Eventos emitidos:
-defineEmits(["cambioModel"]); (este evento se emite al momento de
selecionar una opción).
========================================================================

Características clave:
- El componente utila el elemento Quasar "q-select" para crear
un campo input con opciones autocompletadas.
- Los usuarios pueden escribir texto en el campo input y las
opciones se filtran en tiempo real para mostrar coincidencias.
- El componente emite un evento personalizado llamado "cambioModel"
cuando se seleciona una opción.
- Incluye una regla de validación para asegurarse de que el valor de búsqueda
no esté vacío.
- Cuando no hay resultados coincidentes con la búsqueda,
se muestra un mensaje indicando "No hay resultados".
-->

<template>
  <!-- cuadro de selección (campo input), el cual contiene la variable v-model="model",
  la cual activa la función @filter="filterFn" que filtra las opciones
  ademas contiene el evento @update:model-value="$emit('cambioModel', model)" -->
  <q-select
    filled
    v-model="model"
    use-input
    input-debounce="0"
    label="Simple filter"
    :options="options"
    @filter="filterFn"
    style="width: 250px"
    @update:model-value="$emit('cambioModel', model)"
    :rules="[(value) => value !== '' || 'Este valor no puede ir vacio']"
  >
    <template v-slot:no-option>
      <!-- en caso de que la b/usqueda no tenga datos para mostrar
      se mostrará "No hay resultados" con una cara triste  -->
      <q-item>
        <q-item-section class="text-grey"> No hay resultados </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
// importaciones necesarias
import { ref, watch } from "vue";

// se declara el nombre del evento: "cambioModel"
defineEmits(["cambioModel"]);

// definición de las variables props, las cuales se les dara su valor al
// momento de usarlas en alguna pagina o componente
const props = defineProps({ stringOptions: Array, modelValue: String });

// declaración de la variable "options " la cual es un array vacio, al cual
// luego se le dara el valor de las opciones filtradas, las cuales se mostraran
const options = ref([]);

// declaración de la variable "model " la cual es un string vacio, al cual
// luego se le dara un valor
const model = ref("");

// Función de filtrado, la cual usa la función update
// para actualizar las opciones mostradas
function filterFn(val, update) {
  if (val === "") {
    update(() => {
      options.value = props.stringOptions;
    });
    return;
  }
  // Función update para actualizar las oopciones mostradas
  update(() => {
    const needle = val.toLowerCase();
    options.value = props.stringOptions.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

<style lang="scss" scoped></style>
