import { defineStore } from "pinia";
import { Notify } from "quasar";

export const UseUtilsStore = defineStore("utils", {
  actions: {
    async sendEmailBorrowing(
      email,
      prestamo,
      almacen,
      esTraspaso = false,
      clienteTraspaso = null
    ) {
      const data = {
        email,
        secret: "SantiagoIsTheBest",
        prestamo,
        almacen,
      };
      if (esTraspaso) {
        data.clienteTraspaso = clienteTraspaso;
        data.esTraspaso = true;
      }

      const result = await fetch(
        "https://us-central1-sena-stock-management.cloudfunctions.net/sendEmailBorrowing",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (result.ok) {
        this.notifyError("Cliente Notificado", "positive");
      } else {
        this.notifyError("Error al enviar el e-mail", "negative");
      }
    },
    notifyError(message, type = "negative") {
      console.log("notifyError called with message:", message);
      Notify.create({
        type,
        position: "center",
        message,
        timeout: 1500,
      });
    },
  },
});
