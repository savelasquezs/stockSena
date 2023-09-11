<!-- Fecha documentacion 31/08/23 -->
<!-- Este fragmento de código representa un componente Vue.js que se encarga de crear una tabla con características
  interactivas y funcionalidades adicionales, como filtrado por fecha, expansión de filas y botones de acción
  en las celdas. A continuación, se explica cada parte del código en detalle -->
<template>
  <!--Se imprime el valor de expandedRows en el template usando {{ expandedRows }}.
    Esto parece ser una variable reactiva que contiene información sobre las filas expandidas
    en la tabla. Esta línea es posiblemente solo para propósitos de depuración y puede eliminarse en la implementación final.-->
  <!-- Se define un <q-table> que se encargará de mostrar los datos tabulados en una interfaz de tabla.  -->
  <q-table
    flat
    bordered
    :title="title"
    :rows="rows"
    :columns="columns"
    row-key="name"
    :filter="search"
    virtual-scroll
    :rows-per-page-options="[0]"
    style="max-height: 600px"
    class="q-mx-sm"
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

        <!-- Se le pasa la propiedad range para habilitar la selección de un rango de fechas. -->
        <!-- El evento @guardarFecha está asociado con la función filterByDate, 
             lo que significa que cuando se selecciona una fecha en el componente DatePicker y se confirma,
             se llama a la función filterByDate. -->
        <!-- El evento @cleanedDates está asociado con la función resetTable, 
             lo que significa que cuando se restablecen las fechas en el componente DatePicker,
             se llama a la función resetTable.   -->
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
      <!-- Se establece un manejador de clic utilizando @click="$emit('add')"
         que emite un evento personalizado "add" cuando se hace clic en el botón. -->

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
    <!-- Se define un slot de encabezado de columna utilizando <template v-slot:header="props">.
    En este espacio, se generan las columnas de encabezado de la tabla utilizando v-for. Se itera sobre las columnas proporcionadas en props.cols y se muestra su etiqueta. -->
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
            @click="props.row.expand = !props.row.expand"
            :icon="props.row.expand ? 'remove' : 'add'"
          />
          <!-- <q-td v-for="col in props.cols" :key="col.name" :props="props">:
           Esto representa las celdas de datos en la fila. Utiliza una directiva v-for para iterar sobre las columnas (col) en props.cols. 
           Cada columna tiene un nombre único (col.name) que se usa como clave (key) para identificar de manera única cada celda. -->
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
      <!-- <q-tr v-show="props.row.expand" :props="props">: Esto representa una segunda fila que se muestra solo cuando la fila principal
         está expandida. Utiliza la directiva v-show para controlar la visibilidad basada en la propiedad "expand" de la fila principal. -->
      <q-tr v-show="props.row.expand" :props="props">
        <!-- <q-td colspan="100%"> -->
        <q-td colspan="100%">
          <div class="text-left">
            <q-table
              :rows="props.row.productosList"
              :columns="internalColumns"
              dark
            >
              <!-- v-slot:body="props": Esto define un slot nombrado llamado "body" en el componente que utiliza esta
               plantilla. Los slots permiten pasar contenido personalizado a un componente desde fuera. "props"
                es el objeto que contendrá las propiedades pasadas al slot. -->
              <template v-slot:body-cell-acciones="props">
                <q-td :props="props">
                  <!-- @click="$emit('viendo', props.rows.docId)": Este código configura un manejador de eventos
                     para el primer botón. Cuando se hace clic en este botón, se emite un evento personalizado 
                     llamado "viendo" con el valor props.rows.docId. -->
                  <q-btn
                    @click="verDetalles(props.row.docId || props.row.productId)"
                    icon="visibility"
                    rounded
                    size="10px"
                    style="width: 20px; margin-right: 8px"
                    text-color="green-7"
                  />
                  <!-- @click="$emit('editando', props.row.docId)": Este código configura un manejador de eventos
                       para el segundo botón. Similar al primer botón, cuando se hace clic en este botón, se emite
                       un evento personalizado llamado "editando" con el valor props.row.docId. -->
                  <q-btn
                    v-if="editable"
                    icon="edit"
                    rounded
                    size="10px"
                    style="width: 20px; margin-right: 8px"
                    text-color="secondary"
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
// Se importa computed y ref de "vue" para crear variables reactivas y calculadas.
import { computed, ref } from "vue";
// Se importa el componente personalizado DatePicker desde "../utils/DatePicker.vue".
import { useRouter } from "vue-router";
import DatePicker from "../utils/DatePicker.vue";
const search = ref("");
// Se definen las variables reactivas search, rangoFechas y rows.
const rangoFechas = ref(null);
const rows = ref([]);
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
    emit("viendo", docId);
    return;
  } else {
    router.push(`/${props.tablaUrl}/${docId}`);
  }
}

rows.value = props.dataArray;

const expandedRows = computed(() => {
  console.log(props.dataArray);
  const expanded = props.dataArray.map((elemento) => {
    const id = elemento.docId;
    return { [id]: false };
  });
  return expanded;
});
// Se define una función configureFecha para ajustar el formato de la fecha.
function configureFecha(fecha) {
  const fechaNormal = fecha.split("-");
  const nuevaFecha =
    fechaNormal[1] + "-" + fechaNormal[0] + "-" + fechaNormal[2];
  return nuevaFecha;
}
// Se definen las funciones filterByDate y resetTable para filtrar la tabla por fechas y reiniciar la tabla,
// respectivamente.
function filterByDate(valorFechas) {
  rangoFechas.value = valorFechas;
  if (rangoFechas.value != null) {
    const fromDate = new Date(configureFecha(rangoFechas.value.from)).getTime();
    const toDate = new Date(configureFecha(rangoFechas.value.to)).setHours(
      23,
      59,
      59
    );
    // La propiedad rows se inicializa con el valor de props.dataArray, que se espera que sea una matriz
    // de datos para la tabla.
    const filtro = props.dataArray.filter((item) => {
      if (props.table == "borrowings") {
        console.log({ item: item.dateBorrowed, fromDate, toDate });
        return item.dateBorrowed > fromDate && item.dateBorrowed < toDate;
      }
      console.log({ item: item.fecha, fromDate, toDate });
      return item.fecha > fromDate && item.fecha < toDate;
    });
    rows.value = filtro;
    rangoFechas.value = null;
  }
}

function resetTable() {
  rows.value = props.dataArray;
}
</script>

<style lang="scss" scoped></style>
