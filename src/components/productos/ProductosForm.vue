<template>
  <div class="">
    {{ editandoConsumible }}
    {{ item }}
    <q-form class="">
      <div class="flex column flex-center">
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
import { computed, provide, ref, watch } from "vue";
import { useRouter } from "vue-router";
const DatabaseStore = useDatabaseStore();
import ProductosConsumiblesForm from "components/productos/ProductosConsumiblesForm.vue";
import ProductosDevolutivosForm from "components/productos/ProductosDevolutivosForm.vue";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "src/firebaseInit";
import { UseUtilsStore } from "src/stores/utilsStore";
const formulario = ref({});

const emit = defineEmits(["enviado"]);
const consumable = ref(null);
const props = defineProps({
  editando: Boolean,
  item: Object,
  editandoConsumible: Boolean,
});
const consumableData = ref("");
const utilsStore = UseUtilsStore();

// Watch for changes to the item prop and populate the form fields when in edit mode

const router = useRouter();
if (props.editando) {
  consumable.value = props.item.isConsumable ? "consumible" : "devolutivo";
}

async function submitForm(data) {
  console.log(data);
  if (props.editando) {
    DatabaseStore.updateElement(data, "products", props.item.docId);
  } else {
    if (typeof data.codigoBarra == "number")
      data.codigoBarra = data.codigoBarra.toString();
    const docRef = doc(db, "products", data.codigoBarra);
    const alreadyExists = await getDoc(docRef);
    if (alreadyExists.exists()) {
      utilsStore.notifyError("El codigo de barras ya esta registrado");

      return;
    }

    setDoc(docRef, data).then(() => {
      emit("enviado");
      utilsStore.notifyError("Producto guardado exitosamente", "positive");
    });
  }

  // Redirigir a la página de detalles y pasar los datos mediante una ruta con parámetros
}
</script>

<style>
/* Estilos personalizados */
/* ... */
</style>
