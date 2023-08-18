<template>
  <div class="flex flex-center">
    <div>
      <h5 class="text-h5 text-center">Crear programa</h5>
      <q-input autogrow class="q-ma-sm" outlined v-model="programaNuevo" />
      <q-btn
        color="light-green-14"
        text-color="black"
        label="Guardar"
        @click="guardarPrograma"
      />
    </div>

    <div>
      <h5 class="text-h5 text-center">Crear materia</h5>
      <q-select
        outlined
        v-model="programaSelect"
        :options="programas"
        label="Programas"
      />
      <q-input autogrow class="q-ma-sm" outlined v-model="materiaNueva" />
      <q-btn
        color="light-green-14"
        text-color="black"
        label="Guardar"
        @click="crearMateria"
      />
    </div>

    <div>
      <h5 class="text-h5 text-center">Crear resultado de aprendizaje</h5>
      <q-select
        outlined
        v-model="programaSelectRA"
        :options="programas"
        label="Programas"
      />
      <q-select
        outlined
        v-model="materiaSelectRA"
        :options="materias"
        label="Materias"
      />
      <q-input autogrow class="q-ma-sm" outlined v-model="resultadoNuevo" />
      <q-btn
        color="light-green-14"
        text-color="black"
        label="Guardar"
        @click="crearResultadoAprendizaje"
      />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const programaNuevo = ref("");
const programas = ref([]);
const programaSelect = ref("");
const materias = ref([]);
const materiaNueva = ref("");
const programaSelectRA = ref("");
const materiaSelectRA = ref("");
const resultadoNuevo = ref("");

const guardarPrograma = () => {
  if (programaNuevo.value) {
    programas.value.push(programaNuevo.value);
    programaNuevo.value = "";
  }
};

const crearMateria = () => {
  if (materiaNueva.value && programaSelect.value) {
    const asignatura = {
      materia: materiaNueva.value,
      programa: programaSelect.value,
    };

    materias.value.push(asignatura);
    materiaNueva.value = "";
  }
};

const crearResultadoAprendizaje = () => {
  if (resultadoNuevo.value && programaSelectRA.value && materiaSelectRA.value) {
    const resultadoAprendizaje = {
      resultado: resultadoNuevo.value,
      programa: programaSelectRA.value,
      materia: materiaSelectRA.value,
    };

    resultado.value.push(resultadoAprendizaje);
    resultadoNuevo.value = "";
  }
};
</script>
