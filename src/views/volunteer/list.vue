<template>
    <v-card></v-card>
</template>

<script>
import axios from "axios";
import dialogs from "../../utils/dialogs.js";

export default {
  data: () => ({
      volworks: [],
  }),
  mounted: function () {
    this.pageload();
  },
  methods: {
    pageload() {
      this.$store.commit("loading", true);
      axios
        .post("/volunteer/list")
        .then((response) => {
          if (response.data.type == "ERROR")
            dialogs.toasts.error(response.data.message);
          else if (response.data.type == "SUCCESS") {
            this.volworks = response.data.volunteer;
          } else dialogs.toasts.error("未知错误");
        })
        .catch((error) => {
          dialogs.toasts.error(error);
        })
        .finally(() => {
          this.$store.commit("loading", false);
        });
    }
  },
};
</script>

<style>
</style>