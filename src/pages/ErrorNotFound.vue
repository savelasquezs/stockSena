<!-- Fecha documentación 5/09/2023 -->
<!-- En dado caso de entrar a una pagina con un enlace no disponible se arrojara
una alerta de error 404 -->
<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">69</div>

      <div class="text-h2" style="opacity: 0.4">EINER</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
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
