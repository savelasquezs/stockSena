<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <!-- Se inicia la definición de un <q-card> que contiene los elementos de pestañas y paneles. -->
      <q-card>
        <!-- Se utiliza <q-tabs> para mostrar las pestañas. Se le enlaza con v-model="tab" para que la pestaña seleccionada se controle mediante la variable tab. -->
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <!-- Usando v-for, se generan las pestañas a partir de la matriz tabs pasada como propiedad. Cada pestaña tiene su name y label asociados. El valor :name="tab.name" enlaza la propiedad name de cada pestaña con el modelo tab. -->
          <q-tab
            v-for="tab in tabs"
            :key="tab.name"
            :name="tab.name"
            :label="tab.label"
          />
        </q-tabs>

        <!-- Se agrega un separador (<q-separator />) entre las pestañas y los paneles. -->
        <q-separator />

        <!-- Los paneles de contenido se gestionan con <q-tab-panels>. Se enlazan con v-model="tab" para que el panel correspondiente al valor de tab se muestre. -->
        <q-tab-panels v-model="tab" animated>
          <!-- Cada <q-tab-panel> alberga el contenido específico de cada pestaña y se asocia al modelo tab. -->
          <q-tab-panel v-for="tab in tabs" :key="tab.name" :name="tab.name">
            <div class="text-h6">{{ tab.label }}</div>
            <slot :name="tab.name" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script setup>
// Se importa ref desde "vue" para manejar una variable reactiva llamada tab.
import { ref } from "vue";
// Se define la variable reactiva tab con el valor inicial de la primera pestaña.
const tab = ref(props.tabs[0].name);
// Se definen las propiedades del componente, en este caso, tabs, como un arreglo.
const props = defineProps({ tabs: Array });
</script>
