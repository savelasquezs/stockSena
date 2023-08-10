import { defineStore } from "pinia";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "src/firebaseInit";

export const UsePrestamosStore = defineStore("prestamos", {
  state: () => ({
    prestamosDatabase: [],
  }),
  getters: {

  },

  actions: {
    async listenChanges() {
      const q = query(collection(db, "borrowings"), orderBy("dateBorrowed"));

      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
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
              this.prestamosDatabase.unshift(data);
            }
          } else if (change.type == "modified") {
            let cambio = this.prestamosDatabase.find(
              (item) => item.docId == change.doc.id
            );
            let index = this.prestamosDatabase.findIndex(
              (item) => item.docId == change.doc.id
            );
            this.prestamosDatabase[index] = {
              ...cambio,
              ...change.doc.data(),
            };
          } else if (change.type == "removed") {
            this.prestamosDatabase = this.prestamosDatabase.filter(
              (item) => item.docId != change.doc.id
            );
          }
        });
      });
    },
  },
});
