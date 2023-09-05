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

export const UsePrestamosStore = defineStore("prestamos", {
  state: () => ({
    prestamosDatabase: [],
    stadisticTableBarInfo: [
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
        text_color: "text-yellow",
        titulo: "Total productos",
        valor: "15000",
        periodo: "Ultima semana",
      },
      {
        text_color: "text-pink",
        titulo: "Diandry",
        valor: "8569522",
        periodo: "Ultima semana",
      },
    ],
    columns: [
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
      { name: "ficha", label: "Ficha", field: "ficha", sortable: true },
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
    allPersonDocs: [],
    allborrowingsPerson: [],
    allBorrowingsProducts: [],
    currentCustomer: {},
  }),
  getters: {},

  actions: {
    resetCurrentCustomer() {
      this.currentCustomer = {};
    },
    async listenChanges() {
      const q = query(collection(db, "borrowings"), orderBy("dateBorrowed"));

      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
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
          const source = snapshot.metadata.fromCache
            ? "local cache prestamos"
            : "server";
          console.log("Data came from " + source);
        });
      });
    },
    async getPrestamosByPerson(cedula) {
      const cedulita = cedula;
      let docs;
      const customerRef = doc(db, "customers", cedulita);
      this.currentCustomer = (await getDoc(customerRef)).data();
      if (!this.currentCustomer) {
        Dialog.create("nanana");
      }
      const q = query(collection(customerRef, "borrowings"));
      docs = await getDocs(q);
      docs = docs.docs.map((document, index) => {
        return { index, docId: document.id, ...document.data() };
      });
      this.allPersonDocs = docs;
      return docs;
    },
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
