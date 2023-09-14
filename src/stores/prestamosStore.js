/**
 * Día de la documentación: 05/09/2023
 *
 * Descripción del archivo "prestamosStore.js":
 * Este archivo define un store de Pinia llamado "UsePrestamosStore" que se utiliza para gestionar el estado relacionado con los préstamos.
 * El store almacena y gestiona los préstamos obtenidos desde Firestore y define columnas necesarias para tablas relacionadas con préstamos.
 * También proporciona acciones para escuchar cambios en la base de datos Firestore y obtener préstamos por persona o producto.
 *
 * Características clave:
 * - Manejo del estado de los préstamos.
 * - Definición de columnas para tablas relacionadas con préstamos.
 * - Acción para escuchar cambios en la base de datos Firestore.
 * - Acción para obtener préstamos por persona.
 * - Acción para obtener préstamos por producto.
 *
 * @store
 */

//importaciones
import { defineStore } from "pinia";

import { Dialog } from "quasar";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "src/firebaseInit";
import { UseUtilsStore } from "./utilsStore";
import { useDatabaseStore } from "./DatabaseStore";

const databaseStore = useDatabaseStore();
// Definición del store de préstamos.
export const UsePrestamosStore = defineStore("prestamos", {
  state: () => ({
    prestamosDatabase: [],
    stadisticTableBarInfo: [
      /** Definición de los datos que se van a mostrar en las estadisticas
        ejemplo:{
       * name:nombre de la columana
       * align:alineamiento
       * label:label
       * field:campo
       * sortable:y el orden
       * }
        */
      {

        text_color: "light-green-14",
        titulo: "Productos devueltos",
        valor: "210",
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
    columns: [
      /** Definición de columnas para tablas relacionadas con prestamos.
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
        name: "document",
        align: "center",
        label: "Documento",
        field: (row) => row.customer.documentNumber,
        sortable: true,
      },
      {
        name: "name",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.customer.name,
        format: (val) => `${val}`,
        sortable: true,
      },

      {
        name: "rol",
        label: "Rol",
        field: (row) => row.customer.rol,
        sortable: true,
      },

      {
        name: "date",
        label: "Fecha préstamo",
        field: (row) => row.dateBorrowed,
        format: (val) => new Date(val).toLocaleDateString(),
      },
      {
        name: "amout",
        label: "Cantida",
        field: (row) => row.productosList[0].quantity,
      },
    ],
    internalColumns: [
      //definición de las internal columsn
      {
        name: "productoId",
        align: "center",
        label: "Id Producto",
        field: (row) => row.productId,
        sortable: true,
      },
      {
        name: "product",
        required: true,
        label: "Producto",
        align: "left",
        field: (row) => row.product,
        sortable: true,
      },
      {
        name: "cantidad",
        label: "Cantidad",
        field: (row) => row.quantity,
        sortable: true,
      },
      {
        name: "fechaPrestado",
        label: "Fecha préstamo",
        field: (row) => row.dateBorrowed,
        format: (val) => new Date(val).toLocaleDateString(),
      },
      {
        name: "fechaEntrega",
        label: "Fecha Entrega",
        field: (row) => row.dueDate,
        format: (val) => new Date(val).toLocaleDateString(),
      },
      { name: "acciones", label: "Acciones", field: "acciones" },
    ],
    /**
      prestamosDatabase: [],  Almacena la lista de préstamos obtenida de Firestore.
    stadisticTableBarInfo: [ ... ],  Información estadística de préstamos.
    columns: [ ... ],  Definición de columnas para tablas relacionadas con préstamos.
    internalColumns: [ ... ],  Definición de columnas internas para tablas relacionadas con préstamos.

    allPersonDocs: [],  Almacena todos los documentos de una persona.
    allborrowingsPerson: [],  Almacena todos los préstamos de una persona.
    allBorrowingsProducts: [],  Almacena todos los préstamos de un producto.
    currentCustomer: {},  Almacena los datos de un cliente actual.
     */
    allPersonDocs: [],
    allborrowingsPerson: [],
    allBorrowingsProducts: [],
    currentCustomer: {},
  }),
  getters: {
    activeBorrowings: (state) =>
      state.allPersonDocs.filter(
        (prestamo) => prestamo.returnedQuantity < prestamo.quantity
      ),
  },

  // Acción para escuchar cambios en la colección de préstamos en Firestore.
  actions: {
    resetCurrentCustomer() {
      this.currentCustomer = {};
    },
    async listenChanges() {
      // Crear una consulta para la colección "borrowings" ordenada por "dateBorrowed".
      const q = query(collection(db, "borrowings"), orderBy("dateBorrowed"));

      // Establecer un observador en la consulta.
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          // si se añade un registro
          if (change.type == "added") {
            if (
              !this.prestamosDatabase.some(
                (item) => item.docId == change.doc.id
              )
            ) {
              const data = {
                docId: change.doc.id,
                ...change.doc.data(),
              };
              // Agregar el préstamo al principio de la lista.
              this.prestamosDatabase.unshift(data);
            }
            //En caso de que se modifique
          } else if (change.type == "modified") {
            let cambio = this.prestamosDatabase.find(
              (item) => item.docId == change.doc.id
            );
            let index = this.prestamosDatabase.findIndex(
              (item) => item.docId == change.doc.id
            );
            // Actualizar los datos del préstamo en la lista.
            this.prestamosDatabase[index] = {
              ...cambio,
              ...change.doc.data(),
            };
            // En caso de que se remueva un registro o dato
          } else if (change.type == "removed") {
            // Si se elimina un préstamo, filtrar y actualizar la lista eliminando el préstamo correspondiente.
            this.prestamosDatabase = this.prestamosDatabase.filter(
              (item) => item.docId != change.doc.id
            );
          }
          const source = snapshot.metadata.fromCache
            ? "local cache prestamos"
            : "server";
          console.log("Data came from " + source);
        });
      });
    },

    updateMoraPerson(cedula) {
      const moraActual = this.currentCustomer.enMora;
      const enMora = this.activeBorrowings.some((pedido) => pedido.enMora);
      console.log(moraActual, enMora);
      if (moraActual != enMora) {
        databaseStore.updateElement({ enMora }, "customers", cedula);
        this.currentCustomer = { ...this.currentCustomer, enMora };
      }
    },

    /**
     * Acción para obtener préstamos por persona.
     * @param {string} cedula - Cédula de la persona.
     * @returns {Array} - Lista de préstamos de la persona.
     */

    async getPrestamosByPerson(cedula) {
      const utils = UseUtilsStore();
      let docs;
      const customerRef = doc(db, "customers", cedula);
      this.currentCustomer = await getDoc(customerRef);
      console.log(this.currentCustomer);
      if (!this.currentCustomer.data()) {
        utils.notifyError("No encontramos el cliente", "warning");
        return;
      }
      this.currentCustomer = this.currentCustomer.data();
      const q = query(collection(customerRef, "borrowings"));
      docs = await getDocs(q);
      docs = docs.docs.map((document, index) => {
        const today = new Date().getTime();

        const enMora =
          today > document.data().dueDate &&
          document.data().returnedQuantity < document.data().quantity;

        return { index, docId: document.id, ...document.data(), enMora };
      });
      this.allPersonDocs = docs;
      this.updateMoraPerson(cedula);
      console.log(this.allPersonDocs);
      return docs;
    },
    /**
     * Acción para obtener préstamos por producto.
     * @param {string} id - ID del producto.
     * @returns {Array} - Lista de préstamos del producto.
     */
    async getPrestamosByProduct(id) {
      const idString = id;
      let docs;
      const productRef = doc(db, "products", idString);
      const q = query(collection(productRef, "borrowings"));
      docs = await getDocs(q);
      docs = docs.docs.map((document, index) => {
        return { index, docId: document.id, ...document.data() };
      });
      this.allBorrowingsProducts = docs;
      return docs;
    },
  },
});
