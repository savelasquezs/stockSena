import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { defineStore } from "pinia";
import { db } from "src/firebaseInit";

export const useDatabaseStore = defineStore("productos", {
  state: () => ({
    productosDatabase: [],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },

  actions: {
    escucharCambios({ store, tabla, ordenarPor, arrayName }) {
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
      const docRef = await addDoc(collection(db, tabla), data);
      return docRef;
    },
    async updateElement(data, tabla, id) {
      const docRef = doc(db, tabla, id);
      await updateDoc(docRef, data);
    },
  },
});
