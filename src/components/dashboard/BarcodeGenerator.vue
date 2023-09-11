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
  <div class="q-pa-md"></div>

  <q-card-section>
    <h2 class="q-mt-md">Generador de Código de Barras</h2>
    <q-input v-model="barcodeData" label="Contenido del código de barras" />
    <q-btn
      label="Generar Código de Barras"
      color="primary"
      @click="generateBarcode"
      class="q-mt-lg"
    />
  </q-card-section>
  <q-card-section class="q-pt-none">
    <canvas ref="barcodeCanvas"></canvas>
    <q-img :src="barcodeImage" v-if="barcodeImage" class="q-mt-md" />
  </q-card-section>
  <q-card-actions align="right">
    <q-btn label="Imprimir" color="primary" @click="printBarcode" />
  </q-card-actions>
</template>

<script setup>
// Importaciones
import { ref } from "vue";
import JsBarcode from "jsbarcode";

const dialogVisible = ref(false);
const barcodeData = ref("");
const barcodeCanvas = ref(null);
const barcodeImage = ref(null);

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
