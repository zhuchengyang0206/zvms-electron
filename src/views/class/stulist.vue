<template>
  <v-card>
    <v-card-title>
      <!-- 别问我为什么520而不是500px，问就是防止用户看到完整的item就以为不能滚动 -->
      <v-menu :disabled="menudisabled" rounded max-height="520px">
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                depressed
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
              >
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
      <v-dialog v-model="dialog">
        <v-card>
          <uservolist :userid="rowUserId" :title="rowUserName" />
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
import uservolist from "../../compoments/uservolist";

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
      { text: "校内", value: "inside" },
      { text: "校外", value: "outside" },
      { text: "大型", value: "large" },
      { text: "完成", value: "finished" },
    ],
  }),
  components: {
    uservolist,
  },
  mounted: function () {
    this.pageload();
  },
  methods: {
    pageload() {
      this.$store.commit("loading", true);
      axios
        .post("/class/list")
        .then((response) => {
          if (response.data.type == "ERROR"){
            dialogs.toasts.error(response.data.message);
          }
          else if (response.data.type == "SUCCESS") {
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
          if(this.$store.state.info.permission > permissions.secretary && this.$route.params.classid <= 200000)
            this.nowclassname = "点击选择班级";
          else
            this.fetchstulist();
        });
    },

    fetchstulist: function () {
      this.$store.commit("loading", true);
      this.students = undefined;
      axios
        .post("/class/stulist/" + this.nowclass)
        .then((response) => {
          if (response.data.type == "ERROR")
            dialogs.toasts.error(response.data.message);
          else if (response.data.type == "SUCCESS") {
            this.students = response.data.student;
            //计算义工是否满
            for (var i = 0; i < this.students.length; i++) {
              this.students[i].finished = this.finished(this.students[i]);
            }
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
      this.dialog = true;
      this.rowUserId = item.id;
      this.rowUserName = item.name;
    },

    changeclass: function (item) {
      this.nowclass = item.id;
      this.nowclassname = item.name;
      this.fetchstulist();
    },

    finished: function (item) {
      var inside = item["inside"];
      var outside = item["outside"];
      var large = item["large"];
      var result = true;

      if (outside < 20) {
        this.inside = inside - (20 - outside) * 2;
        outside = 20;
      }
      if (large < 16 || inside < 20 || outside < 20 || inside + outside < 44) {
        result = false;
      }

      return result ? "是" : "否";
    },

    classid2name: function (classid) {
      for (var i = 0; i < this.classes.length; i++) {
        if (this.classes[i]["id"] == classid) {
          return this.classes[i]["name"];
        }
      }
    },
  },
};
</script>

<style>
</style>