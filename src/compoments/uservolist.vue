<template>
  <v-card flat>
    <v-card-title
      ><div class="headline">义工列表</div>
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
        :items="volworks"
        :search="search"
        :loading="$store.state.isLoading"
        @click:row="rowClick"
        loading-text="加载中..."
      >
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import dialogs from '../utils/dialogs';
import axios from "axios"

export default {
  name: 'uservolist',
  props: ['userid'],
  data: () => ({
    volworks: undefined,
    search: "",
    headers: [
      { text: "义工ID", value: "volId", align: "start", sortable: true },
      { text: "义工名称", value: "name" },
      { text: "校内时长", value: "inside" },
      { text: "校外时长", value: "outside" },
      { text: "大型时长", value: "large" },
      { text: "完成状态", value: "status" },
    ],
  }),
  created: function(){
    this.init();
  },
  methods: {
    init: function() {
      this.$store.commit("loading", true);
      this.volworks = undefined;
      if(this.userid != 0 && this.userid != undefined){
        axios
          .post("/user/volbook/"+this.userid)
          .then((response) => {
            console.log(response.data);
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
    rowClick: function(item) {
      console.log(item)
      dialogs.toasts.error("没做好，点你妈");
    }
  },
  watch: {
    userid: function(){
      this.init();
    }
  }
}
</script>
