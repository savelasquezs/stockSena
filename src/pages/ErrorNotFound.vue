<template>
  <div
    class="fullscreen bg-white text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <q-img
        src="https://image.freepik.com/icone-gratis/faccia-triste-in-quadrato-arrotondato_318-58503.jpg"
        width="250px"
      />

      <div class="text-h2" style="opacity: 0.4; color: #000; margin-top: 40px">
        Lo siento, la página que estás buscando no se puede encontrar.
      </div>
      <q-btn
        class="q-mt-xl"
        style="margin-top: 60px"
        color="black"
        text-color="white"
        unelevated
        to="/"
        label="Regresar a inicio"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
});
</script>
