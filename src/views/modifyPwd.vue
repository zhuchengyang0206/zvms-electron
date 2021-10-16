<template>
  <v-container>
    <v-card>
      <v-card-title>修改密码</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="pwd_old"
          label="旧密码"
          type="password"
          prepend-icon="mdi-view-list"
        />
        <v-text-field
          v-model="pwd_new"
          label="新密码"
          type="password"
          prepend-icon="mdi-view-list"
        />
        <v-text-field
          v-model="pwd_conf"
          label="确认密码"
          type="password"
          prepend-icon="mdi-view-list"
        />
        <v-btn
          text
          color="primary"
          @click="modifyPwd()"
        >
          确定
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import dialogs from "../utils/dialogs";
import axios from "axios";
import zutils from "../utils/zutils";

var md5=require('md5-node');
export default {
  data: () => ({
    pwd_old: undefined,
    pwd_new: undefined,
    pwd_conf: undefined
  }),
  mounted: function () {
    this.pageload();
  },
  methods: {
    pageload: async function(){
      await zutils.checkToken(this);
    },
    modifyPwd: function(){
      if (this.pwd_new != this.pwd_conf){
        dialogs.toasts.error("两次密码不一致");
        return;
      }
      axios
        .post("/user/modPwd",{
            "oldPwd": md5(this.pwd_old),
            "newPwd": md5(this.pwd_new)
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.type == "SUCCESS") {
            dialogs.toasts.success(response.data.message);
          } else {
            dialogs.toasts.error(response.data.message);
          }
        })
        .catch((err) => {
          dialogs.toasts.error(err);
        })
        .finally(() => {
          this.$store.commit("loading", false);
        });
    }
  },
};
</script>
