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
    icon="file_upload"
    color="primary"
    label="Subir datos"
    class="q-ml-sm"
    style="width: 210px"
  /><q-btn
    @click="templateExcel"
    icon="file_download"
    color="primary"
    label="plantilla"
    class="q-ml-sm"
    style="width: 210px"
  />
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useDatabaseStore } from "src/stores/DatabaseStore";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";
import { storage } from "src/firebaseInit"; // Importa tu configuración de Firebase
const databaseStore = useDatabaseStore();
const fileExcel = ref([]);

const props = defineProps({ nomTabla: String });

const passToJasson = () => {
  const file = fileExcel.value[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const worksheet = workbook.SheetNames[0];

    const objJson = XLSX.utils.sheet_to_row_object_array(
      workbook.Sheets[worksheet]
    );

    uploadToFirebase(objJson);
  };
  reader.onerror = (ex) => {
    console.log(ex);
  };
  reader.readAsBinaryString(file);
};

const uploadToFirebase = (objJson) => {
  console.log("Función activada");
  // Sube los datos JSON a Firebase dependiendo del tamaño del objeto
  const objLength = objJson.length;

  if (objLength < 100) {
    console.log("primer if");
    objJson.forEach((element) => {
      databaseStore.saveElement(element, props.nomTabla);
    });
  } else if (objLength < 10000) {
    console.log("segundo if");
    objJson.forEach((array) => {
      array.forEach((item) => {
        databaseStore.saveElement(item, props.nomTabla);
      });
    });
  } else {
    // Usar el utils qdialog
  }
};

const templateExcel = async () => {
  console.log(props.nomTabla, "hi");
  try {
    let filePath = "";

    if (props.nomTabla == "products") {
      filePath =
        "gs://sena-stock-management.appspot.com/Plantilla Clientes.xlsx";
    } else if (props.nomTabla == "clientes") {
      filePath =
        "gs://sena-stock-management.appspot.com/Plantilla produtos.xlsxx";
    } else {
      console.log("error, no se conoce la plantilla");
      return;
    }

    // Obtiene el enlace de descarga del archivo
    const fileRef = storageRef(storage, filePath);
    const downloadURL = await getDownloadURL(fileRef);

    // Redirige al usuario al enlace de descarga
    window.open(downloadURL, "_blank");
  } catch (error) {
    console.error("Error al descargar el archivo", error);
  }
};
</script>
