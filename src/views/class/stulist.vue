<template>
  <v-card>
    <v-card-title>
      <!-- 别问我为什么520而不是500px，问就是防止用户看到完整的item就以为不能滚动 -->
      <v-menu :disabled="menudisabled" rounded max-height="520px">
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn depressed v-bind="attrs" v-on="{ ...tooltip, ...menu }">
                <div class="headline">{{ nowclassname }}</div>
              </v-btn>
              <div class="headline">学生列表</div>
            </template>
            <span>{{ tipText }}</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in classes"
            :key="index"
            v-on:click="changeclass(item)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
        :items="students"
        :search="search"
        :loading="$store.state.isLoading"
        @click:row="rowClick"
        loading-text="加载中..."
        no-data-text="没有数据哦"
        no-results-text="没有结果"
      ></v-data-table>
      <v-dialog v-model="dialog" max-width="80%">
        <v-card>
          <stuvolist :userid="rowUserId" :title="rowUserName" />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialog = false"
              >关闭</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";
import dialogs from "../../utils/dialogs.js";
import permissions from "../../utils/permissions.js";
import stuvolist from "../../components/stuvolist";
import zutils from "../../utils/zutils.js";

export default {
  data: () => ({
    students: undefined,
    search: "",
    classes: undefined,
    nowclass: undefined,
    nowclassname: undefined,
    menudisabled: true,
    dialog: false,
    rowUserId: 0,
    rowUserName: undefined,
    tipText: "班级",
    headers: [
      { text: "学号", value: "id", align: "start", sortable: true },
      { text: "姓名", value: "name" },
      { text: "校内（分钟）", value: "inside" },
      { text: "校外（分钟）", value: "outside" },
      { text: "大型（分钟）", value: "large" },
      { text: "完成", value: "finished" },
    ],
  }),
  components: {
    stuvolist,
  },
  mounted: function () {
    this.pageload();
  },
  methods: {
    async pageload() {
      this.$store.commit("loading", true);
      axios
        .get("/class/list")
        .then((response) => {
          if (response.data.type == "ERROR") {
            dialogs.toasts.error(response.data.message);
          } else if (response.data.type == "SUCCESS") {
            this.classes = response.data.class;
            this.nowclass = this.$store.state.info.class;
            this.nowclassname = this.$store.state.info.classname;

            if (this.$store.state.info.permission > permissions.secretary) {
              this.menudisabled = false;
              this.tipText = "点击选择班级";
              if (this.$route.params != undefined) {
                this.nowclass = this.$route.params.classid;
                this.nowclassname = this.classid2name(this.nowclass);
              }
            }
          } else dialogs.toasts.error("未知错误");
        })
        .catch((error) => {
          dialogs.toasts.error(error);
        })
        .finally(() => {
          this.$store.commit("loading", false);
          //对团支书以上等级加入特殊判断防止报错
          if (
            this.$store.state.info.permission > permissions.secretary &&
            this.$route.params.classid <= 200000
          )
            this.nowclassname = "点击选择班级";
          else this.fetchstulist();
        });
    },

    fetchstulist: async function () {
      this.$store.commit("loading", true);
      this.students = undefined;
      await zutils.fetchStudentList(this.nowclass, (stus) => {
        stus ? (this.students = stus) : (this.students = undefined);
      });
      this.$store.commit("loading", false);
    },

    classid2name: function (classid) {
      for (var i = 0; i < this.classes.length; i++)
        if (this.classes[i]["id"] == classid) return this.classes[i]["name"];
    },

    rowClick: function (item) {
      this.dialog = true;
      this.rowUserId = item.id;
      this.rowUserName = item.name;
    },

    changeclass: function (item) {
      this.nowclass = item.id;
      this.nowclassname = item.name;
      this.fetchstulist();
    },
  },
};
</script>

<style>
</style>