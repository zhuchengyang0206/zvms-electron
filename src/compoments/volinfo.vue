<template>
  <v-card flat>
    <v-card-title>
      {{vol.name}}
    </v-card-title>
    <v-card-text>
      简介: {{vol.description}}
      日期: {{vol.date}}
      实践: {{vol.time}}
      校内: {{vol.inside}}
      校外: {{vol.outside}}
      大型: {{vol.large}}
      人数: {{vol.stuMax}}
      现有: {{vol.stuNow}}
      状态: {{vol.status}}
    </v-card-text>
  </v-card>
</template>

<script>
import dialogs from '../utils/dialogs';
import axios from "axios"

export default {
  name: 'volinfo',
  props: ['volid'],
  data: () => ({
    vol: {
      type: undefined,
      message: undefined,
      name: undefined,
      date: undefined,
      time: undefined,
      stuMax: undefined,
      stuNow: undefined,
      description: undefined,
      status: undefined,
      inside: undefined,
      outside: undefined,
      large: undefined
    }
  }),
  created: function(){
    this.init();
  },
  methods: {
    init: function() {
      if(this.volid != 0 && this.volid != undefined){
        this.$store.commit("loading", true);
        axios
          .post("/volunteer/fetch/"+this.volid+"?"+Math.random())
          .then((response) => {
            console.log(response.data);
            if (response.data.type == "ERROR")
              dialogs.toasts.error(response.data.message);
            else if (response.data.type == "SUCCESS") {
              this.vol = response.data;
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
    fetch: function(){
      this.vol = {
      type: undefined,
      message: undefined,
      name: undefined,
      date: undefined,
      time: undefined,
      stuMax: undefined,
      stuNow: undefined,
      description: undefined,
      status: undefined,
      inside: undefined,
      outside: undefined,
      large: undefined
    }
    this.init();
    }
  },
  watch: {
    volid: function(){
      this.fetch();
    }
  }
}
</script>
