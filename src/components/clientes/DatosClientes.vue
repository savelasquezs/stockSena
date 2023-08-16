<template>
  <div class="client-info-card">
    <q-card class="q-pa-md">
      <q-card-section class="text-h6 q-flex justify-between items-center">
        Información del Cliente
        <q-btn class="" color="primary" label="Editar" />
      </q-card-section>
      <q-card-section> </q-card-section>
      <q-card-section>
        <div class="q-gutter-md">
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

          <!-- Agrega más campos de información del cliente aquí -->
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// import { ref, props } from "vue";

// const cliente = props.cliente;
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
