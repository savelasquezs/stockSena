<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab
            v-for="tab in tabs"
            :key="tab.name"
            :name="tab.name"
            :label="tab.label"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel v-for="tab in tabs" :key="tab.name" :name="tab.name">
            <div class="text-h6">{{ tab.label }}</div>
            <slot :name="tab.name" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const tab = ref(props.tabs[0].name);
const props = defineProps({ tabs: Array });
</script>
