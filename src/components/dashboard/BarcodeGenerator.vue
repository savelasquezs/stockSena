<template>
  <div>
    <h2 class="q-mt-">Generador de Código de Barras</h2>
    <q-input v-model="barcodeData" label="Contenido del código de barras" />
    <q-btn
      label="Generar Código de Barras"
      color="primary"
      @click="generateBarcode"
      class="q-mt-lg"
    />
  </div>
  <div class="q-pt-none">
    <canvas ref="barcodeCanvas"></canvas>
    <q-img :src="barcodeImage" v-if="barcodeImage" class="q-mt-md" />
  </div>
  <q-card-actions align="right">
    <q-btn label="Imprimir" color="primary" @click="printBarcode" />
  </q-card-actions>
</template>

<script setup>
import { ref } from "vue";
import JsBarcode from "jsbarcode";

const barcodeData = ref("");
const barcodeCanvas = ref(null);
const barcodeImage = ref(null);

const generateBarcode = () => {
  if (barcodeData.value) {
    JsBarcode(barcodeCanvas.value, barcodeData.value, {
      format: "CODE128",
    });
    barcodeImage.value = barcodeCanvas.value.toDataURL();
  }
};

const printBarcode = () => {
  if (barcodeImage.value) {
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Código de Barras</title>
        </head>
        <body>
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
