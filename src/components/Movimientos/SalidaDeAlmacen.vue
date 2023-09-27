<template>
  <SearchProductos
    @productSelected="(product) => $emit('productSelected', product)"
  />
  <q-form ref="formRef">
    <div class="q-pa-md">
      <q-scroll-area
        style="height: 200px"
        class="shadow-1"
        v-if="productlist.length > 0"
      >
        <ExpansionItem
          :productosList="productlist"
          @deselectElement="(id) => $emit('deselectProduct', id)"
          darBaja
        />
      </q-scroll-area>
      <div v-if="productlist.length > 0">
        <q-input
          label="Notas de la devolución"
          v-model="generalDescription"
          autogrow
          class="q-ma-sm"
          outlined
        />
        <q-btn
          color="accent"
          :label="tipoSalida == 'salida' ? 'Dar de baja' : 'Deshabilitar'"
          class="q-mt-md"
          :loading="guardandoDev"
          style="width: 100%"
          @click="verificarValores"
        />
      </div>

      <q-dialog
        v-model="confirmacionOpened"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="" style="width: 500px">
          <q-card-section class="text-center">
            <q-icon name="warning" size="70px" color="amber-8"></q-icon>
          </q-card-section>
          <q-card-section>
            <div class="text-h6">
              Seguro que quieres
              {{ tipoSalida == "salida" ? "Dar de baja" : "Deshabilitar" }}
              estos productos?
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <ProductMainInfo
              v-for="product in productlist"
              :key="product.nombre"
              :product="product"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Cancel" color="red-5" v-close-popup />
            <q-btn
              label="Confirmar"
              color="primary"
              v-close-popup
              @click="DarBaja"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-form>
</template>

<script setup>
import { ref, watch } from "vue";
import SearchProductos from "components/prestamos/SearchProducts.vue";
import ExpansionItem from "components/prestamos/ExpansionItem.vue";
import ProductMainInfo from "components/productos/ProductMainInfo.vue";
import { QForm } from "quasar";
const generalDescription = ref("");
const guardandoDev = ref(null);
const emit = defineEmits(["darSalida", "productSelected", "deselectProduct"]);
const confirmacionOpened = ref(false);

const props = defineProps({ productlist: Array, tipoSalida: String });
const formRef = ref(null);

function verificarValores() {
  formRef.value.validate().then((result) => {
    if (result) {
      confirmacionOpened.value = true;
    }
  });
}

function DarBaja() {
  emit("darSalida", generalDescription.value);
  confirmacionOpened.value = false;
}
</script>

<style lang="scss" scoped></style>
