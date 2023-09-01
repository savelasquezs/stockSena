<template>
  <div class="">
    <q-form class="">
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
      <ProductosConsumiblesForm
        v-if="consumable == 'consumible'"
        @enviado="(data) => submitForm(data)"
        :editando="editando"
        :item="item"
        :editandoConsumible="editandoConsumible"
      />
      <ProductosDevolutivosForm
        v-else-if="consumable == 'devolutivo'"
        @enviado="(data) => submitForm(data)"
        :editando="editando"
        :item="item"
        :editandoConsumible="editandoConsumible"
      />
    </q-form>
  </div>

  <!-- Mostrar detalles ingresados -->
</template>

<script setup>
import { useDatabaseStore } from "src/stores/DatabaseStore";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
const DatabaseStore = useDatabaseStore();
import ProductosConsumiblesForm from "components/productos/ProductosConsumiblesForm.vue";
import ProductosDevolutivosForm from "components/productos/ProductosDevolutivosForm.vue";
const formulario = ref({});

const emit = defineEmits(["enviado"]);
const consumable = ref(null);
const props = defineProps({
  editando: Boolean,
  item: Object,
  editandoConsumible: Boolean,
});
const consumableData = ref("");

// Watch for changes to the item prop and populate the form fields when in edit mode

const router = useRouter();

async function submitForm(data) {
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
