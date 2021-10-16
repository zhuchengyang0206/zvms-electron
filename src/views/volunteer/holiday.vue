<template>
  <v-container>
    <v-card>
      <v-card-title>假期义工统一提交</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="form.name"
            :rules="rules"
            label="义工名称"
            prepend-icon="mdi-pen"
          />
          
          <v-dialog
            ref="dateDialog"
            v-model="modalDate"
            :return-value.sync="form.date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.date"
                label="义工日期"
                :rules="rules"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="form.date" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalDate = false">
                取消
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dateDialog.save(form.date)"
              >
                确认
              </v-btn>
            </v-date-picker>
          </v-dialog>
          <v-dialog
            ref="timeDialog"
            v-model="modalTime"
            :return-value.sync="form.time"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="form.time"
                label="义工时间"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                :rules="rules"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker v-if="modalTime" v-model="form.time" full-width>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modalTime = false">
                取消
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.timeDialog.save(form.time)"
              >
                确定
              </v-btn>
            </v-time-picker>
          </v-dialog>

          <v-simple-table>
            <thead>
              <td>学号</td>
              <td>删除</td>
            </thead>
            <tbody>
              <tr
                v-for="(stuid ,i) in form.stuSelected"
                :key="i"
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
                    v-model="stuNew"
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

          <v-text-field
            v-model="form.ftp"
            :rules="rules"
            label="义工证明材料（请上传到ftp并输入ftp地址）"
            prepend-icon="mdi-pen"
          />
          
          <v-text-field
            v-model="form.description"
            :rules="rules"
            label="义工描述"
            prepend-icon="mdi-pen"
          />
          
          <v-text-field
            v-model="form.inside"
            :rules="rules"
            label="校内义工时长（分钟）"
            prepend-icon="mdi-pen"
          />
          
          <v-text-field
            v-model="form.outside"
            :rules="rules"
            label="校外义工时长（分钟）"
            prepend-icon="mdi-pen"
          />

          <v-text-field
            v-model="form.large"
            :rules="rules"
            label="大型活动义工时长（分钟）"
            prepend-icon="mdi-pen"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
            <v-btn
          text
          color="primary"
          @click="submit"
        >
          提交
            </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import dialogs from "../../utils/dialogs.js";
import zutils from "../../utils/zutils.js";
import { NOTEMPTY } from "../..//utils/validation.js";
import axios from "axios";

export default {
  data: () => ({
    modalDate: false,
    modalTime: false,
    stulst: [],
    stuNew: undefined,
    mp: {},
    form: {
      name: undefined,
      date: undefined,
      time: null,
      stuSelected: [],
      ftp: undefined,
      description: undefined,
      inside: undefined,
      outside: undefined,
      large: undefined
    },
    rules: [NOTEMPTY()]
  }),
  mounted: function () {
    this.pageload();
  },
  methods: {
    async pageload() {
      this.$store.commit("loading", true);
      await zutils.checkToken(this);
      await zutils.fetchStudentList(this.$store.state.info.class, (stulst) => {
        stulst
          ? (this.stulst = stulst)
          : dialogs.toasts.error("获取学生列表失败");
      });
      for(let i = 0; i < this.stulst.length; i ++)
        this.mp[this.stulst[i].id] = this.stulst[i].name;
      this.$store.commit("loading", false);
      console.log(this.stulst);
    },
    addToList: function (){
      let flg = false;
      if (this.stuNew == "" || this.stuNew == undefined) flg = true;
      for (let i in this.form.stuSelected){
        if (this.form.stuSelected[i] == this.stuNew){
          flg = true;
          break;
        }
      }
      // console.log(this.stuSelected,this.stuNew);
      if (!flg)
        this.form.stuSelected.push(this.stuNew);
      else
        dialogs.toasts.error("请不要重复报名");
      this.stuNew = "";
    },
    delFromList: function(i){
      this.form.stuSelected.splice(i, 1);
    },
    submit: function(){
      if (this.form.stuSelected.length == 0){
        dialogs.toasts.error("报名学生列表为空");
        return;
      }
      this.$store.commit("loading", true);
      axios
        .post("/volunteer/holiday",{
          name: this.form.name,
          date: this.form.date,
          time: this.form.time,
          stuId: this.form.stuSelected,
          description: "假期义工：" + this.form.ftp + "；" + this.form.description,
          inside: parseInt(this.form.inside),
          outside: parseInt(this.form.outside),
          large: parseInt(this.form.large),
        })
        .then((response) => {
          // console.log(response.data);
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

<style scoped>
.v-card {
  margin: 0.3rem;
}
</style>