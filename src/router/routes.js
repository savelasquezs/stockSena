const routes = [
  {
    path: "/",
    meta: {
      requiresAuth: true,
    },

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/clientes",
        component: () => import("pages/ClientesRegistro.vue"),
      },
      {
        path: "/opciones",
        component: () => import("pages/ClientesOpciones.vue"),
      },
      {
        path: "/productos",
        component: () => import("pages/ProductosRegistro.vue"),
      },
      {
        path: "/prestamos",
        component: () => import("src/pages/PrestamosPage.vue"),
      },
      {
        path: "/tablaProductos",
        name: "tablaProductos",
        component: () => import("src/pages/TablaRegistros.vue"),
        props: true, // Permite pasar los parámetros como props
      },
      {
        path: "/Dashboard",
        component: () => import("pages/PageDashboard.vue"),
      },
      {
        path: "/cuentas",
        component: () => import("pages/CuentasManejo.vue"),
      },
    ],
  },
  {
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
      {
        path: "/register",
        component: () => import("pages/RegisterPage.vue"),
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
