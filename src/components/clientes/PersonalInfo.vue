<template>
  {{ prestamosStore.currentCustomer }}
  {{ cliente }}
  <div class="client-info-card">
    <q-card class="q-pa-md">
      <q-card-section class="text-h6 q-flex q-items-center">
        Información del Cliente
      </q-card-section>

      <q-card-section>
        <div class="fit row wrap justify-start items-start content-start">
          <div class="col-auto self-end q-gutter-xs q-gutter-sm">
            <div class="q-mb-md">
              <strong>Nombre: </strong
              ><span class="info-client"
                >{{ prestamosStore.currentCustomer.nombre }}
              </span>
              <!-- {{ cliente.nombre }} -->
            </div>
            <div class="q-mb-md">
              <strong>Apellido: </strong>
              <span class="info-client">{{
                prestamosStore.currentCustomer.apellido
              }}</span>
              <!-- {{ cliente.apellido }} -->
            </div>
            <div class="q-mb-md">
              <strong>Documento: </strong
              ><span class="info-client">{{
                prestamosStore.currentCustomer.numero_id
              }}</span>
              <!-- {{ cliente.apellido }} -->
            </div>
            <div class="q-mb-md">
              <strong>Area: </strong
              ><span class="info-client">{{
                prestamosStore.currentCustomer.area
              }}</span>
              <!-- {{ cliente.apellido }} -->
            </div>
            <div class="q-mb-md">
              <strong>Rol: </strong
              ><span class="info-client"
                >{{ prestamosStore.currentCustomer.rol }}
              </span>
              <!-- {{ cliente.nombre }} -->
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { UseClientesStore } from "src/stores/clientesStore";
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { ref } from "vue";
import { useRoute } from "vue-router";
const id = ref(null);
const cliente = ref("");
const route = useRoute();
id.value = parseInt(route.params?.id); // default value if no params provided in the url (e
const prestamosStore = UsePrestamosStore();
const clientesStore = UseClientesStore();
cliente.value = prestamosStore.currentCustomer;
</script>

<style scoped>
.client-info-card {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
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
