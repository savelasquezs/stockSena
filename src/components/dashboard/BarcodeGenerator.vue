<template>
  <q-page>
    <div class="q-pa-md">
      <h1>Generador e Impresor de Códigos de Barras</h1>
      <q-btn label="Abrir Generador" @click="dialogVisible = true" />
    </div>
    <q-dialog v-model="dialogVisible" persistent>
      <q-card>
        <q-card-section>
          <h2 class="q-mt-md">Generador de Código de Barras</h2>
          <q-input
            v-model="barcodeData"
            label="Contenido del código de barras"
          />
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
          <q-btn label="Cerrar" @click="dialogVisible = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import JsBarcode from "jsbarcode";

const dialogVisible = ref(false);
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
