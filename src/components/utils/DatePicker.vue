<!--
Día de la documentación: 30/08/2023
Descripción del archivo "DataPicker.vue":

Este archivo contiene un componente Vue.js y Quasar que implementa un selector de fechas (Date Picker) con filtrado de tabla.

Características clave:
- Utiliza elementos Quasar como "q-date" y "q-btn" para la selección de fechas.
- Emite el evento "guardarFecha" cuando se elige una fecha, lo que permite la interacción con otros componentes.
- Permite cancelar la selección de fecha con el botón "Cancelar".
- Incluye un botón para restablecer la fecha a la actual.
- Muestra las fechas "Desde" y "Hasta" cuando se selecciona un rango de fechas.
- Utiliza configuración regional para mostrar nombres de días y meses en español.
- Ofrece opciones de filtrado para deshabilitar fechas pasadas. -->

<template>
  <div>
    <div>
      <!-- Botón para abrir un selector de fecha -->
      <q-btn icon="event" round color="accent" class="q-mx-sm">
        <!-- popup con transición -->
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <!-- componente de quasar para fechas (calendario)
          inculeye la variable v-model="dueDate"-->
          <q-date
            today-btn
            mask="DD-MM-YYYY"
            v-model="dueDate"
            :locale="myLocale"
            :options="options ? dateOptionsFn : emptyDate"
            :range="range"
          >
            <div class="row items-center justify-end q-gutter-sm">
              <!-- Botón "Cancelar" para cerrar el selector de fecha,
              activa la función "resetModel" -->
              <q-btn
                label="Cancel"
                color="primary"
                flat
                v-close-popup
                @click="resetModel"
              />
              <!-- Botón "OK" para confirmar la selección de fecha,
              al darle click al botón se activa el evento "guardarFecha" y
            se envia la variable dueDate  -->
              <q-btn
                label="OK"
                color="primary"
                flat
                v-close-popup
                @click="$emit('guardarFecha', dueDate)"
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-btn>
      <!-- Botón para limpiar la fecha seleccionada,
      activando la función "resetModel" -->
      <q-btn
        v-if="dueDate.from"
        icon="cleaning_services"
        color="accent"
        round
        class="q-mx-lg"
        @click="resetModel"
      />
    </div>
    <div v-if="dueDate.from">
      <q-input disable>
        <template v-slot:prepend
          ><span class="text-subtitle1"
            >Desde: {{ dueDate.from }}
          </span></template
        >
      </q-input>

      <q-input disable>
        <template v-slot:prepend
          ><span class="text-subtitle1">Hasta:{{ dueDate.to }} </span></template
        >
      </q-input>
    </div>
  </div>
</template>

<script setup>
// importaciónes
import { computed, ref } from "vue";
// declaración del evento "guardarFecha", "cleanedDates"
const emit = defineEmits(["guardarFecha", "cleanedDates"]);

// definición de props: range y options.
const props = defineProps({
  range: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Boolean,
    default: false,
  },
});

// declaración de variable array la cual contiene las fechas en nuestro calendario,
// meses, diás etc.
const myLocale = ref({
  /* starting with Sunday */
  days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
  daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
  months:
    "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
      "_"
    ),
  monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: "dia/s",
});

// variable la cual contiene el dia actual, esto para que se muestre,
// la fecha actual, esto de forma predeterminada, sin embargo puede cambiar
// para contener otras fechas.
const dueDate = ref(new Date().toLocaleDateString());

// función la cual permite resetear los cambios hechos por
// los usuarios, dejando el calendario con la fecha actual.
function resetModel() {
  dueDate.value = new Date().toLocaleDateString();
  emit("cleanedDates");
}

// Función para obtener la fecha actual en el formato esperado (DD-MM-YYYY)

// Función que define las deshabilita las fechas, anteriores al dia actual
function dateOptionsFn(date) {
  return date >= new Date().toISOString().slice(0, 10).replaceAll("-", "/");
}

// Función que siempre devuelve "true" para opciones de fecha vacías y
// habilitar todas las fechas
function emptyDate(date) {
  return true;
}
</script>

<style lang="scss" scoped></style>
