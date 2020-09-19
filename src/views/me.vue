<template>
  <v-card>
    <v-card-title>你好,</v-card-title>
    <v-card-text>{{$store.state.isLogined}},{{$store.state.info.username}},{{$store.state.info.permission}}</v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
import dialogs from "../utils/dialogs.js";

export default {
  name: "me",
  data: () => ({
    username: undefined,
  }),
  mounted: function () {
    //this.pageload();
  },
  methods: {
    pageload() {
      this.$store.commit("loading", true);
      //这一段暂时用不着了，因为网络提取改到从$store里面提取了,但是先留着吧
      axios
        .post("/userinfo.php")
        .then((response) => {
          console.log(response.data);
          console.log(this.$store.state.info);
          if (response.data.type == "SUCCESS") {
            this.username = response.data.username;
          } else if (response.data.type == "ERROR") {
            dialogs.toasts.error(response.data.message);
          }
        })
        .catch((error) => {
          dialogs.toasts.error(error);
        })
        .finally(() => {});
      this.$store.commit("loading", false);
    },
  },
};
</script>
