<template>
  <v-container>
    <v-card>
      <v-card-title>
        未审核感想列表
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
          :items="thoughts"
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
    <v-dialog v-model="dialog1" max-width="80%">
      <v-card>
        <v-card-title>详细信息</v-card-title>
        <v-simple-table style="margin:20px;">
          <tbody>
            <tr>
              <td>义工编号</td>
              <td>{{volid}}</td>
            </tr>
            <tr>
              <td>义工日期</td>
              <td>{{volDate}}</td>
            </tr>
            <tr>
              <td>义工时间</td>
              <td>{{volTime}}</td>
            </tr>
            <tr>
              <td>义工详细信息</td>
              <td>{{volDesc}}</td>
            </tr>
            <tr>
              <td>校内时长</td>
              <td>{{ timeToHint(volTI) }}</td>
            </tr>
            <tr>
              <td>校外时长</td>
              <td>{{ timeToHint(volTO) }}</td>
            </tr>
            <tr>
              <td>大型时长</td>
              <td>{{ timeToHint(volTL) }}</td>
            </tr>
            <tr>
              <td>学号</td>
              <td>{{stuid}}</td>
            </tr>
            <tr>
              <td>感想</td>
              <td>{{thought}}</td>
            </tr>
            <tr>
              <td>发放的校内时长（分钟）</td>
              <td><v-text-field
                v-model="inside"
                label="不填为默认值"
                prepend-icon="mdi-view-list"
              /></td>
            </tr>
            <tr>
              <td>发放的校外时长（分钟）</td>
              <td><v-text-field
                v-model="outside"
                label="不填为默认值"
                prepend-icon="mdi-view-list"
              /></td>
            </tr>
            <tr>
              <td>发放的大型时长（分钟）</td>
              <td><v-text-field
                v-model="large"
                label="不填为默认值"
                prepend-icon="mdi-view-list"
              /></td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="$store.state.isLoading"
            @click="audit(1)"
          >通过
          </v-btn>
          <v-btn
            color="red"
            :disabled="$store.state.isLoading"
            @click="audit(2)"
          >拒绝
          </v-btn>
          <v-btn
            color="yellow"
            :disabled="$store.state.isLoading"
            @click="audit(3)"
          >打回
          </v-btn>
          <v-btn
            color="primary"
            :disabled="$store.state.isLoading"
            @click="dialog1 = false"
          >取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import dialogs from "../../utils/dialogs.js";
import permissions from "../../utils/permissions";
import axios from "axios";
import zutils from "../../utils/zutils.js";

export default {
  data: () => ({
    search: "",
    headers: [
      { text: "义工编号", value: "volId", align: "start", sortable: true },
      { text: "学号", value: "stuId" },
    ],
    thoughts: undefined,
    dialog1: false,
    stuid: undefined,
    volid: undefined,
    thought: undefined,
    volTime: undefined,
    volDate: undefined,
    volDesc: undefined,
    volTI: undefined,
    volTO: undefined,
    volTL: undefined,
    inside: undefined,
    outside: undefined,
    large: undefined
  }),
  mounted: function () {
    this.pageload();
  },
  methods: {
    timeToHint: function (a){
        let hr = parseInt(a / 60);
        let mi = parseInt(a % 60);
        if (hr != 0)
            if (mi != 0)
                return hr + " 小时 " + mi + " 分钟";
            else
                return hr + " 小时 ";
        else
            return mi + "分钟";
    },
    async pageload() {
      await zutils.checkToken(this);
      this.$store.commit("loading", true);
      await axios
        .get("/volunteer/unaudited",{

        })
        .then((response) => {
          console.log(response.data);
          if (response.data.type == "SUCCESS") {
            dialogs.toasts.success(response.data.message);
            this.thoughts = response.data.result;
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
      this.$store.commit("loading", false);
    },
    granted: function () {
      return this.$store.state.info.permission < permissions.teacher;
    },
    rowClick: function (item) {
      this.dialog1 = true;
      this.volid = item.volId;
      this.stuid = item.stuId;
      this.thought = item.thought;
      
      this.$store.commit("loading", true);
      axios
        .get("/volunteer/fetch/"+this.volid,{
      
        })
        .then((response) => {
          console.log(response.data);
          if (response.data.type == "SUCCESS") {
            dialogs.toasts.success(response.data.message);
            this.volDate = response.data.date;
            this.volTime = response.data.time;
            this.volDesc = response.data.description;
            this.volTI = response.data.inside;
            this.volTO = response.data.outside;
            this.volTL = response.data.large;
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
      this.$store.commit("loading", false);
    },
    audit: function (status) {
      dialogs.confirm("",(value)=>{
          if (value){
            this.dialog1 = false;
            if(status==1){
              if(this.inside==undefined || this.inside=="")
                this.inside = this.volTI;
              if(this.outside==undefined || this.outside=="")
                this.outside = this.volTO;
              if(this.large==undefined || this.large=="")
                this.large = this.volTL;
            }else{
              this.inside = "0";
              this.outside = "0";
              this.large = "0";
            }
            console.log(status,this.inside,this.outside,this.large);
              this.$store.commit("loading", true);
            axios
              .post("/volunteer/audit/"+this.volid,{
                "thought": [{
                  "stuId": this.stuid,
                  "status": status,
                  "inside": this.inside,
                  "outside": this.outside,
                  "large": this.large
                }]
              })
              .then((response) => {
                  console.log(response.data);
                  if (response.data.type == "SUCCESS") {
                    dialogs.toasts.success(response.data.message);
                    this.volDate = response.data.date;
                    this.volTime = response.data.time;
                    this.volDesc = response.data.description;
                    this.volTI = response.data.inside;
                    this.volTO = response.data.outside;
                    this.volTL = response.data.large;
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
            this.$store.commit("loading", false);
            location.reload();
          }
      });
    }
  },
};
</script>

<style scoped>
.v-card {
  margin: 0.3rem;
}
</style>