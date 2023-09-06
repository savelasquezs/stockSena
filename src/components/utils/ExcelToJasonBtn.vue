<!-- Fecha documentación 30/08/23 -->
<!-- Implementacion de las funcionalidades principales que se presentan en la pagina productos -->
<!-- Este código es una parte de un componente de una aplicación web que utiliza el framework Vue.js y Firebase
     para realizar operaciones relacionadas con la carga, conversión y descarga de archivos Excel. -->
<template>
  <!-- Se añade un boton que permite entrar a el explorador de archivos y seleccionar
     un archivo con formato xls-->
  <q-file
    v-model="fileExcel"
    label="Cargar Archivos"
    filled
    counter
    multiple
    class="q-ml-sm"
    style="max-width: 300px"
  />
  <!-- Se añade un boton que permite convertir los archivos adjuntados a formato tipo
  json -->
  <q-btn
    @click="passToJasson"
    icon="file_upload"
    color="primary"
    label="Subir datos"
    class="q-ml-sm"
    style="width: 210px"
  />
  <!--Se implementa un boton que permite descargar un formato clientes unicamente con los 
    campos principales para que el individuo pueda rellenar a gusto-->
  <q-btn
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

//Se define una función llamada passToJasson, que se encarga de convertir un archivo Excel
//en formato JSON y luego subir ese JSON a Firebase
const passToJasson = () => {
  const file = fileExcel.value[0];

  // Se crea un nuevo objeto FileReader,
  //que es una API web que permite leer archivos en el navegador.
  const reader = new FileReader();

  //Se define el evento onload para el lector de archivos. Al cargar el archivo pasa de
  //formato Excel a JSON.
  reader.onload = (e) => {
    //onload, se accede al resultado del lector (e.target.result),
    // que es el contenido binario del archivo Excel cargado.
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const worksheet = workbook.SheetNames[0];

    // Se utiliza XLSX.utils.sheet_to_row_object_array
    // para convertir la hoja de cálculo en un array de objetos JSON.
    const objJson = XLSX.utils.sheet_to_row_object_array(
      workbook.Sheets[worksheet]
    );
    // Finalmente, la función uploadToFirebase Se llama con el objeto JSON
    // resultante como argumento. Esta función se encargará de cargar los datos en Firebase.
    uploadToFirebase(objJson);
  };
  //Si ocurre algún error durante la lectura del archivo, se maneja en el evento onerror.
  reader.onerror = (ex) => {
    console.log(ex);
  };
  reader.readAsBinaryString(file);
};
// Sube los datos JSON a Firebase dependiendo del tamaño del objeto
const uploadToFirebase = (objJson) => {
  console.log("Función activada");
  const objLength = objJson.length;

  //El código verifica diferentes condiciones basadas en el tamaño del objeto JSON
  // Si objLength es menor que 100, se ejecuta el bloque dentro del primer if.

  if (objLength < 100) {
    console.log("primer if");
    objJson.forEach((element) => {
      databaseStore.saveElement(element, props.nomTabla);
    });

    // Si objLength es menor que 10000 pero mayor o igual que 100,
    // se ejecuta el bloque dentro del segundo if. Esto sugiere que los datos son más
    // densos y organizados en una estructura de arrays anidados. Se recorren los arrays
    //  anidados y se ejecuta la misma función de guardado para cada elemento.
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
  // Se imprime en la consola el valor de props.nomTabla seguido del texto "hi",
  // lo que permite verificar el valor de esta propiedad.
  console.log(props.nomTabla, "hi");

  // Se inicia un bloque try para manejar posibles errores que puedan surgir
  // durante la ejecución del código. Por otro lado,Dentro del bloque try,
  // se declara una variable filePath que se utilizará para almacenar la ruta del archivo.
  try {
    let filePath = "";

    // El código utiliza una serie de declaraciones
    // if y else if para determinar el valor de filePath en función del valor de props.nomTabla
    // Si props.nomTabla es igual a "products" (productos), se establece filePath en una URL de archivo que apunta a la plantilla de clientes.
    // Si props.nomTabla es igual a "clientes" (clientes), se establece filePath en una URL de archivo que apunta a la plantilla de productos.
    // Si no se cumple ninguna de las condiciones anteriores, se muestra un mensaje de error en la consola y la función retorna.
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
