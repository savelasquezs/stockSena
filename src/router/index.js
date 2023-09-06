// <!-- Fecha documentación 4/09/23 -->
// Este código configura Vue Router en un proyecto Quasar y define un middleware global para gestionar
// la autenticación y la navegación del usuario. Además, se adapta el tipo de historial del enrutador en función del
//  entorno en el que se ejecute la aplicación.
//  En esta sección, se importan las dependencias necesarias, incluyendo route de "quasar/wrappers",
//  varias funciones para crear historiales de enrutador (createMemoryHistory, createWebHistory, createWebHashHistory) 
//  de "vue-router", las rutas definidas en otro archivo llamado "routes", y la variable auth de "src/firebaseInit".
import { route } from "quasar/wrappers";                                                                                
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { auth } from "src/firebaseInit";

/*
 * Si no se está construyendo en modo SSR (renderizado del lado del servidor), puedes
 * exportar directamente la instancia del enrutador;
 *
 * La función a continuación también puede ser asíncrona; puedes usar
 * async/await o devolver una Promesa que resuelve con la instancia del enrutador.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

  // Deja esto tal como está y realiza cambios en quasar.conf.js en su lugar.
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath


    history: createHistory(process.env.VUE_ROUTER_BASE),
  });
  // Aquí se define un middleware global que se ejecuta antes de cada navegación.
  Router.beforeEach((to, from, next) => {
    if (to.matched.some((ruta) => ruta.meta.requiresAuth)) {
      const user = localStorage.getItem("user");
      console.log(to, from);
      console.log(user);
      if (user && user !== "") {
        next();
        return;
      } else {
        next("/login");
        return;
      }
    }
    // Comprueba si la ruta que se está visitando es la página de inicio de sesión (/login) 
    // y si ya hay un usuario autenticado (según auth.currentUser). Si es así, redirige al usuario de nuevo a la 
    // página desde la que vino (from.path).
    if (to.path == "/login" && auth.currentUser) {
      next(from.path);
      return;
    }
    // En otros casos, permite la navegación normalmente llamando a next().

    next();
  });

  return Router;
});
