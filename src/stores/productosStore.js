/**
 * Día de la documentación: 05/09/2023
 *
 * Descripción del archivo "productosStore.js":
 * Este archivo define un store de Pinia llamado "useProductosStore" que se encarga de administrar el estado de los productos.
 * El store maneja las listas de productos y proporciona getters y acciones para interactuar con la base de datos Firestore.
 *
 * Características clave:
 * - Manejo del estado de los productos.
 * - Definición de columnas para tablas relacionadas con productos.
 * - Acciones para escuchar cambios en la base de datos Firestore.
 *
 * @store
 */

//Importaciónes
import { defineStore } from "pinia";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "src/firebaseInit";

//Definición del store de productos.
export const useProductosStore = defineStore("productos", {
  state: () => ({
    // productosDatabase: [], // Almacena la lista de productos obtenida de Firestore.
    // devolutivosCols: [ /* ... */ ], // Columnas para la tabla de productos devolutivos.
    // devolutivosInternalCols: [ /* ... */ ], // Columnas internas para detalles de productos devolutivos.
    // columns: [ /* ... */ ], // Columnas para la tabla de productos.
    // stadisticTableBarInfo: [ /* ... */ ], // Estadísticas relacionadas con los productos.
    // columnasDetalleProducto: [ /* ... */ ], // Columnas para la tabla de detalles de producto.

    productosDatabase: [],
    devolutivosCols: [
      {
        name: "name",
        required: true,
        label: "Nombre",
        align: "left",
        field: "nombre",
      },
      {
        name: "Total",
        required: true,
        label: "Total",
        align: "left",
        field: "Total",
      },
      {
        name: "Disponibles",
        required: true,
        label: "Disponibles",
        align: "left",
        field: "Disponibles",
      },
      {
        name: "Prestados",
        required: true,
        label: "Prestados",
        align: "left",
        field: "Prestados",
      },
      {
        name: "Averiados",
        required: true,
        label: "Averiados",
        align: "left",
        field: "Averiados",
      },
    ],
    devolutivosInternalCols: [
      {
        name: "name",
        required: true,
        label: "Nombre",
        align: "left",
        field: "nombre",
      },
      {
        name: "name",
        required: true,
        label: "Estado Fisico",
        align: "left",
        field: "estadoFisico",
      },
      {
        name: "name",
        required: true,
        label: "Codigo",
        align: "left",
        field: "codigoBarra",
      },

      {
        name: "name",
        required: true,
        label: "Prestado?",
        align: "left",
        field: (row) => row.borrowedQuantity > 0,
      },
      {
        name: "name",
        required: true,
        label: "Descripción",
        align: "left",
        field: (row) => {
          let str = "";
          for (const [key, value] of Object.entries(row.custom)) {
            str += `${key}: ${value}, `;
          }
          return str.slice(0, -2);
        },
      },
      { name: "acciones", label: "Acciones", field: "acciones" },
    ],
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
        name: "unidadMedida",
        label: "Unidad de Medida",
        field: (row) => row.unidadMedida,
        sortable: true,
      },
      {
        name: "Stock Total",
        label: "Stock Total",
        field: (row) => row.stockTotal,
        sortable: true,
      },

      {
        name: "Stock-Prestamo",
        label: "Stock-Prestamo",
        field: (row) => row.borrowedQuantity,
      },
      {
        name: "stockDisponible",
        label: "Stock disponible",
        field: (row) => row.stockTotal - row.borrowedQuantity,
      },

      {
        name: "Código de barra",
        label: "Código de barra",
        field: (row) => row.codigoBarra,
      },

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
        text_color: "text-black",
        titulo: "Total productos",
        valor: "15000",
        periodo: "Ultima semana",
      },

    ],

    columnasDetalleProducto: [
      {
        name: "prestamo",
        required: true,
        label: "Día Prestamo",
        align: "left",
        field: (row) => row.diaPrestamo,
        format: (val) => new Date(val).toLocaleDateString("es-CO"),
        sortable: true,
      },
      {
        name: "prestador",
        label: "Nombre Prestador",
        field: (row) => row.customer.name,
        sortable: true,
      },
      {
        name: "prestadorId",
        label: "Id prestador",
        field: (row) => row.customer.documentNumber,
        sortable: true,
      },
      {
        name: "cantidad",
        label: "Cantidad Prestada",
        field: "cantidadPrestada",
      },
      {
        name: "diaEntrega",
        align: "center",
        label: "Día Entrega",
        field: "fechaDevolucion",
        format: (val) =>
          val
            ? new Date(val).toLocaleDateString("es-CO")
            : "No se ha entregado",
        sortable: true,
      },
      {
        name: "estadoDevolucion",
        align: "center",
        label: "EstadoDevolucion",
        field: "estadoDevuelto",
        sortable: true,
      },
      {
        name: "notas",
        align: "center",
        label: "Notas",
        field: "notasDevolucion",
        sortable: true,
      },
      { name: "acciones", label: "Acciones", field: "acciones" },
    ],
    devolutivosRows: [],
  }),
  // Getters personalizados para obtener información específica de los productos.
  getters: {
    doubleCount: (state) => state.counter * 2,
    productosNombres: (state) => {
      const productosNombreArray = state.productosDatabase.map(
        (producto) => producto.nombre
      );

      return productosNombreArray;
    },
    productosConsumibles: (state) => {
      let consumibles = state.productosDatabase.filter(
        (producto) => producto.isConsumable
      );

      return consumibles;
    },
    productosDevolutivos: (state) => {
      return state.productosDatabase.filter(
        (producto) => !producto.isConsumable
      );
    },
    nameColumnsDevolutivos() {
      return this.productosConsumibles.map((producto) => producto.nombre);
    },
    nameColumnsConsumibles() {
      return this.productosConsumibles.map((producto) => producto.nombre);
    },
    columnsDevolutivos: (state) => {
      const consumables = state.productosDatabase.filter(
        (producto) => !producto.isConsumable
      );
      let nameConsumables = consumables.map((producto) => producto.nombre);
      nameConsumables = [...new Set(nameConsumables)];
      return nameConsumables;
    },

    valoresDevolutivos: (state) => {
      return (nombre) => {
        const productos = state.productosDatabase.filter(
          (producto) => producto.nombre == nombre
        );
        const Total = productos.length;
        const Averiados = productos.filter(
          (producto) => producto.estadoFisico == "No funcional"
        ).length;

        const Prestados = productos.filter(
          (producto) => producto.borrowedQuantity > 0
        ).length;

        return {
          docId: productos[0].docId,
          nombre,
          Total,
          Disponibles: Total - Averiados - Prestados,
          Prestados,
          Averiados,
          productosList: [...productos],
        };
      };
    },

    devolutivosRows() {
      return this.columnsDevolutivos.map((nombre) => {
        const valores = this.valoresDevolutivos(nombre);
        console.log(valores.productosList);
        return valores;
      });
    },
  },
  // * Acción para escuchar cambios en la colección de productos en Firestore.
  actions: {
    getConsumableByName(productName) {
      return this.productosConsumibles.find(
        (producto) => producto.nombre == productName
      );
    },

    getConsumableByCodeBar(code) {
      return this.productosDevolutivos.find(
        (producto) => producto.codigoBarra == code
      );
    },

    objToString(obj) {
      let str = "";
      for (const [key, value] of Object.entries(obj)) {
        str += `${key}: ${value}, `;
      }
      return str.slice(0, -2);
    },
    // Crear una consulta para la colección "products" ordenada por "name".
    async listenChanges() {
      const q = query(collection(db, "products"), orderBy("name"));

      // Establecer un observador en la consulta.
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          //en caso de añadir un registro
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
              // Agregar el producto al principio de la lista.
              this.productosDatabase.unshift(data);
            } //en caso de añadir un modificar
          } else if (change.type == "modified") {
            let cambio = this.productosDatabase.find(
              (item) => item.docId == change.doc.id
            );
            let index = this.productosDatabase.findIndex(
              (item) => item.docId == change.doc.id
            ); // Actualizar los datos del producto en la lista.
            this.productosDatabase[index] = {
              ...cambio,
              ...change.doc.data(),
            }; //en caso de añadir un eliminar algun registro
          } else if (change.type == "removed") {
            // Si se elimina un producto, filtrar y actualizar la lista eliminando el producto correspondiente.
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
