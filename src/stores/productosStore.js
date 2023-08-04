import { defineStore } from 'pinia';

export const useproductosStore = defineStore('productos', {
  state: () => ({
    productosDatabase: []
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});
