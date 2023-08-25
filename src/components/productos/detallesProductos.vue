<template>
  <div class="text-h6 text-center q-my-xl">DETALLE DEL PRODUCTO</div>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <img
        src="https://th.bing.com/th/id/OIP.zMfBU8NhLjEo-AfjfOB8awHaHa?pid=ImgDet&rs=1"
      />

      <q-card-section>
        <div class="text-h6">PORTATIL DELL</div>
        <div class="text-subtitle5">Color: Gris</div>
        <div class="text-subtitle4">Procesador: Core ¡5</div>
        <div class="text-subtitle2">Ram: 8GB</div>
        <div class="text-subtitle3">Disco Duro: 500GB</div>
        <div class="text-subtitle6">Codigo Barra: D16234LL</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ lorem }}
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  setup() {
    return {
      lorem: "",
    };
  },
};
</script>
