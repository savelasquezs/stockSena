<template>
  <q-item>
    <q-item-section avatar top>
      <q-avatar :icon="icon" :color="avatarColor" :text-color="iconColor" />
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ name }}</q-item-label>
      <q-item-label caption
        >Solo quedan {{ remainingQuantity }} unidad{{
          remainingQuantity > 1 ? "es" : ""
        }}</q-item-label
      >
    </q-item-section>

    <q-item-section side>
      <q-badge color="red">
        {{ remainingQuantity }}
        <q-icon name="warning" color="white" class="q-ml-xs" />
      </q-badge>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  icon: String,
  avatarColor: String,
  iconColor: String,
  name: String,
  remainingQuantity: String,
});
</script>

<style lang="scss" scoped></style>
