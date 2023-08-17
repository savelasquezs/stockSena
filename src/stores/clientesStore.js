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
    ],
    internalColumns: [
      {
        name: "docId",
        align: "center",
        label: "Id",
        field: (row) => row.docId,
        sortable: true,
      },
      {
        name: "nombre",
        align: "center",
        label: "Nombre elemento",
        field: (row) => row.nombre,
        sortable: true,
      },
      {
        name: "cantidad",
        align: "center",
        label: "Cantidad Ingresada",
        field: (row) => row.cantidad,
        sortable: true,
      },
      {
        name: "stockAnterior",
        align: "center",
        label: "Stock Anterior",
        field: (row) => row.stockAnterior,
        sortable: true,
      },
      {
        name: "nuevoStock",
        align: "center",
        label: "Nuevo Stock",
        field: (row) => row.nuevoStock,
        sortable: true,
      },
      {
        name: "notas",
        align: "center",
        label: "Descripción",
        field: (row) => row.notas,
        sortable: true,
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
