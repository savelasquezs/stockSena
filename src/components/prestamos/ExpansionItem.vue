<template>
  <div v-for="(producto, index) in productosList" :key="index">
    <q-expansion-item expand-icon-toggle expand-separator>
      <template v-slot:header>
        <q-item-section avatar>
          <q-avatar color="accent" text-color="white">{{
            producto.nombre[0]
          }}</q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ producto.nombre }}</q-item-label>
          <q-item-label caption>{{ producto.codigoBarra }}</q-item-label>
        </q-item-section>

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
              :max="
                producto.stockTotal -
                producto.borrowedQuantity -
                producto.unavailableQuantity
              "
              v-model="producto.prestar"
              style="width: 80px"
              type="number"
              :rules="[
                (val) => val >= 0 || 'La cantidad debe ser mayor a 0',
                (val) =>
                  val <=
                    producto.stockTotal -
                      producto.borrowedQuantity -
                      producto.unavailableQuantity ||
                  `Solo ${
                    producto.stockTotal -
                    producto.borrowedQuantity -
                    producto.unavailableQuantity
                  } unidades disponibles`,
              ]"
            />

            <q-btn
              icon="add_circle"
              round
              color="primary"
              @click="producto.prestar++"
              :disable="
                producto.prestar ==
                producto.stockTotal -
                  producto.borrowedQuantity -
                  producto.unavailableQuantity
              "
            />
          </div>
        </q-item-section>
        <q-item-section v-if="!darBaja">
          <div class="flex flex-center">
            <DatePicker
              options
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
            @click="$emit('deselectElement', producto.docId)"
          />
        </q-item-section>
      </template>

      <q-card style="max-width: 100%">
        <q-card-section class="q-px-lg bg-grey-1">
          <q-separator />
          <div class="flex flex-center bg-white">
            <span class="q-ma-sm shadow-1 q-pa-sm q-pa-md" style="width: 90%">
              <span class="text-subtitle2">Notas producto:</span>
              {{ producto.descripcion || producto.notas }}
            </span>
          </div>
          <div class="flex justify-evenly">
            <CustomPropertiesTable
              style="height: 90px; width: 45%"
              :producto="producto"
              v-if="!producto.isConsumable"
              class="bg-white"
            />
            <div
              class="q-pa-md q-card--bordered shadow-3 bg-white"
              style="height: 90px; width: 45%"
            >
              <q-input
                v-model="producto.comentario"
                autogrow
                label="Ingrese comentarios"
                :rules="[withoutReasonError]"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-separator />
  </div>
</template>

<script setup>
import CustomPropertiesTable from "components/productos/CustomPropertiesTable.vue";
import DatePicker from "components/utils/DatePicker.vue";
import { UseUtilsStore } from "src/stores/utilsStore";

const props = defineProps({ productosList: Array, darBaja: Boolean });
const emit = defineEmits(["deselectElement"]);
const utilsStore = UseUtilsStore();

function withoutReasonError(value) {
  if (!!value) return true;
  else if (props.darBaja) {
    utilsStore.notifyError(
      "Despliega el producto e ingresa el motivo para dar de baja el producto"
    );

    return "Debes ingresar un motivo para dar de baja el producto";
  }
}
</script>

<style lang="scss" scoped></style>
