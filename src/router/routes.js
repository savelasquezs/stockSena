const routes = [
  {
    path: "/",
    meta: {
      requiresAuth: true,
    },

    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/DashboardPage.vue") },
      { path: "/index", component: () => import("pages/IndexPage.vue") },
      {
        path: "/clientes",
        component: () => import("pages/ClientesPage.vue"),
      },
      {
        path: "/clientes/:id",
        component: () => import("pages/ClientesDatos.vue"),
      },
      {
        path: "/datosClientes",
        component: () => import("pages/ClientesDatos.vue"),
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
        path: "/experimento",
        component: () => import("pages/experimentalPage.vue"),
      },
      {
        path: "/register",
        component: () => import("pages/RegisterPage.vue"),
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
