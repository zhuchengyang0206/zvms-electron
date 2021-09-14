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
import dialogs from "../../utils/dialogs";
import zutils from "../../utils/zutils";
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
    async pageload() {
      this.$store.commit("loading", true);
      await zutils.fetchClassList((classes) => {
        classes
          ? (this.classes = classes)
          : dialogs.toasts.error("获取班级列表失败");
      });
      this.$store.commit("loading", false);
    },
    rowClick: function (item) {
      if (this.$store.state.info.permission >= permissions.teacher)
        this.$router.push({
          name: "classStulist",
          params: { classid: item.id },
        });
      else console.log("权限不足，无法跳转");
    },
  },
};
</script>

<style>
</style>