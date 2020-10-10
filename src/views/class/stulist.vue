<template>
  <v-card>
    <v-card-title>
      <!-- <div class="headline">学生列表</div> -->
      <v-menu :disabled="menudisabled">
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                color="white"
                depressed
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
              >
                <div class="headline">{{ nowclassname }}学生列表</div>
              </v-btn>
            </template>
            <span>选择班级</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in classes"
            :key="index"
            v-on:click="changeclass(item)"
          >
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
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
        :headers="headers"
        :items="students"
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
import permissions from "../../utils/permissions.js";

export default {
  data: () => ({
    students: undefined,
    search: "",
    classes: undefined,
    nowclass: undefined,
    nowclassname: undefined,
    menudisabled: true,
    dense: false,
    headers: [
      { text: "学号", value: "id", align: "start", sortable: true },
      { text: "姓名", value: "name" },
    ],
  }),
  mounted: function () {
    this.pageload();
  },
  methods: {
    pageload() {
      this.nowclass = this.$store.state.info.class;
      this.nowclassname = this.$store.state.info.classname;
      if (this.$store.state.info.permission > permissions.secretary)
        this.menudisabled = false;
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
          this.fetchstulist();
        });
    },

    fetchstulist() {
      this.$store.commit("loading", true);
      axios
        .post("/class/stulist/" + this.nowclass)
        .then((response) => {
          console.log(response.data);
          if (response.data.type == "ERROR")
            dialogs.toasts.error(response.data.message);
          else if (response.data.type == "SUCCESS") {
            this.students = response.data.student;
          } else dialogs.toasts.error("未知错误");
        })
        .catch((error) => {
          dialogs.toasts.error(error);
        })
        .finally(() => {
          this.$store.commit("loading", false);
        });
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