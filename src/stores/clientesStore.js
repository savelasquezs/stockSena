/**Día de la documentación: 05/09/2023 Descripción del archivo "clientStore.js"

Este store maneja el estado relacionado con los clientes y proporciona acciones
para interactuar con la base de datos Firestore para agregar, modificar y eliminar clientes.
También se encarga de escuchar cambios en la base de datos y actualizar el estado en consecuencia.
Características clave:
- El estado incluye una lista de clientes y columnas para tablas.
- Proporciona acciones para escuchar cambios en la base de datos Firestore.
- Maneja la sincronización de datos entre la base de datos y el estado local.

  */

//Importaciónes
import { defineStore } from "pinia";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "src/firebaseInit";

//Definición del store
export const UseClientesStore = defineStore("clientes", {
  state: () => ({
    clientesDatabase: [],//Almacena la lista de clientes obtenida de Firestore.
    columns: [
      // Definición de columnas para tablas relacionadas con clientes.
      // Cada objeto en "columns" define una columna en una tabla con sus propiedades.

      /** esto es un ejemplo columna ={
       * name:nombre de la columana
       * align:alineamiento
       * label:label
       * field:campo
       * sortable:y el orden
       * }
       * Estos campos son los que se le pasan a la columna, y varian segun
       * las columnas y como se definan*/
      {
        name: "TipoDoc",
        align: "center",
        label: "Tipo de Documento",
        field: (row) => row.tipoDoc,
        sortable: true,
      },

      {
        name: "doc",
        label: "Numero Documento",
        field: (row) => row.numero_id,
      },
      {
        name: "nombre",
        label: "Nombre",
        field: (row) => row.nombre,
      },
      {
        name: "apellido",
        label: "Apellido",
        field: (row) => row.apellido,
      },
      {
        name: "area",
        label: "Area",
        field: (row) => row.area,
      },
      {
        name: "rol",
        label: "Rol",
        field: (row) => row.rol,
      },
      { name: "acciones", label: "Acciones", field: "acciones" },
    ],
    columnsPrestamosPersona: [
      {
        name: "caritas",
        label: "Estado",
        field: "caritas",
      },
      {
        name: "producto",
        label: "Producto",
        field: (row) => row.product,
      },

      {
        name: "cantidad",
        label: "Cantidad prestada",
        field: (row) => row.quantity,
      },
      {
        name: "cantidadDevuelta",
        label: "Cantidad devuelta",
        field: (row) => row.returnedQuantity,
      },
      {
        name: "descripcion",
        label: "Descripción",
        field: (row) => {
          if (row.isConsumable) {
            return "producto consumible";
          }
          let str = "";
          for (const [key, value] of Object.entries(row.custom)) {
            str += `${key}: ${value}, `;
          }
          return str.slice(0, -2);
        },
      },
      {
        name: "estadoPrestamo",
        label: "Estado al prestar",
        field: (row) => row.estadoEntrega,
      },
      {
        name: "estadoEntregado",
        label: "Estado Devuelto",
        field: (row) => row.estadoDevuelto,
      },

      {
        name: "fechaPrestamo",
        label: "Fecha Prestamo",
        field: (row) => row.dateBorrowed,
        format: (val) => new Date(val).toLocaleDateString("es-CO"),
      },
      {
        name: "fechaDevuelto",
        label: "Fecha devuelto",
        field: (row) => row.fechaDevolucion,
        format: (val) => new Date(val).toLocaleDateString("es-CO"),
      },
      {
        name: "prestamoId",
        align: "center",
        label: "Id prestamo",
        field: (row) => row.prestamoId,
        sortable: true,
      },
      {
        name: "productoId",
        label: "ProductoId",
        field: (row) => row.productId,
      },
      { name: "acciones", label: "Acciones", field: "acciones" },
    ],
    stadistics: [
      {
        text_color: "text-light-green-14",
        titulo: "Total ingresos",
        valor: "210",
        periodo: "Ultima semana",
      },
      {
        text_color: "text-teal-6",
        titulo: "Total Salidas",
        valor: "210",
        periodo: "Ultima semana",
      },
      {
        text_color: "text-deep-orange-6",
        titulo: "Proveedor Estrella",
        valor: "Juan la roca",
        periodo: "Ultima semana",
      },
    ],
  }),
  getters: {},

  actions: {
    // listenChanges / Acción para escuchar cambios en la colección de clientes
    async listenChanges() {
      // Crear una consulta para la colección "customers" ordenada por "nombre"
      const q = query(collection(db, "customers"), orderBy("nombre"));
      // Establecer un observador en la consulta
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        // Iterar a través de los cambios en los documentos
        snapshot.docChanges().forEach((change) => {
          // Si se agrega un cliente nuevo
          if (change.type == "added") {
            // Crear un objeto de datos con el ID del documento y sus datos
            if (
              !this.clientesDatabase.some((item) => item.docId == change.doc.id)
            ) {
              const data = {
                docId: change.doc.id,
                ...change.doc.data(),
              };
              // Agregar el cliente al principio de la lista
              this.clientesDatabase.unshift(data);
            }
            // Si un cliente existente se modifica
          } else if (change.type == "modified") {
            let cambio = this.clientesDatabase.find(
              (item) => item.docId == change.doc.id
            );
            let index = this.clientesDatabase.findIndex(
              (item) => item.docId == change.doc.id
            );
            // Actualizar los datos del cliente en la lista
            this.clientesDatabase[index] = {
              ...cambio,
              ...change.doc.data(),
            };
          } else if (change.type == "removed") {
            // Si se elimina un cliente
            // Filtrar y actualizar la lista eliminando el cliente correspondiente
            this.clientesDatabase = this.clientesDatabase.filter(
              (item) => item.docId != change.doc.id
            );
          }
           // Determinar la fuente de los datos (caché local o servidor)
          const source = snapshot.metadata.fromCache
            ? "local cache clientes"
            : "server";
          // Registrar la fuente de los datos en la consola
          console.log("Data came from " + source);
        });
      });
    },
  },
});
