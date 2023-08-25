<template>
  <q-file
    v-model="fileExcel"
    label="Cargar Archivos"
    filled
    counter
    multiple
    class="q-ml-sm"
    style="max-width: 300px"
  />
  <q-btn
    @click="passToJasson"
    icon="file_download"
    color="primary"
    label="Subir datos"
    class="q-ml-sm"
    style="width: 210px"
  />
</template>

<script setup>
import { ref } from "vue";
import { useDatabaseStore } from "src/stores/DatabaseStore";

const databaseStore = useDatabaseStore();
const fileExcel = ref([]);

const props = defineProps({ tabla: String });

function passToJasson() {
  console.log(props.tabla);
  const file = fileExcel.value[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const worksheet = workbook.SheetNames[0];

    const objJson = XLSX.utils.sheet_to_row_object_array(
      workbook.Sheets[worksheet]
    );
    //borrar este console

    uploadToFirebase(objJson);
  };
  reader.onerror = (ex) => {
    console.log(ex);
  };
  reader.readAsBinaryString(file);
}

function uploadToFirebase(objJson) {
  console.log("Función activada");
  // Sube los datos JSON a Firebase dependiendo del tamaño del objeto

  const objLength = objJson.length;
  console.log(objLength);
  console.log(objLength.value);
  console.log(objJson);
  console.log(objJson.value);
  if (objLength < 100) {
    console.log("primer if");
    objJson.forEach((element) => {
      databaseStore.saveElement(element, props.tabla);
    });
  } else if (objLength < 10000) {
    console.log("segundo if");
    objJson.forEach((array) => {
      array.forEach((item) => {
        databaseStore.saveElement(item, props.tabla);
      });
    });
  } else {
    //usar el utils qdialog
  }
}
</script>
