import { defineStore } from "pinia";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "src/firebaseInit";

export const UseClientesStore = defineStore("clientes", {
  state: () => ({
    clientesDatabase: [],
    columns: [
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
    async listenChanges() {
      const q = query(collection(db, "customers"), orderBy("nombre"));

      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type == "added") {
            if (
              !this.clientesDatabase.some((item) => item.docId == change.doc.id)
            ) {
              const data = {
                docId: change.doc.id,
                ...change.doc.data(),
              };
              this.clientesDatabase.unshift(data);
            }
          } else if (change.type == "modified") {
            let cambio = this.clientesDatabase.find(
              (item) => item.docId == change.doc.id
            );
            let index = this.clientesDatabase.findIndex(
              (item) => item.docId == change.doc.id
            );
            this.clientesDatabase[index] = {
              ...cambio,
              ...change.doc.data(),
            };
          } else if (change.type == "removed") {
            this.clientesDatabase = this.clientesDatabase.filter(
              (item) => item.docId != change.doc.id
            );
          }
          const source = snapshot.metadata.fromCache
            ? "local cache clientes"
            : "server";
          console.log("Data came from " + source);
        });
      });
    },
  },
});
