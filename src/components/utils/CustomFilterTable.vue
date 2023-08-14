<template>
  <div>
    <q-input v-model="nameFilter" label="Name" />
    <q-date
      v-model="dateFilter"
      range
      mask="YYYY-MM-DD"
      :calendar="calendar"
      @input="updateDateFilter"
    >
    </q-date>
    <q-select v-model="statusFilter" :options="statuses" label="Status" />
    <q-table :rows="data" :filter-method="customFilterMethod" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const data = [
  { name: "John", date: "2023-08-01", status: "Active" },
  { name: "Jane", date: "2023-08-02", status: "Inactive" },
  { name: "Bob", date: "2023-08-03", status: "Active" },
  { name: "Alice", date: "2023-08-04", status: "Inactive" },
];
const columns = ["name", "date", "status"];
const statuses = ["Active", "Inactive"];
const nameFilter = ref("");
const dateFilter = ref([]);
const dateFilterDisplay = ref("");
const statusFilter = ref("");
const calendar = ref("gregorian");

const updateDateFilter = (value) => {
  dateFilter.value = value.split(" - ");
};

const updateDateFilterDisplay = (value) => {
  dateFilterDisplay.value = value;
};

const customFilterMethod = (rows) => {
  return rows.filter((row) => {
    const nameMatch =
      !nameFilter.value ||
      row.name.toLowerCase().includes(nameFilter.value.toLowerCase());
    const dateMatch =
      !dateFilter.value.length ||
      (row.date >= dateFilter.value[0] && row.date <= dateFilter.value[1]);
    const statusMatch =
      !statusFilter.value ||
      row.status.toLowerCase() === statusFilter.value.toLowerCase();
    return nameMatch && dateMatch && statusMatch;
  });
};
</script>
