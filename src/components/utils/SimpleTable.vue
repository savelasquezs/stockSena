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
            @click="$emit('segundoBotonClicked')"
            :label="segundoBotonLabel"
            icon="add_circle_outline"
            color="primary"
            style="width: 210px"
            class="q-ml-sm"
            v-if="segundoBotonActivo"
          />
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
        class="my-card flex shadow-5 shadow-up-3 mayusculas"
        table-header-style="background-color:#00af00; color:#ffff; shadow-n"
        :loading="loading"
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
            <q-badge
              :color="
                props.row.quantity > props.row.returnedQuantity
                  ? 'yellow-6'
                  : 'success'
              "
              text-color="black"
            >
              {{ props.row.quantity - props.row.returnedQuantity }}
              <q-icon
                :name="
                  props.row.quantity > props.row.returnedQuantity
                    ? 'warning'
                    : 'sentiment_very_satisfied'
                "
                size="14px"
                class="q-ml-xs"
              />
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-enMora="props">
          <q-td :props="props">
            <div class="flex flex-center">
              <q-icon color="accent" size="1.5rem">
                <EnMora v-if="props.row.enMora" />
                <AlDia v-else />
              </q-icon>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-dueDate="props">
          <q-td :props="props">
            <q-item
              clickable
              style="clickable; width:100%"
              @click="searchData(props.row.docId)"
              class="coloreble flex flex-center"
              dense
            >
              <q-item-section avatar side>
                <q-icon color="accent" name="ads_click" />
              </q-item-section>
              <q-item-section side class="text-blue">
                {{
                  new Date(props.row.dueDate).toLocaleDateString("es-CO")
                }}</q-item-section
              >
            </q-item>
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
import { useRoute, useRouter } from "vue-router";
import AlDia from "components/icons/AlDia.vue";
import EnMora from "components/icons/EnMora.vue";
const emit = defineEmits([
  "agregando",
  "viendo",
  "editando",
  "cambioSelected",
  "segundoBotonClicked",
]);
const props = defineProps({
  agregarElementoLabel: String,
  rows: Array,
  columns: Array,
  seleccionar: Boolean,
  loading: Boolean,
  editable: Boolean,
  tablaUrl: String,
  customDetail: Boolean,
  segundoBotonActivo: Boolean,
  segundoBotonLabel: String,
});

const router = useRouter();

function verDetalles(docId) {
  console.log(props.customDetail);
  if (props.customDetail) {
    emit("viendo", docId);
    return;
  } else {
    router.push(`/${props.tablaUrl}/${docId}`);
  }
}

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
