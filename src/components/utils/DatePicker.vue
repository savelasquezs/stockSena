<template>
  <div class="q-mx-xl">
    <div>
      <q-btn icon="event" round color="accent" class="q-mx-sm">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date
            today-btn
            mask="DD-MM-YYYY"
            v-model="dueDate"
            :locale="myLocale"
            :options="options ? dateOptionsFn : emptyDate"
            :range="range"
          >
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn
                label="Cancel"
                color="primary"
                flat
                v-close-popup
                @click="resetModel"
              />
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
import { computed, ref } from "vue";
const emit = defineEmits(["guardarFecha", "cleanedDates"]);

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
  pluralDay: "dias",
});
const dueDate = ref(todayDate());

function resetModel() {
  dueDate.value = todayDate();
  emit("cleanedDates");
}

function completeValue(value) {
  if (value < 10) {
    let valor = "0" + value.toString();
    return valor;
  }
  return value;
}
function todayDate() {
  const fechaAlRevez = new Date().toLocaleDateString().split("/");
  const newFecha =
    fechaAlRevez[2] +
    "/" +
    completeValue(fechaAlRevez[0]) +
    "/" +
    completeValue(fechaAlRevez[1]);
  return newFecha;
}
function dateOptionsFn(date) {
  const fechaAlRevez = new Date().toLocaleDateString().split("/");
  function completeValue(value) {
    if (value < 10) {
      let valor = "0" + value.toString();

      return valor;
    }

    return value;
  }
  completeValue(10);
  const newFecha =
    fechaAlRevez[2] +
    "/" +
    completeValue(fechaAlRevez[0]) +
    "/" +
    completeValue(fechaAlRevez[1]);
  return date >= newFecha;
}

function emptyDate(date) {
  return true;
}
</script>

<style lang="scss" scoped></style>
