<template>
  <v-container>
    <v-card color="primary" dark>
      <v-card-title>
        义工列表
        <v-spacer></v-spacer>
		<!--
        <v-switch
          color="secondary"
          label="仅显示本班"
          @click="switchDisplay()"
          v-model="onlyDisplayCurrentClass"
          v-show="!granted()"
          dense
        ></v-switch>
		-->
      </v-card-title>
    </v-card>
    <v-card v-for="vol in volworks" v-bind:key="vol.id">
      <v-card-title>{{ vol.name }}</v-card-title>
      <v-card-text>
        {{ vol.description }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="volDetail(vol.id)">
          <v-icon left>mdi-clipboard-text</v-icon>
          详情
        </v-btn>
        <v-btn color="primary" @click="participants(vol.id)">
          <v-icon left>mdi-clipboard-text</v-icon>
          查看已报名
        </v-btn>
        <v-btn v-if="granted()" color="primary" @click="volSignUp(vol.id)">
          <v-icon left>mdi-account-plus</v-icon>
          报名
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog" max-width="80%">
      <v-card>
        <volinfo :volid="volid" />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_participant" max-width="80%">
      <v-card>
            <v-card-title>报名列表</v-card-title>
        <v-card-text>
          <v-data-table
            fixed-header
            :headers="headers"
            :items="participantsLst"
            :search="search"
            :loading="$store.state.isLoading"
            loading-text="加载中..."
            no-data-text="没有数据哦"
            no-results-text="没有结果"
          >
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog_participant = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog1" max-width="80%">
      <v-card>
        <v-simple-table style="margin:20px;">
          <thead>
            <td>学号</td>
            <td>删除</td>
          </thead>
          <tbody>
            <tr
              v-for="(stuid, i) in stulstSelected"
              :key = "i"
            >
              <td>{{mp[stuid]}}</td>
              <td>
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  x-small
                  color="primary"
                  @click="delFromList(i)"
                >
                  <v-icon dark>
                    mdi-minus
                  </v-icon>
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-select
                  prepend-icon="mdi-switch"
                  v-model="stu_new"
                  label="选定学生"
                  :items="stulst"
                  item-text="name"
                  item-value="id"
                >
                </v-select>
              </td>
              <td>
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  x-small
                  color="primary"
                  @click= "addToList"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <p>当前选中了{{stulstSelected.length}}个学生哦，你可以点击加号添加一个学生</p>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="signupVolunteer(volid)">确定</v-btn>
          <v-btn color="red darken-1" text @click="dialog1 = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import dialogs from "../../utils/dialogs.js";
import permissions from "../../utils/permissions";
import volinfo from "../../components/volinfo";
import zutils from "../../utils/zutils.js";
import axios from "axios";

let { ipcRenderer } = window.require('electron')
export default {
  data: () => ({
    search: "",
    headers: [
      { text: "学号", value: "stuId", align: "start", sortable: true },
      { text: "姓名", value: "stuName" },
    ],
    volworks: [],
    dialog: false,
      dialog_participant: false,
    dialog1: false,
      submitThoughtDialog: false,
    volid: undefined,
    onlyDisplayCurrentClass: true,
    stulst: undefined,
    stulstSelected: [],
    stu_new: undefined,
      participantsLst: [],
    stu: undefined,
    thought: undefined,
    mp: {}
  }),
  components: {
    volinfo,
  },
  mounted: function () {
    this.pageload();
  },
  methods: {
    pageload() {
	  await zutils.checkToken((flag)=>{
	    if(!flag){
		  axios.post("/user/logout").finally({
		    this.$store.commit("draweritems", [
              { title: "登录", to: "/login", icon: "mdi-account-circle" },
            ]);
            this.$router.push("/login");
            this.$store.commit("loading", false);
		  })
		}
	  });
      ipcRenderer.send('endflash');
      this.switchDisplay();
    },
    granted: function () {
      return this.$store.state.info.permission < permissions.teacher;
    },
    volSignUp: function (volid) {
      console.log("SignUp: " + volid);
      this.dialog1 = true;

      this.stulst = undefined;
      this.stulstSelected = [];
      zutils.fetchStudentList(this.$store.state.info.class, (stus) => {
        stus ? (this.stulst = stus) : (this.stulst = undefined);
        this.volid = volid;
        for (let i in this.stulst)
          this.mp[this.stulst[i].id] = this.stulst[i].name;
        console.log(this.mp);
      });
    },
    signupVolunteer: function(volid){
      if (this.stulstSelected.length == 0){
        dialogs.toasts.error("报名列表为空");
        return;
      }
      axios
        .post("/volunteer/signup/"+volid,{
          "stulst": this.stulstSelected
        })
        .then((response) => {
            // console.log(response.data);
            if (response.data.type == "SUCCESS") {
              dialogs.toasts.success(response.data.message);
              for(let k in this.form)
                this.form[k] = undefined
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
        this.dialog1 = false;
    },
    participants: function (volid){
    this.dialog_participant = true;
    this.volid = volid;
    this.participantsLst = [];
    axios
      .get("/volunteer/signerList/"+volid, {

      })
      .then((response) => {
        console.log(response.data);
        if (response.data.type == "SUCCESS") {
          dialogs.toasts.success(response.data.message);
          this.participantsLst = response.data.result;
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
    },
    volDetail: function (volid) {
      console.log("Detail:" + volid);
      this.volid = volid;
      this.dialog = true;
    },
    switchDisplay: function () {
      if (granted()) this.fetchCurrentClassVol();
      else this.fetchAllVol();
    },
    async fetchCurrentClassVol() {
      this.$store.commit("loading", true);
      await zutils.fetchClassVolunter(
        this.$store.state.info.class,
        (volworks) => {
          volworks
            ? (this.volworks = volworks)
            : dialogs.toasts.error("获取义工列表失败");
        }
      );
      this.$store.commit("loading", false);
    },
    
    async fetchAllVol() {
      this.$store.commit("loading", true);
      await zutils.fetchAllVolunter((volworks) => {
        volworks
          ? (this.volworks = volworks)
          : dialogs.toasts.error("获取义工列表失败");
      });
      this.$store.commit("loading", false);
    },
    
    addToList: function (){
      // console.log("Ent");
      // console.log(this.stu_new);
      // console.log(this.stulstSelected);
      let flg = false;
      if (this.stu_new == undefined) flg = true;
      for (let i in this.stulstSelected){
        if (this.stulstSelected[i] == this.stu_new){
          flg = true;
          break;
        }
      }
      if (!flg)
        this.stulstSelected.push(this.stu_new);
      else
        dialogs.toasts.error("请不要重复报名");
      this.stu_new = undefined;
    },
    delFromList: function(i){
      this.stulstSelected.splice(i, 1);
    }
  },
};
</script>

<style scoped>
.v-card {
  margin: 0.3rem;
}
</style>