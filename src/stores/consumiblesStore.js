import { defineStore } from "pinia";

export const useConsumiblesStore = defineStore("consumibles", {
  state: () => ({
    consumiblesDatabase: [],
  }),
  getters: {
    onlyNames: (state) => {
      return state.consumiblesDatabase.map((consumible) => consumible.nombre);
    },
  },
});
