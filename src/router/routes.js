const routes = [
  {
    path: "/",
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
        component: () => import("pages/PrestamosRegistro.vue"),
      },
      {
        path: '/detalles',
        name: 'detalles',
        omponent: () => import("pages/DetallesRegistros.vue"),
        props: true, // Permite pasar los parámetros como props
      },
    ],
  },
  {
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
