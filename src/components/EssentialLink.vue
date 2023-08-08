<template>
  <q-item clickable :to="to" class="coloreble">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" color="accent" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
    },
    iconColor: {
      type: String,
      default: "sena1",
    },
    to: {
      type: String,
      default: "/",
    },
  },
});
</script>
