<template>
  <q-select
    filled
    v-model="model"
    use-input
    input-debounce="0"
    label="Simple filter"
    :options="options"
    @filter="filterFn"
    style="width: 250px"
    @update:model-value="$emit('cambioModel', model)"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No hay resultados </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref } from "vue";
defineEmits(["cambioModel"]);

const props = defineProps({ stringOptions: Array });

const options = ref([]);

const model = ref("jajaja");
function filterFn(val, update) {
  if (val === "") {
    update(() => {
      options.value = props.stringOptions;
      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = props.stringOptions.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

<style lang="scss" scoped></style>
