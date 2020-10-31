<template>
  <v-container>
    <v-card>
      <v-card-title>你好,</v-card-title>
      <v-card-text>{{$store.state.isLogined}},{{$store.state.info.username}},{{$store.state.info.permission}}</v-card-text>
    </v-card>
    <v-card>
      <v-card-title>随机感想展示</v-card-title>
      <v-card-subtitle>{{thought.userName}}</v-card-subtitle>
      <v-card-text>{{thought.content}}</v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import dialogs from "../utils/dialogs.js";

export default {
  name: "me",
  data: () => ({
    thought: {
      userName: undefined,
      userId: undefined,
      content: undefined
    }
  }),
  mounted: function () {
    //this.pageload();
    this.randomThought();
  },
  methods: {
    pageload() {
      this.$store.commit("loading", true);
      //这一段暂时用不着了，因为网络提取改到从$store里面提取了,但是先留着吧
      axios
        .post("/userinfo.php")
        .then((response) => {
          if (response.data.type == "SUCCESS") {
            this.username = response.data.username;
          } else if (response.data.type == "ERROR") {
            dialogs.toasts.error(response.data.message);
          }
        })
        .catch((error) => {
          dialogs.toasts.error(error);
        })
        .finally(() => {this.$store.commit("loading", false);});
    },
    randomThought: function(){
      this.$store.commit("loading", true);
      axios
        .post("/volunteer/randomThought")
        .then((response) => {
          if (response.data.type == "SUCCESS") {
            this.thought.userName = response.data.userName;
            this.thought.userId = response.data.userId;
            this.thought.content = response.data.content;
          } else if (response.data.type == "ERROR") {
            dialogs.toasts.error(response.data.message);
          }
        })
        .catch((error) => {
          dialogs.toasts.error(error);
        })
        .finally(() => {this.$store.commit("loading", false);});
    }
  },
};
</script>
