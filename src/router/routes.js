// Día de la documentación: 30/08/2023
// Descripción del archivo "autocompleteinput.vue":

// Este archivo define las rutas de la aplicación web,
// especificando las páginas que se mostrarán cuando se acceda a cada ruta.
// Se utiliza en conjunto con el enrutador de Vue Router para navegar entre
// las diferentes secciones de la aplicación.

// routes es una matriz que contiene objetos de ruta.
// Cada objeto representa una ruta en la aplicación y contiene información
// sobre cómo se debe manejar esa ruta.
// Cada objeto de ruta tiene las siguientes propiedades clave:

//  -path: La URL relativa a la ruta. Por ejemplo, "/"
//    se refiere a la página de inicio.
//  -meta: Metadatos asociados a la ruta. Aquí, se usa para indicar si la
//    ruta requiere autenticación (requiresAuth: true).
//  -component: Una función que importa el componente de Vue que se renderizará
//  cuando se acceda a esta ruta.
//  -children: Un arreglo que puede contener rutas secundarias
//    anidadas bajo esta ruta principal.

// Matriz que contiene las rutas
const routes = [
  {
    // Ruta principal con autenticación requerida
    path: "/",
    meta: {
      // Requerimiento de usuario autenticación  por firebase
      requiresAuth: true,
    },
    // Plantilla (layout) del cual los hijos heredarán sus caracteristicas "layouts/MainLayout.vue"
    component: () => import("layouts/MainLayout.vue"),
    // children pages, estos heredarán las caracteristicas del layout
    children: [
      { path: "", component: () => import("pages/DashboardPage.vue") },
      { path: "/index", component: () => import("pages/IndexPage.vue") },
      {
        path: "/clientes",
        component: () => import("pages/ClientesPage.vue"),
      },
      {
        path: "/clientes/:id",
        component: () => import("pages/ClienteDetalles.vue"),
      },
      {
        path: "/datosClientes",
        component: () => import("src/components/clientes/TablaActivos.vue"),
      },
      {
        path: "/prestamos",
        component: () => import("src/pages/PrestamosPage.vue"),
      },
      {
        path: "/detallesProductos",
        component: () => import("src/pages/detallesPage.vue"),
      },
      {
        path: "/productos",

        component: () => import("src/pages/ProductosPage.vue"),
        props: true, // Permite pasar los parámetros como props
      },
      {
        path: "/productos/:id",
        component: () => import("src/pages/detallesPage.vue"),
        props: true, // Permite pasar los parámetros como props
      },
      {
        path: "/Dashboard",
        component: () => import("pages/DashboardPage.vue"),
      },
      {
        path: "/movimientos",
        component: () => import("pages/MovimientosProductos.vue"),
      },
      {
        path: "/cuentas",
        component: () => import("pages/CuentasManejo.vue"),
      },

      {
        path: "/register",
        component: () => import("pages/RegisterPage.vue"),
      },
    ],
  },
  {
    // Rutas relacionadas con la cuenta de usuario
    path: "/account",
    component: () => import("layouts/AccountLayout.vue"),
    children: [
      {
        path: "/login",
        component: () => import("pages/LoginPage.vue"),
      },
      {
        path: "/recover",
        component: () => import("pages/RecoverPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
