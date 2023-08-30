<template>
  <div class="q-tables">
    <div class="q-mr-lg">
      <div>
        <q-input class="q-ml-sm" v-model="filtro" style="width: 410px">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="flex justify-end">
        <div>
          <q-btn
            @click="$emit('agregando')"
            :label="agregarElementoLabel"
            icon="add_circle_outline"
            color="primary"
            style="width: 210px"
            class="q-ml-sm"
            v-if="agregarElementoLabel"
          />
          <q-btn
            @click="exportTable"
            icon="file_download"
            color="primary"
            label="Descargar tabla"
            class="q-ml-sm"
            style="width: 210px"
          >
          </q-btn>
        </div>
      </div>
    </div>
    <div class="q-tables">
      <q-table
        style="max-height: 500px"
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="index"
        :rows-per-page-options="[0]"
        :selection="seleccionar ? 'multiple' : 'none'"
        v-model:selected="selected"
        virtual-scroll
        :filter="filtro"
        class="my-card flex shadow-5 shadow-up-3"
        table-header-style="background-color:#00af00; color:#ffff; shadow-n"
        :loading="loading"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              @click="$emit('viendo', props.row.docId || props.row.productId)"
              icon="visibility"
              rounded
              size="10px"
              style="width: 20px; margin-right: 8px"
              text-color="green-7"
            />
            <q-btn
              @click="searchData(props.row.docId)"
              icon="edit"
              rounded
              size="10px"
              style="width: 20px; margin-right: 8px"
              text-color="secondary"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-caritas="props">
          <q-td :props="props">
            <q-icon
              :name="
                props.row.quantity > props.row.returnedQuantity
                  ? 'sentiment_dissatisfied'
                  : 'sentiment_very_satisfied'
              "
              size="30px"
              :color="
                props.row.quantity > props.row.returnedQuantity
                  ? 'red-5'
                  : 'accent'
              "
            />
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-accent q-gutter-sm">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span> No Tenemos registros </span>

            <q-icon size="2em" />
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { exportFile } from "quasar";
import { ref, watch } from "vue";
const emit = defineEmits(["agregando", "viendo", "editando", "cambioSelected"]);
const props = defineProps([
  "agregarElementoLabel",
  "rows",
  "columns",
  "seleccionar",
  "loading",
]);

function searchData(id) {
  const item = props.rows.find((item) => item.docId == id);
  emit("editando", item);
  return item;
}

const selected = ref([]);

const filtro = ref("");
const exportTable = () => {
  const columnLabels = props.columns.map((col) => col.label);
  const dataRows = props.rows.map((row) =>
    props.columns.map((col) =>
      wrapCsvValue(
        typeof col.field === "function"
          ? col.field(row)
          : row[col.field === void 0 ? col.name : col.field],
        col.format,
        row
      )
    )
  );

  const content = [columnLabels].concat(dataRows);
  const csvContent = content
    .map((row) => row.map((cell) => wrapCsvValue(cell)).join(";"))
    .join("\r\n");

  // Codificar el contenido en UTF-8 y agregar el BOM
  const encodedContent = new TextEncoder().encode("\uFEFF" + csvContent);

  const blob = new Blob([encodedContent], {
    type: "text/csv;charset=UTF-8",
  });

  // Descarga el archivo CSV utilizanseado Quasar exportFile
  exportFile("table-export.csv", blob);
};

const wrapCsvValue = (val, formatFn, row) => {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  return formatted;
};

watch(
  () => selected.value,
  (newValue, oldValue) => {
    // Aquí puedes agregar el código que se ejecutará cuando el valor de selected cambie
    emit("cambioSelected", newValue);
  }
);
</script>

<style lang="scss" scoped></style>
