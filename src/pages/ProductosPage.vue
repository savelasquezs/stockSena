<template>
  <div style="background-color: #f5f5f5">
    <!-- Contenido aquí -->

    <div class="q-pa-md">
      <div class="q-pa-md row items-start q-gutter-md flex justify-center">
        <q-item clickable to="/">
          <q-img
            src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png"
            loading="lazy"
            spinner-color="white"
            width="100px"
            class=""
          />
        </q-item>
        <StadisticTableItem
          titulo="TOTAL PRODUCTOS"
          valor="34.000"
          periodo="ultima semana"
          text-color="text-orange-14"
        />
        <StadisticTableItem
          titulo="LO MÁS PRESTADO"
          valor="6.890"
          periodo="ultima semana"
          text-color="text-green-10"
        />
        <StadisticTableItem
          titulo="BAJAS"
          valor="4.000"
          periodo="ultima semana"
          text-color="text-red-14"
        />
      </div>
      <q-dialog v-model="mostrarVentanaEmergente">
        <q-card style="width: 700px; max-width: 80vw">
          <q-card-section>
            <q-card-section class="flex row justify-end q-pb-none">
              <q-btn
                dense
                round
                flat
                icon="close"
                v-close-popup
                style="width: 30px"
              >
                <q-tooltip class="bg-white text-red">Cerrar</q-tooltip>
              </q-btn>
            </q-card-section>
            <productos-form />
          </q-card-section>
        </q-card>
      </q-dialog>
      //Aca va la tabla
      <SimpleTable
        :rows="dataTableArray"
        :columns="productosStore.columns"
        agregarElementoLabel="Agregar producto"
      />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import ProductosForm from "../components/productos/ProductosForm.vue";
import StadisticTableItem from "components/utils/StadisticTableItem.vue";
import { useProductosStore } from "stores/productosStore";
import SimpleTable from "components/utils/SimpleTable.vue";
import { ref } from "vue";

const mostrarVentanaEmergente = ref(false);
const productosStore = useProductosStore();
const dataTableArray = ref([]);
dataTableArray.value = productosStore.productosDatabase;
</script>
