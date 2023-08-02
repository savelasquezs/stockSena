<template>
  <q-page>
    <!-- Aquí tienes tu formulario con los inputs y campos necesarios -->
    <q-input v-model="Nombre" label="Nombre" />
    <q-input v-model="APellido" label="Email" />

    <q-btn @click="enviarFormulario" label="Enviar" />
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      nombre: "",
      email: "",
    };
  },
  methods: {
    enviarFormulario() {
      // Aquí podrías realizar alguna validación adicional antes de enviar los datos.
      // Por ejemplo, asegurarte de que los campos estén llenos correctamente.

      // Enviar los datos a la otra pantalla usando enrutamiento.
      this.$router.push({
        name: "mostrar-datos",
        params: {
          nombre: this.nombre,
          email: this.email,
        },
      });
    },
  },
};
</script>
