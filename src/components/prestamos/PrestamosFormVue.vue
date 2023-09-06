<template>
  <div class="flex flex-center">
    <q-avatar
      icon="real_estate_agent"
      color="accent"
      text-color="white"
      class="text-center"
    />
  </div>
  <div v-if="!cliente.nombre">
    <h3 class="text-h6 text-center">Ingresa un documento de identidad</h3>
    <q-input
      color="teal"
      filled
      v-model="documento"
      label="Documento"
      type="number"
      @change="buscarCliente"
    >
      <template v-slot:prepend>
        <q-icon name="person_search" />
      </template>
      <template v-slot:append>
        <q-btn icon="search" @click="buscarCliente" round />
      </template>
    </q-input>
  </div>
  <div v-else>
    <PersonalInfo />

    <div class="flex justify-between q-ma-md shadow-1 q-pa-md">
      <div>
        <q-item>
          <q-item-section avatar>
            <q-icon color="accent" size="3rem">
              <DevolutivosIcon />
            </q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>Prestar producto Devolutivo</q-item-label>
          </q-item-section>
        </q-item>
        <q-input
          bottom-slots
          v-model="devolutivoSearch"
          label="Codigo de barras"
          counter
          type="number"
          :dense="dense"
        >
          <template v-slot:append>
            <q-icon
              name="close"
              @click="devolutivoSearch = ''"
              class="cursor-pointer"
            />
          </template>

          <template v-slot:hint>
            <span> Codigo de barras producto devolutivo </span>
          </template>
        </q-input>
      </div>
      <q-separator vertical />
      <div>
        <q-item>
          <q-item-section avatar>
            <q-icon color="accent" size="3rem">
              <ConsumiblesIcon />
            </q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>Prestar producto Consumible</q-item-label>
          </q-item-section>
        </q-item>
        <AutocompleteInput
          hint="Busca el nombre del producto"
          :stringOptions="productosStore.nameColumnsConsumibles"
          @cambioModel="setConsumible"
          v-model="consumibleSelected"
        />
      </div>
    </div>
    <div class="q-pa-md">
      <q-scroll-area style="height: 300px" class="shadow-1">
        <div v-for="(producto, index) in productosList" :key="index">
          <q-expansion-item expand-icon-toggle expand-separator>
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar color="accent" text-color="white">{{
                  producto.nombre[0]
                }}</q-avatar>
              </q-item-section>

              <q-item-section>{{ producto.nombre }} </q-item-section>

              <q-item-section>
                <div class="flex flex-center" style="width: 200px">
                  <q-btn
                    icon="do_not_disturb_on"
                    round
                    color="red-5"
                    @click="producto.prestar--"
                    :disable="producto.prestar < 2"
                  />
                  <q-input
                    dense
                    class="text-subtitle2 q-mx-sm"
                    min="1"
                    :max="producto.stockTotal - producto.borrowedQuantity"
                    v-model="producto.prestar"
                    type="number"
                    :rules="[
                      (val) =>
                        val >= 0 &&
                        val <= producto.stockTotal - producto.borrowedQuantity,
                    ]"
                  />

                  <q-btn
                    icon="add_circle"
                    round
                    color="primary"
                    @click="producto.prestar++"
                    :disable="
                      producto.prestar ==
                      producto.stockTotal - producto.borrowedQuantity
                    "
                  />
                </div>
              </q-item-section>
              <q-item-section>
                <div class="flex flex-center">
                  <DatePicker
                    @guardarFecha="(fecha) => (producto.fechaEntrega = fecha)"
                  />
                  <q-input disable v-model="producto.fechaEntrega"
                    ><template v-slot:hint>
                      <span> Entrega </span>
                    </template></q-input
                  >
                </div>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  icon="delete"
                  style="width: 50px"
                  @click="deselectRow(producto)"
                />
              </q-item-section>
            </template>

            <q-card>
              <q-card-section>
                {{ producto.descripcion }}
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup>
import { UsePrestamosStore } from "src/stores/prestamosStore";
import { computed, onBeforeUnmount, ref } from "vue";
import PersonalInfo from "components/clientes/PersonalInfo.vue";
import { useRoute } from "vue-router";
import ConsumiblesIcon from "components/icons/ConsumiblesIcon.vue";
import DevolutivosIcon from "components/icons/DevolutivosIcon.vue";
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import { useProductosStore } from "src/stores/productosStore";
import DatePicker from "components/utils/DatePicker.vue";
const productosList = ref([]);
const consumibleSelected = ref("");

const documento = ref("");
const prestamosStore = UsePrestamosStore();
const devolutivoSearch = ref("");
const currentProduct = ref({});

function setConsumible(algo) {
  const producto = productosStore.getConsumableByName(algo);
  currentProduct.value = producto;
  console.log(algo);
  console.log(producto);

  productosList.value.unshift({
    ...producto,
    prestar: 1,
    fechaEntrega: new Date().toLocaleDateString("es-CO"),
  });
}

const productosStore = useProductosStore();

async function buscarCliente() {
  console.log(documento.value);
  await prestamosStore.getPrestamosByPerson(documento.value);
}

const cliente = computed(() => {
  return prestamosStore.currentCustomer;
});

const route = useRoute();
onBeforeUnmount(() => {
  const rutaCompleta = route.path.split("/");
  if (!(rutaCompleta.length > 2 && !!Number(rutaCompleta[2]))) {
    console.log("si es esta");
    prestamosStore.resetCurrentCustomer();
  }
});
</script>

<style lang="scss" scoped></style>
