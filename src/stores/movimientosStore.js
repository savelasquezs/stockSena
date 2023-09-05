/**
 * Día de la documentación: 05/09/2023
 *
 * Descripción del archivo "movimientoStore.js":
 * Este archivo define un store de Pinia llamado "UseMovimientosStore" para gestionar el estado de los movimientos.
 * El store se encarga de obtener y mantener una lista de movimientos desde Firestore, además de definir las columnas
 * necesarias para tablas relacionadas con movimientos.
 * También proporciona una acción para escuchar cambios en la base de datos Firestore y actualizar el estado en consecuencia.
 *
 * Características clave:
 * - Manejo del estado de los movimientos.
 * - Definición de columnas para tablas relacionadas con movimientos.
 * - Acción para escuchar cambios en la base de datos Firestore.
 *
 *
 */

//Importaciónes
import { defineStore } from "pinia";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "src/firebaseInit";

// Definición del store de movimientos.
export const UseMovimientosStore = defineStore("movimientos", {
  state: () => ({
    movimientosDatabase: [],// Almacena la lista de movimientos obtenida de Firestore.
    columns: [
       /** Definición de columnas para tablas relacionadas con movimientos.
        Estos campos son los que se le pasan a la columna, y varian segun
        las columnas y como se definan
        ejemplo:{
       * name:nombre de la columana
       * align:alineamiento
       * label:label
       * field:campo
       * sortable:y el orden
       * }
        */
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

    // Acción para escuchar cambios en la colección de movimientos en Firestore.

    async listenChanges() {
      // Crear una consulta para la colección "stockMovements" ordenada por "fecha".
      const q = query(collection(db, "stockMovements"), orderBy("fecha"));
      // Establecer un observador en la consulta.
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
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
               // Agregar el movimiento al principio de la lista.
              this.movimientosDatabase.unshift(data);
            }
          } else if (change.type == "modified") {
            let cambio = this.movimientosDatabase.find(
              (item) => item.docId == change.doc.id
            );
            let index = this.movimientosDatabase.findIndex(
              (item) => item.docId == change.doc.id
            );
             // Actualizar los datos del movimiento en la lista.
            this.movimientosDatabase[index] = {
              ...cambio,
              ...change.doc.data(),
            };
          } else if (change.type == "removed") {
             // Si se elimina un movimiento, filtrar y actualizar la lista eliminando el movimiento correspondiente.
            this.movimientosDatabase = this.movimientosDatabase.filter(
              (item) => item.docId != change.doc.id
            );
          }
          const source = snapshot.metadata.fromCache
            ? "local cache movimientos"
            : "server";
          console.log("Data came from " + source);
        });
      });
    },
  },
});
