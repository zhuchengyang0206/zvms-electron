<template>
  <v-card>
    <v-card-title>班级列表</v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="搜索"
        single-line
        hide-details
      ></v-text-field>
    <v-card-text>
      <v-data-table :headers="headers" :items="classes" :search="search"></v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
import dialogs from "../../utils/dialogs.js";

export default {
  data: () => ({
    classes: undefined,
    search: "",
    headers: [
      { text: "班级ID", value: "id", align: "start", sortable: false },
      { text: "班级名称", value: "name" },
    ],
  }),
  mounted: function () {
    this.pageload();
  },
  methods: {
    pageload() {
      this.$store.commit("loading", true);

      axios.post("/class/list").then((response) => {
        console.log(response.data);
        if (response.data.type == "ERROR")
          dialogs.toasts.error(response.data.message);
        else if (response.data.type == "SUCCESS") {
          this.classes = response.data.class;
        } else dialogs.toasts.error("未知错误");
      });

      this.$store.commit("loading", false);
    },
  },
};
</script>

<style>
</style>