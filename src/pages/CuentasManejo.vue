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
            style="width: 110px"
          />
        </router-link>
        <q-btn label="Permisos" color="green-14" @click="prompt = true" />
      </div>
    </q-page>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6"></div>
        </q-card-section>

        <q-card-section class="q-pt-none"
          >Ingresa el correo
          <q-input
            dense
            v-model="address"
            autofocus
            @keyup.enter="prompt = false"
          />
          <q-input dense v-model="agregar" />
          <q-select outlined label="Rol" v-model="Rol" :options="options_Rol" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Aceptar" color="positive" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <div class="flex justify-evenly content-center complete items-center">
    <q-list bordered class="rounded-borders">
      <q-expansion-item>
        <template v-slot:header="{ expanded }">
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            Datos {{ expanded ? "Mostrados" : "Cerrados" }}
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div v-if="userCredential">
                <h4>Usuario Activo</h4>
                <p>Nombre: {{ userCredential.displayName }}</p>
                <p>Correo electrónico: {{ userCredential.email }}</p>
              </div>
              <div v-else>
                <h2>Usuario Activo</h2>
                <p>Ningún usuario autenticado</p>
            </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>



</template>

<script>
import { ref, onMounted } from "vue";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default {
  setup() {
    return {
      prompt: ref(false),
      agregar: ref(""),
    };
  },
  data() {
    return {
      Rol: null,
      options_Rol: ["Administrador", "Invitado"],

    };
  },

  setup() {
    return {
      expanded: ref(false),
    };
  },

  setup()
  {
    const prompt = ref(false);
    const agregar = ref("");
    const expanded = ref(false);
    const userCredential = ref(null);
    const users = ref([]);
    const auth = getAuth();
    const db = getFirestore();

    onMounted(async () => {
      await imprimirUsuarioActivo();
    });

    async function imprimirUsuarioActivo() {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;

        try {
          const userDoc = await getDoc(doc(db, "users", uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            userCredential.value = userData;
          } else {
            console.log("Documento de usuario no encontrado en Firestore");
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      } else {
        console.log("Ningún usuario autenticado");
      }
    }

    return {
      prompt,
      agregar,
      expanded,
      userCredential,
      users,
    };
  },
}

</script>

<style scoped>
.complete {
  max-height: 35vh;
}
</style>
