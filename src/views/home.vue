<template>
  <v-container>
    <v-card>
      <v-card-title>初始化</v-card-title>
      <v-card-text>正在加载...</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
import dialogs from '../utils/dialogs'

export default {
  name: "home",

  mounted: function () {
    this.checkLogin();
  },
  methods: {
    checkLogin: function(){
      this.$store.commit("loading", true);
      axios
        .post("/user/info")
        .then((response) => {
          if (response.data.type == "ERROR"){
            this.$router.push("/login");
          }
          else if (response.data.type == "SUCCESS") {
            this.$router.push("/me");
          } else dialogs.toasts.error("未知错误!");
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
