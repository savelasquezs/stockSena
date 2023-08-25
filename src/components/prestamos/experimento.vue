<template>
  <div style="flex: 1" class="flex flex-center">
    <q-img
      src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png"
      loading="lazy"
      spinner-color="white"
      style="width: 200px"
    />
  </div>
  <div class="flex flex-center">
    <q-radio
      checked-icon="task_alt"
      v-model="formulario"
      val="programa"
      class="text-h6"
      >Crear Programar</q-radio
    >
    <q-radio
      checked-icon="task_alt"
      v-model="formulario"
      val="materia"
      class="text-h6"
      >Crear Materia</q-radio
    >
    <q-radio
      checked-icon="task_alt"
      v-model="formulario"
      val="resultado"
      class="text-h6"
      >Crear Resultado De Aprendizaje</q-radio
    >
  </div>
  <div class="flex flex-center">
    <div v-if="formulario == 'programa'">
      <h5 class="text-h5 text-center">Programa</h5>
      <q-input autogrow class="q-ma-sm" outlined v-model="programaNuevo" />
      <q-btn
        color="light-green-14"
        text-color="black"
        label="Guardar"
        @click="guardarPrograma"
      />
    </div>

    <div v-if="formulario == 'materia'">
      <h5 class="text-h5 text-center">Materia</h5>
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

    <div v-if="formulario == 'resultado'">
      <h5 class="text-h5 text-center">Resultado</h5>
      <q-select
        outlined
        v-model="programaSelectRA"
        :options="programas"
        label="Programas"
      />
      <q-select
        v-if="programaSelectRA"
        outlined
        v-model="materiaSelectRA"
        :options="searchMaterias(programaSelectRA)"
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
const formulario = ref("");

const programaNuevo = ref("");
const programas = ref([]);
const programaSelect = ref("");
const materias = ref([]);
const materiaNueva = ref("");
const programaSelectRA = ref(null);
const materiaSelectRA = ref("");
const resultadoNuevo = ref("");

const guardarPrograma = () => {
  if (programaNuevo.value) {
    programas.value.push(programaNuevo.value);
    programaNuevo.value = "";
  }
};

function searchMaterias(programa) {
  return materias.value.map((materia) => {
    if (materia.programa == programa) return materia.materia;
  });
}

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
