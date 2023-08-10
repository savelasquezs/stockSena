<template>
  <div class="flex justify-evenly content-center complete items-center">
    <q-page class="flex content-center window-height">
      <div class="q-gutter-lg row justify-center items-center">

        <router-link to="/register">
          <q-btn
          label="Registrar"
            type="submit"
            color="green-14"
            class="q-ml-sm"
            style="width: 110px;"
            />
          </router-link>
          <q-btn  label="Permisos" color="green-14" @click="prompt = true" />

        </div>
      </q-page>
      </div>

    <div class="q-pa-md q-gutter-sm">



      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6"></div>
          </q-card-section>

          <q-card-section class="q-pt-none">Ingresa el correo 
            <q-input dense v-model="address" autofocus @keyup.enter="prompt = false" />
            <q-input dense v-model="agregar"   />
            <q-select outlined label="Rol" v-model="Rol" :options="options_Rol" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar"  color="negative" v-close-popup />
          <q-btn flat label="Aceptar" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>



</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      prompt: ref(false),
      agregar: ref('')
    };
  },
  data() {
  return {
    Rol: null,
    options_Rol: ["Administrador", "Invitado"],
  };
},

}





</script>
<style scoped>
.complete {
  max-height: 100vh;
}
</style>
