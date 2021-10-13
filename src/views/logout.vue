<template>
  <v-card>
    <v-card-title>正在登出...</v-card-title>
  </v-card>
</template>

<script>
import axios from "axios";
import dialogs from "../utils/dialogs.js";

export default {
  name: "logout",
  mounted: function () {
    this.logout();
  },
  methods: {
    logout() {
      this.$store.commit("loading", true);
      this.$store.commit("login", false);
      this.$store.commit("info", {
        username: undefined,
        permission: undefined,
        class: undefined,
        classname: undefined
      });
      this.$store.commit("token", undefined);
      axios
        .post("/user/logout")
        .then((response) => {
          if (response.data.type == "SUCCESS") {
            dialogs.toasts.success(response.data.message);
          } else if (response.data.type == "ERROR") {
            dialogs.toasts.error(response.data.message);
          }
        })
        .catch((error) => {
          dialogs.toasts.error(error);
        })
        .finally(() => {
          this.$store.commit("draweritems", [
            { title: "登录", to: "/login", icon: "mdi-account-circle" },
            { title: "反馈错误", to: "/report", icon: "mdi-alert" }
          ]);
          this.$router.push("/login");
          this.$store.commit("loading", false);
        });
    },
  },
};
</script>>