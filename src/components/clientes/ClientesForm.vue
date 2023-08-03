<template>
  <div class="flex justify-evenly content-center complete items-center">
    <div>
      <q-img
        src="https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png"
        loading="lazy"
        spinner-color="white"
        width="300px"
        class=""
      />
    </div>
    <q-page class="flex content-center">
      <div class="q-gutter-md q-mx-lg">
        <q-select
          outlined
          label="Tipo documento"
          v-model="Tipo_documento"
          :options="options_Tipo_documento"
          transition-show="flip-up"
          transition-hide="flip-up"
          style="width: 250px"
        />

        <q-input
          outlined
          label="Numero documento"
          :rules="[(val) => val > 0 || 'Por favor ingrese documento valido']"
          v-model="Numero_documento"
        />

        <q-input
          outlined
          label="Nombre"
          v-model="Nombre"
          :rules="[
            (val) => val.length > 2 || 'Por favor ingrese nombre valido',
            [],
          ]"
        />
      </div>
      <div class="q-gutter-md">
        <q-input
          outlined
          label="Apellido"
          v-model="Apellido"
          :rules="[
            (val) => val.length > 2 || 'Por favor ingrese nombre valido',
          ]"
        />

        <q-select outlined label="Rol" v-model="Rol" :options="options_Rol" />

        <q-select
          outlined
          label="Area"
          v-model="Area"
          :options="options_Area"
        />

        <q-btn
          type="submit"
          label="Iniciar sesión"
          color="green-14"
          style="high: 7750px"
        />

        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-page>
  </div>
</template>

<script>
import AutocompleteInput from "components/utils/autocompleteInput.vue";
import autocompleteinput from "components/utils/autocompleteInput.vue";
export default {
  data() {
    return {
      Tipo_documento: null,
      options_Tipo_documento: [
        "Cedula de ciudadania",
        "Tarjeta de indentidad",
        "Pasaporte",
      ],
      Numero_documento: "",
      Nombre: "",
      Apellido: "",
      Rol: null,
      options_Rol: ["Instructor", "aprendiz"],
      Area: null,
      options_Area: [
        "Tics",
        "Manufactura",
        "Electricidad",
        "Automotriz",
        "Automatizacion",
      ],
    };
  },
  methods: {
    handleSubmit() {
      // Aquí puedes agregar la lógica para enviar los datos del formulario al servidor
      // Por ejemplo, puede usar Axios para realizar una solicitud POST al servidor.
      // Luego, puede manejar la respuesta según sea necesario.
      console.log("Tipo_documento:", this.Tipo_documento);
      console.log("Numero documento:", this.Numero_documento);
      console.log("Nombre:", this.Nombre);
      console.log("Apellido:", this.Apellido);
      console.log("Rol:", this.Rol);
      console.log("Area:", this.Area);
    },
  },
  components: { AutocompleteInput },
};
</script>

<style scoped>
.complete {
  max-height: 100vh;
}
</style>
