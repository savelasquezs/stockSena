<template>
  <!--Se imprime el valor de expandedRows en el template usando {{ expandedRows }}.
    Esto parece ser una variable reactiva que contiene información sobre las filas expandidas
    en la tabla. Esta línea es posiblemente solo para propósitos de depuración y puede eliminarse en la implementación final.-->
  <!-- Se define un <q-table> que se encargará de mostrar los datos tabulados en una interfaz de tabla.  -->
  <q-table
    flat
    bordered
    :title="title"
    :rows="dataArray"
    :columns="columns"
    row-key="name"
    :filter="search"
    virtual-scroll
    :rows-per-page-options="[0]"
    style="max-height: 600px"
    class="q-mx-sm mayusculas"
    dense
  >
    <!-- Se define un slot de encabezado utilizando <template v-slot:top>. -->
    <template v-slot:top>
      <div class="col-2 q-table__title">{{ title }}</div>

      <q-space />
      <div class="flex shadow-1 q-pa-lg q-mx-lg">
        <q-input v-model="search" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <DatePicker
          v-if="buscarPorFecha"
          range
          @guardarFecha="filterByDate"
          @cleanedDates="resetTable"
        />
      </div>
      <q-space />
      <q-btn
        color="primary"
        label="Descargar"
        icon="download"
        style="width: 200px"
      />
      <q-btn
        class="q-ml-sm"
        color="primary"
        :label="addText"
        icon="add_circle"
        @click="$emit('add')"
        style="width: 300px"
        v-if="addText"
      />
    </template>
    <!-- Se define un slot de encabezado de columna utilizando <template v-slot:header="props">. En este espacio, se generan las columnas de encabezado de la tabla utilizando v-for. Se itera sobre las columnas proporcionadas en props.cols y se muestra su etiqueta. -->
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            size="sm"
            color="accent"
            round
            @click="toggleRowExpansion(props.row)"
            :icon="props.row.expand ? 'remove' : 'add'"
          />
        </q-td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props" style="">
          <div v-if="col.name == 'document'" class="">
            <q-item
              style="clickable; width:100%"
              :to="customerUrl(col.value)"
              class="coloreble flex flex-center"
              dense
            >
              <q-item-section avatar side>
                <q-icon color="accent" name="ads_click" />
              </q-item-section>
              <q-item-section side class="text-blue">
                {{ col.value }}</q-item-section
              >
            </q-item>
          </div>

          <span v-else>{{ col.value }}</span>
        </q-td>
      </q-tr>
      <q-tr v-show="props.row.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left">
            <q-table
              :rows="props.row.productosList"
              :columns="internalColumns"
              dark
            >
              <template v-slot:body-cell-acciones="props">
                <q-td :props="props">
                  <q-btn
                    @click="verDetalles(props.row.docId || props.row.productId)"
                    icon="visibility"
                    rounded
                    size="10px"
                    style="width: 20px; margin-right: 8px"
                    text-color="green-7"
                  />
                  <q-btn
                    v-if="editable"
                    icon="edit"
                    rounded
                    size="10px"
                    style="width: 20px; margin-right: 8px"
                    text-color="secondary"
                    @click="
                      $emit('editando', props.row.docId || props.row.productId)
                    "
                  />
                </q-td>
              </template>
            </q-table>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import DatePicker from "../utils/DatePicker.vue";

const search = ref("");
const rangoFechas = ref(null);
const emit = defineEmits(["editando", "viendo"]);

const props = defineProps({
  dataArray: Array,
  columns: Array,
  title: String,
  internalColumns: Array,
  addText: String,
  editable: String,
  agregarElementoLabel: String,
  buscarPorFecha: Boolean,
  customDetailRouting: Boolean,
  tablaUrl: String,
  table: String,
});

const router = useRouter();

const customerUrl = (documentId) => {
  return `/clientes/${documentId}`;
};

function verDetalles(docId) {
  console.log(props.customDetailRouting);
  console.log(docId);
  if (props.id) {
    dataArray;
    emit("viendo", docId);
    return;
  } else {
    router.push(`/${props.tablaUrl}/${docId}`);
  }
}

const rows = ref([...props.dataArray]);

// Agrega un watcher para detectar cambios en props.dataArray

function toggleRowExpansion(row) {
  row.expand = !row.expand;
}

function configureFecha(fecha) {
  const fechaNormal = fecha.split("-");
  const nuevaFecha =
    fechaNormal[1] + "-" + fechaNormal[0] + "-" + fechaNormal[2];
  return nuevaFecha;
}

const expandedRows = computed(() => {
  console.log(props.dataArray);
  const expanded = props.dataArray.map((elemento) => {
    const id = elemento.docId;
    return { [id]: false };
  });
  return expanded;
});

function filterByDate(valorFechas) {
  rangoFechas.value = valorFechas;
}

function resetTable() {
  rangoFechas.value = null;
}
</script>
