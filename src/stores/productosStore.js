import { defineStore } from "pinia";
import { useDatabaseStore } from "./DatabaseStore";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "src/firebaseInit";

export const useProductosStore = defineStore("productos", {
  state: () => ({
    productosDatabase: [],
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    ponerValores() {
      this.productosDatabase = ["jajaj", "yuju"];
    },

    listenChanges() {
      const q = query(collection(db, "products"), orderBy("name"));
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type == "added") {
            if (
              !this.productosDatabase.some(
                (item) => item.docId == change.doc.id
              )
            ) {
              const data = {
                docId: change.doc.id,
                ...change.doc.data(),
              };
              this.productosDatabase.unshift(data);
            }
          } else if (change.type == "modified") {
            let cambio = this.productosDatabase.find(
              (item) => item.docId == change.doc.id
            );
            let index = this.productosDatabase.findIndex(
              (item) => item.docId == change.doc.id
            );
            this.productosDatabase[index] = {
              ...cambio,
              ...change.doc.data(),
            };
          } else if (change.type == "removed") {
            this.productosDatabase = this.productosDatabase.filter(
              (item) => item.docId != change.doc.id
            );
          }
        });
      });
    },
  },
});
