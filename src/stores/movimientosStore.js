import { defineStore } from "pinia";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "src/firebaseInit";

export const UseMovimientosStore = defineStore("movimientos", {
  state: () => ({
    movimientosDatabase: [],
  }),
  getters: {

  },

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
