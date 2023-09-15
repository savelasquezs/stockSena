/**Día de la documentación: 05/09/2023 Descripción del archivo "clientStore.js"

Este store maneja el estado relacionado con los clientes y proporciona acciones
para interactuar con la base de datos Firestore para agregar, modificar y eliminar clientes.
También se encarga de escuchar cambios en la base de datos y actualizar el estado en consecuencia.
Características clave:
- El estado incluye una lista de clientes y columnas para tablas.
- Proporciona acciones para escuchar cambios en la base de datos Firestore.
- Maneja la sincronización de datos entre la base de datos y el estado local.

  */

//Importaciónes
import { defineStore } from "pinia";
import {
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
import { db } from "src/firebaseInit";
import { UseUtilsStore } from "./utilsStore";
import { UsePrestamosStore } from "./prestamosStore";

//Definición del store
export const UseClientesStore = defineStore("clientes", {
  state: () => ({
    clientesDatabase: [], //Almacena la lista de clientes obtenida de Firestore.
    columns: [
      // Definición de columnas para tablas relacionadas con clientes.
      // Cada objeto en "columns" define una columna en una tabla con sus propiedades.

      /** esto es un ejemplo columna ={
       * name:nombre de la columana
       * align:alineamiento
       * label:label
       * field:campo
       * sortable:y el orden
       * }
       * Estos campos son los que se le pasan a la columna, y varian segun
       * las columnas y como se definan*/
      {
        name: "enMora",
        label: "Estado Mora",
        field: "enMora",
      },
      {
        name: "TipoDoc",
        align: "center",
        label: "Tipo de Documento",
        field: (row) => row.tipoDoc,
        sortable: true,
      },

      {
        name: "doc",
        label: "Numero Documento",
        field: (row) => row.numero_id,
      },
      {
        name: "nombre",
        label: "Nombre",
        field: (row) => row.nombre,
      },
      {
        name: "apellido",
        label: "Apellido",
        field: (row) => row.apellido,
      },
      {
        name: "area",
        label: "Area",
        field: (row) => row.area,
      },
      {
        name: "rol",
        label: "Rol",
        field: (row) => row.rol,
      },
      { name: "acciones", label: "Acciones", field: "acciones" },
    ],
    columnsPrestamosPersona: [
      {
        name: "producto",
        label: "Producto",
        field: (row) => row.product,
        style: (row) =>
          row.product
            ? "font-weight: bold;font-size:1rem"
            : "font-weight: bold",
      },
      {
        name: "enMora",
        label: "Estado Mora",
        field: "enMora",
      },

      {
        name: "caritas",
        label: "Debe Unidades",
        field: "caritas",
      },

      {
        name: "cantidad",
        label: "Cantidad prestada",
        field: (row) => row.quantity,
      },
      {
        name: "cantidadDevuelta",
        label: "Cantidad devuelta",
        field: (row) => row.returnedQuantity,
      },
      {
        name: "fechaPrestamo",
        label: "Fecha Prestamo",
        field: (row) => row.dateBorrowed,
        format: (val) => new Date(val).toLocaleDateString("es-CO"),
      },
      {
        name: "fechaLimite",
        label: "Fecha Limite",
        field: (row) => row.dueDate,
        format: (val) => new Date(val).toLocaleDateString("es-CO"),
      },
      {
        name: "fechaDevuelto",
        label: "Fecha ultima dev",
        field: (row) => row.fechaDevolucion,
        format: (val) => new Date(val).toLocaleDateString("es-CO"),
      },
      {
        name: "descripcion",
        label: "Descripción",
        field: (row) => {
          if (row.isConsumable) {
            return "producto consumible";
          }
          let str = "";
          for (const [key, value] of Object.entries(row.custom)) {
            str += `${key}: ${value}, `;
          }
          return str.slice(0, -2);
        },
      },
      {
        name: "estadoPrestamo",
        label: "Estado al prestar",
        field: (row) => row.estadoEntrega,
      },
      {
        name: "estadoEntregado",
        label: "Estado Devuelto",
        field: (row) => row.estadoDevuelto,
      },

      { name: "acciones", label: "Acciones", field: "acciones" },
    ],

    currentCustomer: {},
  }),
  getters: {
    stadistics(state) {
      const array = [];
      const morososLength = state.clientesDatabase.filter(
        (cliente) => cliente.enMora
      ).length;

      const totalClientes = state.clientesDatabase.length;

      const totalMorososStadistic = {
        text_color: "text-light-black",
        titulo: "Total Morosos",
        valor: morososLength,
        periodo: "En total",
      };
      const totalClientesStadistic = {
        text_color: "text-light-black",
        titulo: "Total Clientes",
        valor: totalClientes,
        periodo: "En total",
      };

      array.push(totalMorososStadistic);
      array.push(totalClientesStadistic);
      return array;
    },
  },

  actions: {
    updatePrestamosMora(customerRef, docs, enMora) {
      docs.forEach(async (prestamo) => {
        const prestRef = doc(customerRef, "borrowings", prestamo.id);
        await updateDoc(prestRef, { enMora });
      });
    },

    // listenChanges / Acción para escuchar cambios en la colección de clientes
    async listenChanges() {
      // Crear una consulta para la colección "customers" ordenada por "nombre"
      const q = query(collection(db, "customers"), orderBy("nombre"));
      // Establecer un observador en la consulta
      onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
        // Iterar a través de los cambios en los documentos
        snapshot.docChanges().forEach(async (change) => {
          // Si se agrega un cliente nuevo
          if (change.type == "added") {
            // Crear un objeto de datos con el ID del documento y sus datos
            if (
              !this.clientesDatabase.some((item) => item.docId == change.doc.id)
            ) {
              const today = new Date().getTime();
              const customerRef = doc(db, "customers", change.doc.id);
              const q = query(
                collection(customerRef, "borrowings"),
                where("dueDate", "<", today)
              );
              const docs = await getDocs(q);
              let enMora = false;
              if (!docs.empty) {
                enMora = true;
                this.updatePrestamosMora(customerRef, docs.docs, enMora);
              }
              const data = {
                docId: change.doc.id,
                ...change.doc.data(),
                enMora,
              };

              // Agregar el cliente al principio de la lista
              this.clientesDatabase.unshift(data);
            }
            // Si un cliente existente se modifica
          } else if (change.type == "modified") {
            let cambio = this.clientesDatabase.find(
              (item) => item.docId == change.doc.id
            );
            let index = this.clientesDatabase.findIndex(
              (item) => item.docId == change.doc.id
            );
            // Actualizar los datos del cliente en la lista
            this.clientesDatabase[index] = {
              ...cambio,
              ...change.doc.data(),
            };
          } else if (change.type == "removed") {
            // Si se elimina un cliente
            // Filtrar y actualizar la lista eliminando el cliente correspondiente
            this.clientesDatabase = this.clientesDatabase.filter(
              (item) => item.docId != change.doc.id
            );
          }
          // Determinar la fuente de los datos (caché local o servidor)
          const source = snapshot.metadata.fromCache
            ? "local cache clientes"
            : "server";
          // Registrar la fuente de los datos en la consola
          console.log("Data came from " + source);
        });
      });
    },
    async getCurrentCliente(cedula) {
      const utils = UseUtilsStore();
      const prestamosStore = UsePrestamosStore();
      console.log(prestamosStore.currentCustomer);
      if (cedula == prestamosStore.currentCustomer.numero_id) {
        utils.notifyError("Debes ingresar el documento del receptor");
        setTimeout(() => {
          utils.notifyError(
            "El ingresado corresponde al cliente actual",
            "warning"
          );
        }, 1200);
        return;
      }
      const customerRef = doc(db, "customers", cedula);
      const current = await getDoc(customerRef);

      if (!current.data()) {
        utils.notifyError("No encontramos el cliente", "warning");
        return;
      }
      this.currentCustomer = current.data();
    },
  },
});
