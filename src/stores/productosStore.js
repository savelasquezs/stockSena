import { defineStore } from "pinia";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "src/firebaseInit";

export const useProductosStore = defineStore("productos", {
  state: () => ({
    productosDatabase: [],
    columns: [
      {
        name: "name",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.nombre,
        format: (val) => `${val}`,
        sortable: true,
      },

      {
        name: "Consumible",
        align: "center",
        label: "Consumible",
        field: (row) => row.isConsumable,
        sortable: true,
      },
      {
        name: "Stock Total",
        label: "Stock Total",
        field: (row) => row.stockTotal,
        sortable: true,
      },

      {
        name: "Código de barra",
        label: "Código de barra",
        field: "barCode",
      },

      { name: "Stock-Prestamo", label: "Stock-Prestamo", field: "totalStock" },

      { name: "Almacen", label: "Almacen", field: "almacen" },
      { name: "acciones", label: "Acciones", field: "acciones" },
    ],
    stadisticTableBarInfo: [
      {
        text_color: "light-green-14",
        titulo: "Productos devueltos",
        valor: "5652",
        periodo: "Ultima semana",
      },
      {
        text_color: "light-green-14",
        titulo: "Productos prestados",
        valor: "300",
        periodo: "Ultima semana",
      },
      {
        text_color: "text-yellow",
        titulo: "Total productos",
        valor: "15000",
        periodo: "Ultima semana",
      },
      {
        text_color: "text-pink",
        titulo: "Diandry",
        valor: "8569522",
        periodo: "Ultima semana",
      },
    ],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
    productosNombres: (state) => {
      const productosNombreArray = state.productosDatabase.map(
        (producto) => producto.name
      );
      console.log(productosNombreArray);
      return productosNombreArray;
    },
  },
  getQuantity() {
    return (nombreProducto) => {
      const producto = this.productosDatabase.find(
        (producto) => producto.name == nombreProducto
      );
      console.log(producto);
      return producto;
    };
  },

  actions: {
    async listenChanges() {
      const q = query(collection(db, "products"), orderBy("name"));

      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type == "added") {
            if (
              !this.productosDatabase.some(
                (item) => item.docId == change.doc.id
              )
            ) {
              const data = {
                docId: change.doc.id,
                ...change.doc.data(),
              };
              this.productosDatabase.unshift(data);
            }
          } else if (change.type == "modified") {
            let cambio = this.productosDatabase.find(
              (item) => item.docId == change.doc.id
            );
            let index = this.productosDatabase.findIndex(
              (item) => item.docId == change.doc.id
            );
            this.productosDatabase[index] = {
              ...cambio,
              ...change.doc.data(),
            };
          } else if (change.type == "removed") {
            this.productosDatabase = this.productosDatabase.filter(
              (item) => item.docId != change.doc.id
            );
          }
          const source = snapshot.metadata.fromCache
            ? "local cache productos"
            : "server";
          console.log("Data came from " + source);
        });
      });
    },
  },
});
