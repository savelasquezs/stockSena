import { defineStore } from "pinia";
import { Notify } from "quasar";

export const UseUtilsStore = defineStore("utils", {
  actions: {
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
