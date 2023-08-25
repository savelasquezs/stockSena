<template>
  <div class="flex justify-evenly">
    <q-select
      :options="consumiblesStore.onlyNames"
      v-model="consumableSelected"
      label="Selecciona un consumible"
      style="width: 250px"
    />
  </div>
  <q-form @submit="emit('enviado', datosCompletos)">
    <div class="q-ma-lg q-pa-md shadow-2">
      <div class="text-center text-subtitle2">Campos</div>
      <q-input
        v-for="item in listaCampos"
        :key="item.nombreCampo"
        :label="item.nombreCampo"
        v-model="valueCampos[item.nombreCampo]"
      />
      <div v-if="listaCampos.length > 0">
        <q-input v-model="valueCampos.codigoBarra" label="Codigo de Barras" />
        <q-input autogrow v-model="valueCampos.notas" label="Notas" />
        <q-select
          outlined
          required
          label="Estado funcional"
          v-model="valueCampos.estadoFisico"
          :options="options"
          class="q-my-lg"
        />
      </div>
    </div>
    <q-btn
      type="submit"
      label="Guardar Producto"
      color="primary"
      icon="save"
      style="width: 100%"
    />
  </q-form>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useConsumiblesStore } from "stores/consumiblesStore";
import { useDatabaseStore } from "src/stores/DatabaseStore";
const consumiblesStore = useConsumiblesStore();
const listaCampos = ref([]);
const valueCampos = ref({});
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
