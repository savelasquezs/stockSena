<template>
  <div class="client-info-card">
    <q-card class="q-pa-md">
      <q-card-section class="text-h6 q-flex q-items-center">
        Información del Cliente
      </q-card-section>

      <q-card-section>
        <div class="fit row wrap justify-start items-start content-start">
          <div class="col-auto self-end q-gutter-xs q-gutter-sm">
            <div class="q-mb-md">
              <strong>Nombre:</strong><span class="info-client">Joan</span>
              <!-- {{ cliente.nombre }} -->
            </div>
            <div class="q-mb-md">
              <strong>Apellido:</strong>
              <span class="info-client">Zapata</span>
              <!-- {{ cliente.apellido }} -->
            </div>
            <div class="q-mb-md">
              <strong>Docuemnto:</strong
              ><span class="info-client">1027800932</span>
              <!-- {{ cliente.apellido }} -->
            </div>
            <div class="q-mb-md">
              <strong>Estado:</strong><span class="info-client">Morosos</span>
              <!-- {{ cliente.apellido }} -->
            </div>
          </div>

          <div class="col-auto offset-2 q-gutter-sm">
            <div class="q-mb-md">
              <strong>Nombre:</strong><span class="info-client">Joan</span>
              <!-- {{ cliente.nombre }} -->
            </div>
            <div class="q-mb-md">
              <strong>Apellido:</strong>
              <span class="info-client">Zapata</span>
              <!-- {{ cliente.apellido }} -->
            </div>
            <div class="q-mb-md">
              <strong>Docuemnto:</strong
              ><span class="info-client">1027800932</span>
              <!-- {{ cliente.apellido }} -->
            </div>
            <div class="q-mb-md">
              <strong>Estado:</strong><span class="info-client">Morosos</span>
              <!-- {{ cliente.apellido }} -->
            </div>
          </div>

          <div class="col-auto offset-3 q-gutter-sm">
            <div class="q-mb-md"></div>
            <div class="q-mb-md">
              <strong>Nombre:</strong><span class="info-client">Joan</span>
              <!-- {{ cliente.nombre }} -->
            </div>
            <div class="q-mb-md">
              <strong>Apellido:</strong>
              <span class="info-client">Zapata</span>
              <!-- {{ cliente.apellido }} -->
            </div>
            <div class="q-mb-md">
              <strong>Docuemnto:</strong
              ><span class="info-client">1027800932</span>
              <!-- {{ cliente.apellido }} -->
            </div>
            <div class="q-mb-md">
              <strong>Estado:</strong><span class="info-client">Morosos</span>
              <!-- {{ cliente.apellido }} -->
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="row justify-end items-start">
        <div class="q-pr-lg">
          <q-btn class="" color="red" label="Voler" />
        </div>
        <div>
          <q-btn class="" color="primary" label="Editar" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import AutocompleteInput from "components/utils/autocompleteInput.vue";
export default {
  data() {
    return {
      Tipo_documento: null,
      options_Tipo_documento: ["SEbas", "Joan"],
    };
  },
};
</script>

<style scoped>
.client-info-card {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 50px;
}

.q-card {
  max-width: 100%;
  width: 100%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.q-card-section {
  padding: 20px;
}

.q-gutter-md > * {
  margin-bottom: 20px;
}

.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 20px;
}
</style>
