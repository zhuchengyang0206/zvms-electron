<template>
  <v-card
    id="bgcard"
    class="d-flex mb-6 align-center justify-center"
    outlined
    color="rgba(255, 255, 255, 0)"
    :height="winheight"
  >
    <v-card class="mx-auto" width="50%" max-width="500" min-width="250">
      <v-card-title
        class="headline primary white--text"
        style="backdrop-filter: blur(2px)"
        >登录</v-card-title
      >
      <br />
      <v-card-text>
        <h1><a href="https://zhuchengyang.gitee.io/blog/yigong.html">公测须知</a></h1>
        <br/>
        <v-form ref="form">
          <v-text-field
            type="username"
            v-model="form.userid"
            :rules="rules"
            label="用户ID"
          />
          <v-text-field
            type="password"
            v-model="form.password"
            :rules="rules"
            label="密码"
            @keyup.native.enter="login"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          block
          :disabled="$store.state.isLoading"
          @click="login"
          >登录</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script>
import dialogs from "../utils/dialogs.js"; //弹出toast提示用
import { NOTEMPTY } from "../utils/validation.js"; //校验表单完整性
import axios from "axios"; //ajax网络库
import permissions from "../utils/permissions.js";

var md5=require('md5-node');

export default {
  name: "login",
  data: () => ({
    //储存表单数据
    form: {
      userid: undefined,
      password: undefined,
    },
    drawers: undefined,
    rules: [NOTEMPTY()], //表单校验规则
    winheight: document.documentElement.clientHeight - 100, //一个比较失败的自动调整大小
  }),
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.$store.commit("loading", true);
        axios
          .post("/user/login", {"userid":this.form.userid,"password":md5(this.form.password)})
          .then((response) => {
            //对传回数据进行处理
            console.log(response.data)
            if (response.data.type == "SUCCESS") {
              dialogs.toasts.success(response.data.message);
              //将一切保存到$store
              this.$store.commit("login", true);
              this.$store.commit("info", {
                username: response.data.username,
                permission: response.data.permission,
                class: response.data.class,
                classname: response.data.classname,
              });
              //设置token
              this.$store.commit("token", response.data.token);
              this.$router.push("/me");
              //更新抽屉导航栏
              this.drawers = [
                { title: "我的", to: "/me", icon: "mdi-account-circle" },
                { title: "修改密码", to: "/modifyPwd", icon: "mdi-account-circle"}
              ];

              //看看是否加上班级列表
              if (response.data.permission >= permissions.teacher) {
                this.drawers.push({
                  title: "班级列表",
                  to: "/class/list",
                  icon: "mdi-view-list",
                });
              }
              //看看是否加上学生列表
              if (response.data.permission >= permissions.secretary) {
                this.drawers.push({
                  title: "学生列表",
                  to: "/class/stulist/"+response.data.class,
                  icon: "mdi-view-list",
                });
                
              }
              this.drawers.push({
                title: "义工列表",
                to: "/volunteer/list",
                icon: "mdi-view-list",
              });

              //看看是否加上创建义工
              if (response.data.permission >= permissions.teacher) {
                this.drawers.push({
                  title: "创建义工",
                  to: "/volunteer/create",
                  icon: "mdi-view-list",
                });
              }
              if (response.data.permission > permissions.teacher) {
                this.drawers.push({
                  title: "审核感想",
                  to: "/volunteer/audit",
                  icon: "mdi-view-list",
                });
              }
              if (response.data.permission == permissions.secretary){
                this.drawers.push({
                  title: "假期义工",
                  to: "/volunteer/holiday",
                  icon: "mdi-view-list",
                });
                this.drawers.push({
                  title: "感想提交",
                  to: "/volunteer/thought",
                  icon: "mdi-view-list",
                });
              }
              this.drawers.push({
                title: "登出",
                to: "/logout",
                icon: "mdi-exit-to-app",
              });
              this.$store.commit("draweritems", this.drawers);
            } else if (response.data.type == "ERROR") {
              dialogs.toasts.error(response.data.message);
              this.form.password = undefined;
            } else {
              dialogs.toasts.error("未知错误!");
              this.form.password = undefined;
            }
          })
          .catch((error) => {
            dialogs.toasts.error(error);
            this.form.password = undefined;
          })
          .finally(() => {
            this.$store.commit("loading", false);
          });
      }
    },
  },
};
</script>
