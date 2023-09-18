<template>
  <div class="flex justify-evenly">
    <q-select
      :options="consumiblesStore.onlyNames"
      v-model="consumableSelected"
      label="Selecciona un devolutivo"
      style="width: 250px"
      class="mayusculas"
    />
  </div>
  <q-form @submit="emit('enviado', datosCompletos)">
    <div class="q-ma-lg q-pa-md shadow-2 mayusculas">
      <div class="text-center text-subtitle2 mayusculas"></div>

      <q-input
        v-for="item in listaCampos"
        :key="item.nombreCampo"
        :label="item.nombreCampo"
        v-model="valueCampos.custom[item.nombreCampo]"
        :type="item.tipoDato == 'numero' ? 'number' : 'text'"
        :rules="[
          (val) =>
            (val != '' && val != null && val != 0) || 'Debes ingresar un valor',
        ]"
      />
      <div v-if="listaCampos.length > 0">
        <q-input
          v-model="valueCampos.codigoBarra"
          label="Codigo de Barras"
          :rules="[
            (val) => (val != '' && val != null) || 'Debes ingresar un valor',
          ]"
        />
        <q-input autogrow v-model="valueCampos.notas" label="Notas" />
        <q-select
          outlined
          required
          label="Estado funcional"
          v-model="valueCampos.estadoFisico"
          :options="options"
          class="q-my-lg"
          :rules="[
            (val) => (val != '' && val != null) || 'Debes ingresar un valor',
          ]"
        />
      </div>
    </div>
    <q-btn
      type="submit"
      :label="editando && !editandoConsumible ? 'Actualizar' : 'Guardar'"
      color="primary"
      icon="save"
      style="width: 100%"
    />
  </q-form>
</template>

<script setup>
const props = defineProps({
  editando: Boolean,
  item: Object,
  editandoConsumible: Boolean,
});
import { computed, ref, watch } from "vue";
import { useConsumiblesStore } from "stores/consumiblesStore";
import { useDatabaseStore } from "src/stores/DatabaseStore";
const consumiblesStore = useConsumiblesStore();
const listaCampos = ref([]);
const valueCampos = ref({ custom: {} });
const consumableSelected = ref("");
const DatabaseStore = useDatabaseStore();
const options = ref(["Excelente", "Funcional desgastado", "No funcional"]);

const emit = defineEmits(["enviado"]);
DatabaseStore.escucharCambios(
  consumiblesStore,
  "consumables",
  "nombre",
  "consumiblesDatabase"
);
const datosCompletos = computed(() => {
  return {
    isConsumable: false,
    stockTotal: 1,
    ...valueCampos.value,
    nombre: consumableSelected.value,
    borrowedQuantity: 0,
  };
});

if (props.editando && !props.editandoConsumible) {
  consumableSelected.value = props.item.nombre;
  crearFormulario();
  valueCampos.value = props.item;
}

watch(consumableSelected, () => {
  crearFormulario();
});
function crearFormulario() {
  const consumable = consumiblesStore.consumiblesDatabase.find(
    (consumible) => consumible.nombre == consumableSelected.value
  );
  listaCampos.value = consumable.listaCampos;
}
</script>

<style lang="scss" scoped></style>
