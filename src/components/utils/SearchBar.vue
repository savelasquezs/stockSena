<template>
  <div class="q-mt-lg lex flex-center">
    <q-input
      outlined
      v-model="searchQuery"
      @input="handleInput"
      label="Buscar"
      :dense="dense"
      style="
        border-radius: 24px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        max-width: 700px;
      "
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon name="close" @click="searchQuery = ''" class="cursor-pointer" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref } from "vue";

const searchQuery = ref("");

const handleInput = (event) => {
  searchQuery.value = event.target.value;
  // Aquí puedes emitir un evento con la búsqueda o realizar otras acciones
};

const clearSearch = () => {
  searchQuery.value = "";
};
</script>
