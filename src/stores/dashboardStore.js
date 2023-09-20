import { defineStore } from "pinia";
import { UsePrestamosStore } from "./prestamosStore";
import { useProductosStore } from "./productosStore";
import { UseClientesStore } from "./clientesStore";

const prestamosStore = UsePrestamosStore();
const producstosStore = useProductosStore();
const clientesStore = UseClientesStore();

export const UseDashboardStore = defineStore("dashboard", {
  state: () => ({}),
  getters: {
    prestamosQuantity: (state) => prestamosStore.prestamosDatabase.length,
    productosAgotados: (state) =>
      producstosStore.productosDatabase.filter(
        (producto) => producto.stockTotal == 0
      ).length,
    cantidadInstructores: (state) =>
      clientesStore.clientesDatabase.filter(
        (cliente) => cliente.rol == "Instructor"
      ).length,
  },
});
