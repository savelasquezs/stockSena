<!-- Día de la documentación: 30/08/2023
Descripción del archivo "autocompleteinput.vue":

Este archivo corresponde a un componente Vue.js y Quasar
que implementa una barra de búsqueda autocompletada.
La barra de búsqueda permite a los usuarios buscar elementos
en una tabla y afecta dinámicamente la visualización de la tabla
según la búsqueda realizada.

Características clave:
- El componente utiliza el elemento Quasar "q-select" para crear
una barra de búsqueda con opciones autocompletadas.
- Los usuarios pueden escribir texto en la barra de búsqueda y las
opciones se filtran en tiempo real para mostrar coincidencias.
- El componente emite un evento personalizado llamado "cambioModel"
cuando el valor de búsqueda cambia, lo que afecta a la tabla subyacente.
- Incluye una regla de validación para asegurarse de que el valor de búsqueda
no esté vacío.
- Cuando no hay resultados coincidentes con la búsqueda,
se muestra un mensaje indicando "No hay resultados".
-->

<template>
  <!-- cuadro de selección (barra de busqueda), el cual contiene la variable v-model="model",
  la cual activa la función @filter="filterFn" que filtra la tabla
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
// luego se le dara un valor
const options = ref([]);

// declaración de la variable "model " la cual es un array vacio, al cual
// luego se le dara un valor
const model = ref("");

// Función de filtrado, la cual usa la función update
// para actualizar la tabla
function filterFn(val, update) {
  if (val === "") {
    update(() => {
      options.value = props.stringOptions;
      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }
  // Función update para actualizar la tabla
  update(() => {
    const needle = val.toLowerCase();
    options.value = props.stringOptions.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

<style lang="scss" scoped></style>
