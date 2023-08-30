<template>
  <q-btn
    @click="openDialog = true"
    :label="labelButton"
    :icon="iconButton"
    :color="colorButton"
    v-show="visibleButton"
  />
  <q-dialog v-model="openDialog">
    <q-card style="width: 1000px">
      <q-card-section class="row justify-end q-pb-none">
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <slot />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useVModel } from "@vueuse/core";
import { defineProps } from "vue";

const props = defineProps({
  modelValue: Boolean,
  colorButton: String,
  iconButton: String,
  labelButton: String,
  visibleButton: Boolean,
  width: String,
});

const openDialog = useVModel(props, "modelValue");
</script>

<style lang="scss" scoped></style>
