/**
 * Día de la documentación: 05/09/2023
 *
 * Descripción del archivo "consumibleStore.js":
 * Este store maneja el estado relacionado con los consumibles. Proporciona acceso
 * a la lista de consumibles y una función getter para obtener solo los nombres de los consumibles.
 *
 * Características clave:
 * - Almacena una lista de consumibles en el estado.
 * - Proporciona una función getter llamada "onlyNames" para obtener solo los nombres de los consumibles.
 */
import { defineStore } from "pinia";

export const useConsumiblesStore = defineStore("consumibles", {
  state: () => ({
    consumiblesDatabase: [],// Almacena la lista de consumibles obtenida desde la base de datos
  }),
  getters: {
    //Obtiene una lista de nombres de consumibles a partir de la lista de consumibles en el estado.
    //Una lista de nombres de consumibles.
    onlyNames: (state) => {
      return state.consumiblesDatabase.map((consumible) => consumible.nombre);
    },
  },
});
