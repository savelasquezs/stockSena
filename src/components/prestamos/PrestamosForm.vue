<template>
  <q-page class="flex justify-evenly content-center">
    <div class="q-gutter-md">
      <h6>Registro de prestamos</h6>
      <q-select
        outlined
        v-model="selectedDocumentType"
        :options="documentTypes"
        label="Tipo de documento"
        :rules="[val]"
      />
      <q-input
        outlined
        v-model="documentNumber"
        label="Número de documento"
        :rules="[numberRule]"
      />
      <q-btn
        @click="buscarDocumento"
        color="positive"
        label="Buscar"
        class="q-mt-md"
      />
    </div>
    <div>
      <q-item>
        <q-item-section top avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Nombre de la persona</q-item-label>
          <q-item-label caption>Cédula</q-item-label>
        </q-item-section>
      </q-item>
      <AutocompleteInput :stringOptions="opciones" />
      <q-input
        v-model.number="model"
        type="number"
        filled
        style="max-width: 200px"
      />
    </div>
  </q-page>
</template>

<script>
import AutocompleteInput from "../utils/autocompleteInput.vue";
export default {
  data() {
    return {
      selectedDocumentType: null,
      documentNumber: "",
      opciones: ["Computador", "HDMI", "Cargador"],
    };
  },
  computed: {
    documentTypes() {
      return ["C.C", "T.I ", "C.E", "P.P"];
    },
    numberRule() {
      return (val) => {
        // Validar que el campo contenga solo caracteres numéricos
        if (/^\d+$/.test(val)) {
          return true;
        }
        return "Este campo solo acepta caracteres numéricos.";
      };
    },
  },
  methods: {
    buscarDocumento() {
      // Aquí puedes realizar la acción de búsqueda utilizando los datos seleccionados en el formulario.
      // Por ejemplo, puedes mostrar una alerta con los datos ingresados para demostración:
      alert(
        `Tipo de documento: ${this.selectedDocumentType}\nNúmero de documento: ${this.documentNumber}`
      );
    },
  },
  components: { AutocompleteInput },
};
</script>

<!--
  - Crear la tabla que depués de darle al botón buscar aparesca los datos del usuario.
  - Averiguar en Quasar como hacer una validación.
  - Other...
-->
