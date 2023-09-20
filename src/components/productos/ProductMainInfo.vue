<template>
  <div class="flex justify-center">
    <q-item class="q-pa-lg">
      <q-item-section avatar v-if="!noAvatar">
        <q-avatar color="accent" text-color="white"
          >{{ firstLetter }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="flex flex-center"
          ><span class="text-h5 text-weight-bold">{{
            product.nombre || product.product
          }}</span></q-item-label
        >
        <q-item-label caption class="flex flex-center"
          >codigo de barra :
          {{ product.codigoBarra || product.barCode }}</q-item-label
        >
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({ product: Object, noAvatar: Boolean });

console.log(props.product);
const firstLetter = computed(() => {
  const nombre = props.product.nombre || props.product.product;
  return nombre ? nombre[0] : "P";
});
</script>

<style lang="scss" scoped></style>
