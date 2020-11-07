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
        fixed-header
        :headers="headers"
        :items="classes"
        :search="search"
        :loading="$store.state.isLoading"
        @click:row="rowClick"
        loading-text="加载中..."
        no-data-text="没有数据哦"
        no-results-text="没有结果"
      >
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
import dialogs from "../../utils/dialogs.js";
import permissions from "../../utils/permissions";

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
    rowClick: function (item) {
      if (this.$store.state.info.permission >= permissions.teacher)
        this.$router.push("/class/stulist/" + item.id);
      else console.log("权限不足，无法跳转");
    },
  },
};
</script>

<style>
</style>