<template>
  <q-form @submit="$emit('enviado', completedForm)" class="">
    <div>
      <q-input
        outlined
        v-model="formulario.nombre"
        label="Nombre"
        required
        :rules="[(val) => val.length > 2 || 'Por favor un nombre valido']"
      >
        <template v-slot:append>
          <q-icon
            name="person_outline
                "
            color="accent"
          />
        </template>
      </q-input>

      <q-input
        outlined
        v-model.number="formulario.stockTotal"
        label="Stock Total"
        type="number"
        required
        :rules="[(val) => val > 0 || 'El valor debe ser mayor a 0']"
        class="q-my-lg"
      >
        <template v-slot:append>
          <q-icon
            name="numbers
                "
            color="accent"
          />
        </template>
      </q-input>
      <q-input
        outlined
        v-model.number="formulario.codigoBarra"
        label="Código de Barra"
        required
        class="q-my-lg"
      >
        <template v-slot:append>
          <q-icon
            name="view_week
                "
            color="accent"
          />
        </template>
      </q-input>

      <q-input
        outlined
        v-model.number="formulario.descripcion"
        label="Descripción"
        required
        class="q-my-lg"
      >
        <template v-slot:append>
          <q-icon
            name="description
                "
            color="accent"
          />
        </template>
      </q-input>
      <q-select
        outlined
        required
        label="Unidad de medida"
        v-model="formulario.unidadMedida"
        :options="options"
        class="q-my-lg"
      />

      <q-btn
        type="submit"
        icon="save"
        :label="editando && editandoConsumible ? 'Actualizar' : 'Guardar'"
        color="primary"
        style="width: 100%"
      />
    </div>
    <div class="flex justify-end"></div>
    <uploadData nomTabla="products" tipo="cons" />
  </q-form>
</template>

<script setup>
import { computed, ref } from "vue";

import uploadData from "components/utils/ExcelToJasonBtn.vue";
import QDialogo from "components/utils/QDialogo.vue";
const props = defineProps({
  editando: Boolean,
  item: Object,
  editandoConsumible: Boolean,
});
const formulario = ref({});
const options = ref(["Unidad", "Libra", "Kilo", "Metro"]);
const completedForm = computed(() => {
  return {
    ...formulario.value,
    borrowedQuantity: 0,
    isConsumable: true,
  };
});

if (props.editando && props.editandoConsumible) {
  formulario.value = props.item;
}
</script>

<style lang="scss" scoped></style>
