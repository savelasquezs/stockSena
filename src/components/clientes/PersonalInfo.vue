<template>
  {{ cliente }}

  <div class="flex flex-center q-mt-lg">
    <q-item
      class="shadow-3 q-px-xl q-py-md skeleton"
      v-if="!cliente.nombre"
      style="width: 40%; min-width: 500px"
    >
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" width="65%" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-else
      style="width: 40%; min-width: 500px"
      class="shadow-3 q-px-xl q-py-md"
    >
      <q-item-section avatar>
        <q-avatar color="accent">
          {{ firstLetter }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-h6"
          >{{ cliente.nombre }} {{ cliente.apellido }}</q-item-label
        >
        <q-item-label caption>{{ cliente.numero_id }}</q-item-label>
      </q-item-section>

      <q-item-section class="flex flex-center">
        <q-icon color="accent" size="4rem">
          <EnMora v-if="cliente.enMora" />
          <AlDia v-else />
        </q-icon>
        <q-badge
          :color="!cliente.enMora ? 'success' : 'red-5'"
          :label="!cliente.enMora ? 'Al dia' : 'En Mora'"
          class="q-my-sm"
          text-color="black"
        />
      </q-item-section>

      <q-item-section side top class="flex">
        <q-badge color="accent" :label="cliente.rol" class="q-my-sm" />
        <q-badge color="secondary" :label="cliente.area" />
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
import { doc, onSnapshot, query } from "firebase/firestore";
import { db } from "src/firebaseInit";
import { UseClientesStore } from "src/stores/clientesStore";
import { useDatabaseStore } from "src/stores/DatabaseStore";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import AlDia from "../icons/AlDia.vue";
import EnMora from "../icons/EnMora.vue";

const databaseStore = useDatabaseStore();

const props = defineProps({ busquedaCustom: Boolean });
const prestamosStore = UsePrestamosStore();
const clientesStore = UseClientesStore();
let store = "prestamosStore";
let arrayName = "prestamosDatabase";
let cliente = computed(() => {
  if (props.busquedaCustom) {
    return clientesStore.currentCustomer;
  }
  return prestamosStore.currentCustomer;
});

const firstLetter = computed(() => {
  const nombre = cliente.value?.nombre;
  return nombre ? nombre[0] : "C";
});
const route = useRoute();
</script>
