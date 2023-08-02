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
            <q-item>
              <q-item-section>
                <q-input
                  outlined
                  v-model="formulario.descripcion"
                  label="Descripción"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  outlined
                  v-model.number="formulario.codigoBarra"
                  label="Código de Barra"
                  @blur="adjustBarcodeValue"
                  required
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  outlined
                  v-model="formulario.categoria"
                  label="Categoría"
                />
              </q-item-section>
            </q-item>
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
          <div>Descripción: {{ formulario.descripcion }}</div>
          <div>Código de Barra: {{ formulario.codigoBarra }}</div>
          <div>Categoría: {{ formulario.categoria }}</div>
        </q-card-section>
      </q-card>
    </q-container>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      formulario: {
        nombre: "",
        consumible: "",
        stockTotal: null,
        descripcion: "",
        codigoBarra: null,
        categoria: "",
      },
    };
  },
  methods: {
    submitForm() {
      // Redirigir a la página de detalles y pasar los datos mediante una ruta con parámetros
      this.$router.push({
        name: "detalles",
        params: { detalles: this.formulario },
      });
    },
  },
};
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
