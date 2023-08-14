<template>
  <div class="flex justify-evenly content-center complete items-center">
    <q-page class="flex content-center">
      <div class="q-gutter-md q-mx-lg">
        <q-select
          outlined
          label="Tipo documento"
          v-model="Tipo_documento"
          :options="options_Tipo_documento"
          transition-show="flip-up"
          transition-hide="flip-up"
          style="width: 250px"
        />

        <q-btn
          -btn
          type="submit"
          label="Iniciar sesión"
          color="green-14"
          style="width: 250px"
        />
        <q-btn
          type="submit"
          label="Inir"
          color="green-14"
          style="width: 250px"
        />
      </div>
    </q-page>
  </div>
</template>

<script>
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import autocompleteinput from "components/utils/autocompleteInput.vue";
export default {
  data() {
    return {
      Tipo_documento: null,
      options_Tipo_documento: ["SEbas", "Joan"],
    };
  },
};
</script>
