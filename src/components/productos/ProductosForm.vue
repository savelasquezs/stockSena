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
      <div class="q-gutter-sm flex flex-center">
        <q-radio
          v-model="consumable"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="consumible"
          label="Consumible"
        />
        <q-radio
          v-model="consumable"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="devolutivo"
          label="Devolutivo"
        />
      </div>
      <div v-if="consumable == 'consumible'">
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

        <q-btn
          type="submit"
          icon="save"
          :label="editando ? 'Actualizar' : 'Guardar'"
          color="primary"
          style="width: 100%"
        />
      </div>
      <div v-else-if="consumable == 'devolutivo'">
        <div class="flex justify-evenly">
          <q-select
            :options="consumiblesStore.onlyNames"
            v-model="consumableSelected"
            label="Selecciona un consumible"
            style="width: 250px"
          />
        </div>
        <q-form @submit="submitForm">
          <div class="q-ma-lg q-pa-md shadow-2">
            <div class="text-center text-subtitle2">Campos</div>
            <q-input
              v-for="item in listaCampos"
              :key="item.nombreCampo"
              :label="item.nombreCampo"
              v-model="valueCampos[item.nombreCampo]"
            />
            <q-input
              v-if="listaCampos.length > 0"
              v-model="valueCampos.codigoBarra"
              label="Codigo de Barras"
            />
            <q-input
              v-if="listaCampos.length > 0"
              autogrow
              v-model="valueCampos.notas"
              label="Notas"
            />
          </div>
          <q-btn
            type="submit"
            label="Guardar Producto"
            color="primary"
            icon="save"
            style="width: 100%"
          />
        </q-form>
      </div>
    </q-form>
  </div>

  <!-- Mostrar detalles ingresados -->
</template>

<script setup>
import { useDatabaseStore } from "src/stores/DatabaseStore";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useConsumiblesStore } from "stores/consumiblesStore";

const emit = defineEmits(["enviado"]);
const consumable = ref(null);
const props = defineProps({
  editando: Boolean,
  item: Object,
});
const consumableSelected = ref("");
const listaCampos = ref([]);
const valueCampos = ref({});

// Watch for changes to the item prop and populate the form fields when in edit mode
const consumiblesStore = useConsumiblesStore();

watch(consumableSelected, () => {
  crearFormulario();
});
function crearFormulario() {
  const consumable = consumiblesStore.consumiblesDatabase.find(
    (consumible) => consumible.nombre == consumableSelected.value
  );
  listaCampos.value = consumable.listaCampos;
  console.log(consumable);
}
const router = useRouter();
const formulario = ref({});
const DatabaseStore = useDatabaseStore();
DatabaseStore.escucharCambios(
  consumiblesStore,
  "consumables",
  "nombre",
  "consumiblesDatabase"
);
if (props.editando) {
  formulario.value.nombre = props.item.name;
  formulario.value.stockTotal = props.item.totalStock;
  formulario.value.codigoBarra = props.item.barCode;
}
async function submitForm() {
  let data;
  const almacen = JSON.parse(localStorage.getItem("user")).almacen;
  if (consumable.value == "consumible") {
    data = {
      ...formulario.value,
      borrowedQuantity: 0,
      almacen,
      isConsumable: false,
    };
  } else {
    data = {
      isConsumable: true,
      nombre: consumableSelected.value,
      stockTotal: 1,
      ...valueCampos.value,
      borrowedQuantity: 0,
      almacen,
    };
  }
  if (props.editando) {
    DatabaseStore.updateElement(data, "products", props.item.docId);
  } else {
    console.log(data);
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
