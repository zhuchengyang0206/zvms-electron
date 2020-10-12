<template>
  <v-card>
    <v-card-title
      ><div class="headline">班级列表</div>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="搜索"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="classes"
        :search="search"
        :loading="$store.state.isLoading"
        loading-text="加载中..."
      ></v-data-table>
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
      { text: "班级ID", value: "id", align: "start", sortable: true },
      { text: "班级名称", value: "name" },
    ],
  }),
  mounted: function () {
    this.pageload();
  },
  methods: {
    pageload() {
      this.$store.commit("loading", true);
      axios
        .post("/class/list")
        .then((response) => {
          console.log(response.data);
          if (response.data.type == "ERROR")
            dialogs.toasts.error(response.data.message);
          else if (response.data.type == "SUCCESS") {
            this.classes = response.data.class;
          } else dialogs.toasts.error("未知错误");
        })
        .catch((error) => {
          dialogs.toasts.error(error);
        })
        .finally(() => {
          this.$store.commit("loading", false);
        });
    },
  },
};
</script>

<style>
</style>