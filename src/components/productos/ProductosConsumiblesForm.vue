<!-- Día de la documentación: 31/08/2023 Descripción del archivo
"consumiblesForm.vue":

===============================
Eventos:
-enviado: al activar este evento se envia los valores de "completedForm,
el cual es un una arrow Function"
Props:
-editando: Boolean:
-item: Object:
-editandoConsumible: Boolean:
===============================

 Día de la documentación: 30/08/2023
Descripción del archivo "consumiblesForm.vue":

Características clave:
- El componente proporciona campos de entrada para recopilar información esencial sobre un consumible.
- Los campos tienen validaciones incorporadas para garantizar la precisión de los datos ingresados por el usuario.
- Incluye una lista desplegable para seleccionar la unidad de medida del consumible.
- El formulario se puede utilizar tanto para crear nuevos consumibles como para editar los existentes.
- Ofrece un botón de envío que emite un evento "enviado" junto con los datos completos del formulario.
- Integra un componente "uploadData" para cargar datos relacionados con los consumibles desde un archivo Excel.

-->

<template>
  <!-- Formulario de productos consumibles, el cual emite el evento "enviado"
  y envia los valores de "completedForm" -->
  <q-form @submit="$emit('enviado', completedForm)" class="">
    <div>
      <!-- Campo de entrada para el nombre que contiene  v-model="formulario.nombre
      es decir contiene el valor de nombre del formulario",
       además contiene una validación
      de datos -->
      <q-input
        outlined
        v-model="formulario.nombre"
        label="Nombre"
        required
        :rules="[(val) => val.length > 2 || 'Por favor un nombre valido']"
      >
        <!-- Añadir datos -->
        <template v-slot:append>
          <q-icon
            name="person_outline
                "
            color="accent"
          />
        </template>
      </q-input>
      <!-- Campo de entrada para el stock total que contiene   v-model.number="formulario.stockTotal"
      es decir contiene el valor del stockTotal del formulario",
      además contiene una validación
      de datos -->
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
      <!-- Campo de entrada para el Código de barra que contiene v-model.number="formulario.codigoBarra"
      es decir el valor del codigo de barra de ingresado en el formulario
      , además contiene una validación
      de datos -->
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
      <!-- Campo de entrada para la descripción que contiene v-model.number="formulario.descripcion"
      es decir el valor de la descrpción ingresado en el formulario
      , tambén contiene una validación
      de datos -->
      <q-input
        outlined
        v-model.number="formulario.descripcion"
        label="Descripción"
        class="q-my-lg"
      >
        <template v-slot:append>
          <q-icon
            name="description
                "
            color="accent"
          />
        </template>
        <!-- Input de tipo lista, en el cual se guardara el dato elejido en
      v-model="formulario.unidadMedida"-->
      </q-input>
      <q-select
        outlined
        required
        label="Unidad de medida"
        v-model="formulario.unidadMedida"
        :options="options"
        class="q-my-lg"
      />
      <!-- Botón de envío del formulario, sea actualizar o guardar -->
      <q-btn
        type="submit"
        icon="save"
        :label="editando && editandoConsumible ? 'Actualizar' : 'Guardar'"
        color="primary"
        style="width: 100%"
      />
    </div>
    <div class="flex justify-end"></div>
    <!-- Se usa el componente de subir datos -->
    <uploadData nomTabla="products" tipo="consumable" />
  </q-form>
</template>

<script setup>
// Importaciones
import { computed, ref } from "vue";
// Importación del componente Utils/ExcelToJasonBtn.vue
import uploadData from "components/utils/ExcelToJasonBtn.vue";
import QDialogo from "components/utils/QDialogo.vue";

// definición de los props
const props = defineProps({
  editando: Boolean,
  item: Object,
  editandoConsumible: Boolean,
});

// Guarda los datos ingresados en el formulario ene tipo
// array
const formulario = ref({});

// Variable que contiene un array de unidades de medición
const options = ref(["Unidad", "Libra", "Kilo", "Metro"]);

// Función que se activa al guardar los datos del formulario,
// al ingresar el formulario retorna el valor de la  variable formulario
// y da el valor a "isConsumable" como True
const completedForm = computed(() => {
  return {
    ...formulario.value,
    borrowedQuantity: 0,
    isConsumable: true,
  };
});

// En caso de que las props de "editando" y las props de "editandoConsumible"
// sean True le da a "formulario.value" el valor de "props.item"
if (props.editando && props.editandoConsumible) {
  formulario.value = props.item;
}
</script>

<style lang="scss" scoped></style>
