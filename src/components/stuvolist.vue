<template>
  <v-card flat>
    <v-card-title
      ><div class="headline">{{title}} 义工列表</div>
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
        :items="volworks"
        :search="search"
        :loading="$store.state.isLoading"
        @click:row="rowClick"
        loading-text="加载中..."
        no-data-text="没有数据哦"
        no-results-text="没有结果"
      >
      </v-data-table>
    </v-card-text>
    <v-dialog v-model="dialog" max-width="80%">
      <v-card>
        <volinfo :volid="volid" />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import dialogs from "../utils/dialogs";
import volinfo from "./volinfo.vue";
import axios from "axios";

export default {
  name: "stuvolist",
  props: ["userid", "title"],
  components: {
    volinfo,
  },
  data: () => ({
    volworks: undefined,
    dialog: false,
    search: "",
    volid: undefined,
    headers: [
      { text: "义工ID", value: "volId", align: "start", sortable: true },
      { text: "义工名称", value: "name" },
      { text: "校内时长（单位：分钟）", value: "inside" },
      { text: "校外时长（单位：分钟）", value: "outside" },
      { text: "大型时长（单位：分钟）", value: "large" },
      { text: "完成状态", value: "status" },
    ],
  }),
  created: function () {
    this.init();
  },
  methods: {
    init: function () {
      this.volworks = undefined;
      if (this.userid != 0 && this.userid != undefined) {
        this.$store.commit("loading", true);
        axios
          .get("/student/volbook/" + this.userid)
          .then((response) => {
            if (response.data.type == "ERROR")
              dialogs.toasts.error(response.data.message);
            else if (response.data.type == "SUCCESS") {
              this.volworks = response.data.rec;
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
    rowClick: function (item) {
      this.dialog = true;
      this.volid = item.volId;
    },
  },
  watch: {
    userid: function () {
      this.init();
    },
  },
};
</script>
