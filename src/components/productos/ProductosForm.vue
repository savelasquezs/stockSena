<template>
  <div class="">
    <q-form @submit="submitForm" class="">
      <h4>Ingresa Producto</h4>

      <q-input
        outlined
        v-model="formulario.nombre"
        label="Nombre"
        required
        :rules="[(val) => val.length > 2 || 'Por favor un nombre valido']"
      >
        <template v-slot:append>
          <q-icon
            name="chat
                "
          />
        </template>
      </q-input>

      <q-select
        outlined
        v-model="formulario.consumible"
        label="Consumible"
        :options="['Sí', 'No']"
        emit-value
        map-options
      />

      <q-input
        outlined
        v-model.number="formulario.stockTotal"
        label="Stock Total"
        type="number"
        required
        :rules="[(val) => val > 0 || 'El valor debe ser mayor a 0']"
        class="q-my-lg"
      />

      <q-input
        outlined
        v-model.number="formulario.codigoBarra"
        label="Código de Barra"
        required
        class="q-my-lg"
      >
        <template v-slot:append>
          <q-icon
            name="inventory_2
                "
          />
        </template>
      </q-input>

      <q-btn
        type="submit"
        label="Guardar"
        color="primary"
        @click="toggleVentanaEmergente"
      />
    </q-form>
  </div>

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
    name: "tabla",
  });
}
</script>

<style>
/* Estilos personalizados */
/* ... */
</style>
