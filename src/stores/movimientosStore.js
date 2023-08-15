import { defineStore } from "pinia";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "src/firebaseInit";

export const UseMovimientosStore = defineStore("movimientos", {
  state: () => ({
    movimientosDatabase: [],
    columns: [
      {
        name: "TipoMovimiento",
        align: "center",
        label: "Tipo de movimiento",
        field: (row) => row.movimiento,
        sortable: true,
      },

      {
        name: "date",
        label: "Fecha Movimiento",
        field: (row) => row.fecha,
        format: (val) => new Date(val).toLocaleDateString(),
      },
      {
        name: "proveedor",
        label: "Proveedor",
        field: (row) => row.proveedor,
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
      const q = query(collection(db, "stockMovements"), orderBy("fecha"));

      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type == "added") {
            if (
              !this.movimientosDatabase.some(
                (item) => item.docId == change.doc.id
              )
            ) {
              const data = {
                docId: change.doc.id,
                ...change.doc.data(),
              };
              this.movimientosDatabase.unshift(data);
            }
          } else if (change.type == "modified") {
            let cambio = this.movimientosDatabase.find(
              (item) => item.docId == change.doc.id
            );
            let index = this.movimientosDatabase.findIndex(
              (item) => item.docId == change.doc.id
            );
            this.movimientosDatabase[index] = {
              ...cambio,
              ...change.doc.data(),
            };
          } else if (change.type == "removed") {
            this.movimientosDatabase = this.movimientosDatabase.filter(
              (item) => item.docId != change.doc.id
            );
          }
        });
      });
    },
  },
});
