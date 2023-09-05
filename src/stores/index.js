/**
 * Día de la documentación: 05/09/2023
 *
 * Descripción del archivo "index.js":
 * Este archivo crea y configura una instancia de Pinia para administrar el estado de la aplicación.
 * Pinia es un sistema de gestión de estado basado en Vue 3 que permite la creación de almacenes de estado.
 *
 * Características clave:
 * - Configura una instancia de Pinia.
 * - Puedes agregar plugins de Pinia para funcionalidades adicionales si es necesario.
 */
import { store } from "quasar/wrappers";
import { createPinia } from "pinia";

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */


/**
 * Crea y configura una instancia de Pinia para administrar el estado de la aplicación.
 * @returns {object} - Instancia de Pinia configurada.
 */
export default store((/* { ssrContext } */) => {
  //instancia de pinia
  const pinia = createPinia();

  // Puedes agregar plugins de Pinia aquí si es necesario.
  // Ejemplo: pinia.use(SomePiniaPlugin)

  // Devolver la instancia de Pinia configurada.

  return pinia;
});
