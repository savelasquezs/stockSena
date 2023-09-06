<!-- Fecha Documentación 6/09/2023 -->
<!-- Este componente Vue.js permite al usuario crear o editar información relacionada con 
  consumibles. El usuario selecciona un consumible de una lista, completa los campos de entrada
  relevantes y luego puede enviar el formulario para guardar los datos. Dependiendo del modo de
  edición y el tipo de consumible seleccionado, los campos del formulario pueden variar dinámicamente. -->
<template>
  <!--Se implementa la opcion que permite seleccionar el consumible  -->
  <div class="flex justify-evenly">
    <!-- Se muestra un campo de selección (<q-select>) que permite al usuario elegir un consumible de una lista. 
    El valor seleccionado se vincula a la variable consumableSelected.-->
    <q-select
      :options="consumiblesStore.onlyNames"
      v-model="consumableSelected"
      label="Selecciona un consumible"
      style="width: 250px"
    />
  </div>
  <!-- Dentro de un formulario (<q-form>), hay una serie de elementos de entrada (<q-input>,
  <q-input8>, <q-select>) que representan diferentes campos para ingresar información relacionada con el consumible. -->
  <q-form @submit="emit('enviado', datosCompletos)">
    <div class="q-ma-lg q-pa-md shadow-2">
      <div class="text-center text-subtitle2">Campos</div>
      <!-- listaCampos y valueCampos son variables reactivas que almacenan información sobre los campos y valores de los consumibles respectivamente. -->
      <q-input8
        v-for="item in listaCampos"
        :key="item.nombreCampo"
        :label="item.nombreCampo"
        v-model="valueCampos.custom[item.nombreCampo]"
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
    <!-- Un botón (<q-btn>) se presenta para enviar el formulario, 
      con el texto del botón cambiando entre "Actualizar" y "Guardar" 
      dependiendo de si se está editando un consumible existente o creando uno nuevo. -->
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
// Varios paquetes y variables se importan y definen para su uso en el componente.
// consumableSelected es una variable reactiva que almacena el nombre del consumible seleccionado en el campo de selección.
import { computed, ref, watch } from "vue";
import { useConsumiblesStore } from "stores/consumiblesStore";
import { useDatabaseStore } from "src/stores/DatabaseStore";
const consumiblesStore = useConsumiblesStore();
const listaCampos = ref([]);
const valueCampos = ref({ custom: {} });
const consumableSelected = ref("");
const DatabaseStore = useDatabaseStore();
const options = ref(["Excelente", "Funcional desgastado", "No funcional"]);

// consumiblesStore y DatabaseStore son objetos que almacenan y gestionan datos.
//  Se usan para almacenar información sobre los consumibles y sus campos.
// DatabaseStore.escucharCambios se llama para suscribirse a cambios en los consumibles almacenados en la base de datos.
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

// Las propiedades del componente (editando, item, editandoConsumible) se definen y desestructuran usando defineProps.
if (props.editando && !props.editandoConsumible) {
  consumableSelected.value = props.item.nombre;
  crearFormulario();
  valueCampos.value = props.item;
}

// Se utiliza watch para observar cambios en consumableSelected y, cuando cambia, se llama a la función crearFormulario().
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
