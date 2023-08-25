import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { auth, db } from "src/firebaseInit";
import { Notify } from "quasar";

const notificar = (message) => {
  Notify.create({
    color: "accent",
    icon: "done_outline",
    message,
    timeout: 3500,
  });
};

export const useDatabaseStore = defineStore("database", {
  actions: {
    async escucharCambios(store, tabla, ordenarPor, arrayName) {
      const q = ordenarPor
        ? query(collection(db, tabla), orderBy(ordenarPor))
        : collection(db, tabla);
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type == "added") {
            if (!store[arrayName].some((item) => item.docId == change.doc.id)) {
              const data = {
                docId: change.doc.id,
                ...change.doc.data(),
              };
              store[arrayName].unshift(data);
            }
          } else if (change.type == "modified") {
            let cambio = store[arrayName].find(
              (item) => item.docId == change.doc.id
            );
            let index = store[arrayName].findIndex(
              (item) => item.docId == change.doc.id
            );
            store[arrayName][index] = { ...cambio, ...change.doc.data() };
          } else if (change.type == "removed") {
            store[arrayName] = store[arrayName].filter(
              (item) => item.docId != change.doc.id
            );
          }
        });
      });
    },
    async saveElement(data, tabla) {
      const almacen = JSON.parse(localStorage.getItem("user")).almacen;
      const completedData = {
        almacen,
        createdBy: auth.currentUser.email,
        ...data,
      };
      const docRef = await addDoc(collection(db, tabla), completedData);
      notificar("Guardado exitosamente");
      return docRef;
    },
    async updateElement(data, tabla, id) {
      const completedData = { lastUpdatedBy: auth.currentUser.email, ...data };
      const docRef = doc(db, tabla, id);
      notificar("Registro actualizado exitosamente");
      await updateDoc(docRef, completedData);
    },
  },
});
