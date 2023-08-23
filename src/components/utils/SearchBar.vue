<template>
  <q-input
    outlined
    v-model="searchQuery"
    @input="$emit('cambioEstado', searchQuery)"
    label="Buscar"
    dense
    style="
      border-radius: 24px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      max-width: 700px;
    "
  >
  </q-input>
</template>

<script setup>
import { ref } from "vue";

defineEmits(["cambioEstado"]);

const searchQuery = ref("");
</script>
