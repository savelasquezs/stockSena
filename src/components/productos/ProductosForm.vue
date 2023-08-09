<template>
  <q-page class="q-pa-md">
    <q-container>
      <q-card class="q-mb-md">
        <q-card-section>
          <q-form @submit="submitForm">
            <q-item>
              <q-item-section>
                <q-input
                  outlined
                  v-model="formulario.nombre"
                  label="Nombre"
                  required
                  :rules="[
                    (val) => val.length > 2 || 'Por favor un nombre valido',
                  ]"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-select
                  outlined
                  v-model="formulario.consumible"
                  label="Consumible"
                  :options="['Sí', 'No']"
                  use-input
                  emit-value
                  map-options
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  outlined
                  v-model.number="formulario.stockTotal"
                  label="Stock Total"
                  type="number"
                  required
                  :rules="[(val) => val > 0 || 'El valor debe ser mayor a 0']"
                />
              </q-item-section>
            </q-item>
            <q-item> </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  outlined
                  v-model.number="formulario.codigoBarra"
                  label="Código de Barra"
                  required
                />
              </q-item-section>
            </q-item>
            <q-item>
              <!-- <date-picker @guardar-fecha="(fecha) => (dueDate = fecha)" /> -->
              <!-- <q-input v-model="dueDate" /> -->
            </q-item>
            <q-item> </q-item>
            <q-item>
              <q-item-section class="q-mt-md">
                <q-btn type="submit" label="Guardar" color="primary" />
              </q-item-section>
            </q-item>
          </q-form>
        </q-card-section>
      </q-card>

      <!-- Mostrar detalles ingresados -->
      <q-card v-if="showDetails" class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Detalles ingresados:</div>
          <div>Nombre: {{ formulario.nombre }}</div>
          <div>Consumible: {{ formulario.consumible }}</div>
          <div>Stock Total: {{ formulario.stockTotal }}</div>
          <div>Código de Barra: {{ formulario.codigoBarra }}</div>
        </q-card-section>
      </q-card>
    </q-container>
  </q-page>
</template>

<script setup>
import { addDoc, collection } from "firebase/firestore";
import { db } from "src/firebaseInit";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
// import DatePicker from "components/utils/DatePicker.vue";
const router = useRouter();
const formulario = ref({});
const dueDate = ref("");

async function submitForm() {
  const tabla = collection(db, "products");
  console.log(formulario);
  const data = {
    name: formulario.value.nombre,
    consumable: formulario.value.consumible,
    totalStock: formulario.value.stockTotal,
    barCode: formulario.value.codigoBarra,
    borrowedQuantity: 0,
    almacen: "tics",
  };
  const refDoc = await addDoc(tabla, data);
  console.log("documento guardado exitosamente con id _:", refDoc.id);

  // Redirigir a la página de detalles y pasar los datos mediante una ruta con parámetros
  router.push({
    name: "detalles",
  });
}
</script>

<style>
/* Estilos personalizados */
/* ... */
</style>
<style>
/* Agrega aquí estilos personalizados para mejorar la apariencia del formulario */
.q-card {
  max-width: 400px;
  margin: 0 auto;
}

.q-item {
  margin-bottom: 15px;
}

.q-item-section {
  display: flex;
  align-items: center;
}

.q-item-section:first-child {
  flex: 1;
}

.q-btn {
  width: 100%;
}
</style>
