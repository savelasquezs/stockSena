/**
 * Día de la documentación: 05/09/2023
 *
 * Descripción del archivo "dataBaseStore.js":
 * Este store proporciona acciones para interactuar con la base de datos Firestore.
 * Incluye funciones para escuchar cambios en las colecciones, guardar elementos en una colección
 * y actualizar elementos existentes en una colección.
 *
 * Características clave:
 * - Escuchar cambios en una colección o subcolección.
 * - Guardar nuevos elementos en una colección.
 * - Actualizar elementos existentes en una colección.
 * - Notificar al usuario sobre el éxito de las operaciones.
 */

//Importaciónes de firebase

import {
  collectionGroup,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { auth, db } from "src/firebaseInit";
import { Notify } from "quasar";

// Función para mostrar notificaciones
const notificar = (message) => {
  Notify.create({
    color: "accent",
    icon: "done_outline",
    message,
    timeout: 3500,
  });
};

export const useDatabaseStore = defineStore("database", {
  state: () => {
    return {
      productosPrestadosPersona: [],
    };
  },

  actions: {
    async escucharCambios(store, tabla, ordenarPor, arrayName) {
      // Crear una consulta para la colección especificada, opcionalmente ordenada por un campo.
      const q = ordenarPor
        ? query(collection(db, tabla), orderBy(ordenarPor))
        : collection(db, tabla);
      // Establecer un observador en la consulta para detectar cambios en la colección.
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type == "added") {
            // Si se agrega un nuevo documento, agregarlo al principio del array en el estado.
            if (!store[arrayName].some((item) => item.docId == change.doc.id)) {
              const data = {
                docId: change.doc.id,
                ...change.doc.data(),
              };
              store[arrayName].unshift(data);
            }
          } else if (change.type == "modified") {
            // Si un documento existente se modifica, actualizar sus datos en el array en el estado.
            let cambio = store[arrayName].find(
              (item) => item.docId == change.doc.id
            );
            let index = store[arrayName].findIndex(
              (item) => item.docId == change.doc.id
            );
            store[arrayName][index] = { ...cambio, ...change.doc.data() };
          } else if (change.type == "removed") {
            // Si se elimina un documento, eliminarlo del array en el estado.
            store[arrayName] = store[arrayName].filter(
              (item) => item.docId != change.doc.id
            );
          }
        });
      });
    },

    /**
     * Escuchar cambios en una subcolección dentro de un documento principal.
     * @memberof useDatabaseStore
     * @param {string} tablaGeneral - Nombre de la colección principal.
     * @param {string} idDocGeneral - ID del documento principal.
     * @param {string} tabla - Nombre de la subcolección a escuchar.
     * @param {string} ordenarPor - Campo por el cual ordenar los resultados (opcional).
     * @param {string} arrayName - Nombre del array en el estado para actualizar con los cambios.
     */
    async escucharCambiosInternalCollection(
      store,
      tablaGeneral,
      idDocGeneral,
      tabla,
      ordenarPor,
      arrayName
    ) {
      // Obtener una referencia al documento principal.
      const refTablaGeneral = doc(db, tablaGeneral, idDocGeneral);
      // Crear una consulta para la subcolección especificada, opcionalmente ordenada por un campo.
      const coleccion = collection(refTablaGeneral, tabla);
      const q = ordenarPor ? query(coleccion, orderBy(ordenarPor)) : coleccion;

      // Establecer un observador en la consulta para detectar cambios en la subcolección.
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type == "added") {
            if (!store[arrayName].some((item) => item.docId == change.doc.id)) {
              // Si se agrega un nuevo documento, agregarlo al principio del array en el estado.
              if (store == "customers") {
                console.log("jajajaj customers");
              }
              const data = {
                docId: change.doc.id,
                ...change.doc.data(),
              };
              store[arrayName].unshift(data);
            }
          } else if (change.type == "modified") {
            // Si un documento existente se modifica, actualizar sus datos en el array en el estado.
            let cambio = store[arrayName].find(
              (item) => item.docId == change.doc.id
            );
            let index = store[arrayName].findIndex(
              (item) => item.docId == change.doc.id
            );
            store[arrayName][index] = { ...cambio, ...change.doc.data() };
          } else if (change.type == "removed") {
            // Si se elimina un documento, eliminarlo del array en el estado.
            store[arrayName] = store[arrayName].filter(
              (item) => item.docId != change.doc.id
            );
          }
        });
      });
    },

    /**
     * Guardar un nuevo elemento en una colección.
     * @memberof useDatabaseStore
     * @param {object} data - Datos del elemento a guardar.
     * @param {string} tabla - Nombre de la colección en la que guardar el elemento.
     * @returns {object} - Referencia al documento creado.
     */
    async saveElement(data, tabla) {
      // Obtener el almacén actual del usuario desde el almacenamiento local.
      const almacen = JSON.parse(localStorage.getItem("user")).almacen;
      // Completar los datos con información adicional antes de guardarlo.
      const completedData = {
        almacen,
        createdBy: auth.currentUser.email,
        ...data,
      };
      // Agregar el documento a la colección y obtener su referencia.
      const docRef = await addDoc(collection(db, tabla), completedData);
      // Notificar al usuario sobre el éxito de la operación.
      notificar("Guardado exitosamente");
      return docRef;
    },
    /**
     * Actualizar un elemento existente en una colección.
     * @memberof useDatabaseStore
     * @param {object} data - Nuevos datos para el elemento.
     * @param {string} tabla - Nombre de la colección que contiene el elemento.
     * @param {string} id - ID del documento a actualizar.
     */
    async updateElement(data, tabla, id) {
      //Completar los datos con información adicional antes de actualizar el documento.
      const completedData = { lastUpdatedBy: auth.currentUser.email, ...data };
      // Obtener una referencia al documento que se va a actualizar.
      const docRef = doc(db, tabla, id);
      // Notificar al usuario sobre el éxito de la operación
      notificar("Registro actualizado exitosamente");
      // Actualizar el documento con los nuevos datos.
      await updateDoc(docRef, completedData);
    },

    updateMoraPersona(idCliente) {
      if (this.productosPrestadosPersona.some((producto) => producto.enMora)) {
        this.updateElement({ enMora }, "customers", idCliente);
      }
    },
    async createUserCloudFunction(email, password) {
      const userData = {
        email,
        password,
      };

      try {
        const response = await fetch(
          "https://us-central1-sena-stock-management.cloudfunctions.net/sayHello",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );
        const dada = response;
        const data = await response.json(); // Parse the response as JSON
        console.log(data);
      } catch (error) {
        console.error(error); // Handle errors
      }
    },

    async updateMoraCliente(idCliente, idBorrowing = null, quantity = null) {
      // Obtener los documentos de la subcoleccion

      const borrowingsRef = collection(
        doc(db, "customers", idCliente),
        "borrowings"
      );
      const querySnapshot = await getDocs(borrowingsRef);
      querySnapshot.forEach((doc) => {
        // Hacer algo con cada documento
        const today = new Date().getTime;
        let enMora = false;
        if (today > doc.data().dueDate) {
          enMora = true;
        }
        this.productosPrestadosPersona.push({
          docId: doc.id,
          enMora,
          ...doc.data(),
        });
        console.log(doc.data());
      });
      this.updateMoraCliente(idCliente);
    },
  },
});
