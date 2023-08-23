<template>
  <div class="">
    <q-form @submit="submitForm" class="">
      <div class="flex column flex-center">
        <q-img
          src="https://th.bing.com/th/id/OIP.o9e2Vz_Xf5LNHNozfLc1YQHaHa?pid=ImgDet&rs=1"
          loading="lazy"
          spinner-color="white"
          width="100px"
        />
        <div class="text-h6 text-center q-my-xl">INGRESAR PRODUCTO</div>
      </div>

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

      <q-select
        outlined
        v-model="formulario.consumible"
        label="Consumible"
        map-options
        :options="['Sí', 'No']"
        emit-value
      >
        <template v-slot:append>
          <q-icon
            name="fastfood
                "
            color="accent"
          />
        </template>
      </q-select>

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

      <q-btn
        type="submit"
        icon="save"
        :label="editando ? 'Actualizar' : 'Guardar'"
        color="primary"
        style="width: 100%"
      />
    </q-form>
  </div>

  <!-- Mostrar detalles ingresados -->
</template>

<script setup>
import { useDatabaseStore } from "src/stores/DatabaseStore";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
const emit = defineEmits(["enviado"]);

const props = defineProps({
  editando: Boolean,
  item: Object,
});

// Watch for changes to the item prop and populate the form fields when in edit mode

const router = useRouter();
const formulario = ref({});
const dueDate = ref("");
const DatabaseStore = useDatabaseStore();
if (props.editando) {
  formulario.value.nombre = props.item.name;
  formulario.value.consumible = props.item.consumable;
  formulario.value.stockTotal = props.item.totalStock;
  formulario.value.codigoBarra = props.item.barCode;
}
async function submitForm() {
  const data = {
    name: formulario.value.nombre,
    consumable: formulario.value.consumible,
    totalStock: formulario.value.stockTotal,
    barCode: formulario.value.codigoBarra,
    borrowedQuantity: 0,
    almacen: "tics",
  };
  if (props.editando) {
    DatabaseStore.updateElement(data, "products", props.item.docId);
  } else {
    DatabaseStore.saveElement(data, "products");
  }

  emit("enviado");
  // Redirigir a la página de detalles y pasar los datos mediante una ruta con parámetros
}
</script>

<style>
/* Estilos personalizados */
/* ... */
</style>
