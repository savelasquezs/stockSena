<!-- Día de la documentación: 06/09/2023
Descripción del archivo "BarcodeGenerator.vue":

Este archivo representa un componente de una aplicación Vue.js y Quasar diseñado para generar e imprimir códigos de barras
El componente consta de una página que contiene un título y un botón "Abrir Generador". Cuando se hace clic en el botón, se muestra un cuadro de diálogo
que permite al usuario ingresar contenido para generar el código de barras. El código de barras generado se muestra en el cuadro de diálogo y se proporciona la opción de imprimirlo.

Características clave:
- Muestra un título y un botón para abrir un generador de códigos de barras.
- El cuadro de diálogo permite al usuario ingresar contenido para el código de barras.
- Utiliza la biblioteca "JsBarcode" para generar el código de barras basado en la entrada del usuario.
- Proporciona la funcionalidad de imprimir el código de barras generado en una nueva ventana de impresión.

Props recibidos:
- Ninguno

Eventos emitidos:
- Ninguno

Uso:
- Este componente se utiliza para agregar la capacidad de generación e
 impresión de códigos de barras.

-->
<template>
  <!-- Cuadro de diálogo de generación de códigos de barras -->
  <q-page>
    <!-- Titulo  mostrado (se recomienda borrar a futuro) -->
    <div class="q-pa-md">
      <h1>Generador e Impresor de Códigos de Barras</h1>
      <!-- Botón el cual permite abrir el q-dialog o modal,
      cambiando el estado a true -->
      <q-btn label="Abrir Generador" @click="dialogVisible = true" />
    </div>
    <!-- Modal el cual contiene v-model="dialogVisible" que al pasar de false a
      True se activa.
     -->
    <q-dialog v-model="dialogVisible" persistent>
      <q-card>
        <q-card-section>
          <!-- Titulo dentro del modal -->
          <h2 class="q-mt-md">Generador de Código de Barras</h2>
          <!-- Input el cual contiene  v-model="barcodeData", este v-model
          va a recibir los datos que el usuario le indique -->
          <q-input
            v-model="barcodeData"
            label="Contenido del código de barras"
          />
          <!-- Botón el cual activa la función "generateBarcode"
          para generar un codigo de barra con los datos ingresados -->
          <q-btn
            label="Generar Código de Barras"
            color="primary"
            @click="generateBarcode"
            class="q-mt-lg"
          />
        </q-card-section>
        <!-- Esta sección del template muestra el resultado del código de barras
          generado y proporciona opciones para imprimir y cerrar el cuadro de diálogo. -->
        <q-card-section class="q-pt-none">
          <!-- Elemento Canvas para el código de barras -->
          <canvas ref="barcodeCanvas"></canvas>
          <!-- Elemento Q-Img para mostrar el código de barras como una imagen -->
          <q-img :src="barcodeImage" v-if="barcodeImage" class="q-mt-md" />
        </q-card-section>
        <!-- Sección de acciones del cuadro de diálogo -->
        <q-card-actions align="right">
          <!-- Botón para imprimir el código de barras, activa la función
          "printBarcode" -->
          <q-btn label="Imprimir" color="primary" @click="printBarcode" />
          <!-- Botón para cerrar el "modal", esto cambiad -->
          <q-btn label="Cerrar" @click="dialogVisible = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
// Importaciones
import { ref } from "vue";
import JsBarcode from "jsbarcode";

// Declaración de variables reactivas
const dialogVisible = ref(false); // Controla la visibilidad del cuadro de diálogo.
const barcodeData = ref(""); // Almacena los datos para generar el código de barras.
const barcodeCanvas = ref(null); // Referencia al elemento Canvas donde se dibuja el código de barras.
const barcodeImage = ref(null); // Almacena la imagen del código de barras generado.

// Función que genera el codigo de barra
const generateBarcode = () => {
  // En caso de que barcodeData tenga un valor
  if (barcodeData.value) {
    // Utiliza la biblioteca "JsBarcode" para generar
    //el código de barras en el elemento Canvas.
    JsBarcode(barcodeCanvas.value, barcodeData.value, {
      format: "CODE128", // Formato del código de barras (en este caso, CODE128).
    });
    // Convierte el contenido del elemento Canvas a una imagen y lo
    // almacena en barcodeImage.
    barcodeImage.value = barcodeCanvas.value.toDataURL();
  }
};

// Función para imprimir el código de barras
const printBarcode = () => {
  // Si barcodeImage.value tenga valor.
  if (barcodeImage.value) {
    // Abre una ventana emergente para imprimir el código de barras como una imagen.
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Código de Barras</title>
        </head>
        <body>
          <!-- Muestra la imagen del código de barras en la ventana emergente -->
          <img src="${barcodeImage.value}">
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};
</script>

<style>
.q-card {
  max-width: 400px;
  margin: 0 auto;
}
</style>
