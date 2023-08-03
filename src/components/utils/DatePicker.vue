<template>
  <div class="q-pa-md">
    <div class="q-mb-sm">
      <q-badge color="teal"> Model: {{ dueDate }} </q-badge>
    </div>

    <q-btn icon="event" round color="primary">
      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
        <q-date
          today-btn
          mask="DD-MM-YYYY"
          v-model="dueDate"
          :locale="myLocale"
          :options="dateOptionsFn"
        >
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Cancel" color="primary" flat v-close-popup />
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
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
defineEmits(["guardarFecha"]);

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
</script>

<style lang="scss" scoped></style>
