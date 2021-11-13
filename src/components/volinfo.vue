<template>
  <v-card flat :loading="$store.state.isLoading">
    <v-card-title>
      {{ vol.name }}
    </v-card-title>
    <v-simple-table dense>
      <tbody>
        <tr>
          <td>简介</td>
          <td>{{ vol.description }}</td>
        </tr>
        <tr>
          <td>日期</td>
          <td>{{ vol.date }}</td>
        </tr>
        <tr>
          <td>时间</td>
          <td>{{ vol.time }}</td>
        </tr>
        <tr>
          <td>校内时长</td>
          <td>{{ timeToHint(vol.inside) }}</td>
        </tr>
        <tr>
          <td>校外时长</td>
          <td>{{ timeToHint(vol.outside) }}</td>
        </tr>
        <tr>
          <td>大型时长</td>
          <td>{{ timeToHint(vol.large) }}</td>
        </tr>
        <tr>
          <td>人数</td>
          <td>{{ vol.stuMax }}</td>
        </tr>
        <tr>
          <td>已报名</td>
          <td>{{ vol.stuNow }}</td>
        </tr>
        <tr>
          <td>状态</td>
          <td>{{ vol.status }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
import dialogs from "../utils/dialogs";
import axios from "axios";

export default {
  name: "volinfo",
  props: ["volid"],
  data: () => ({
    vol: {
      type: undefined,
      message: undefined,
      name: "加载中...",
      date: undefined,
      time: undefined,
      stuMax: undefined,
      stuNow: undefined,
      description: undefined,
      status: undefined,
      inside: undefined,
      outside: undefined,
      large: undefined,
    },
  }),
  created: function () {
    this.init();
  },
  methods: {
	timeToHint: function (a){
		let hr = parseInt(a / 60);
		let mi = a % 60;
		if (hr != 0)
			return hr + " 小时 " + mi + " 分钟";
		else
			return mi + "分钟";
	},
    init: function () {
      if (this.volid != 0 && this.volid != undefined) {
        this.$store.commit("loading", true);
        axios
          .get("/volunteer/fetch/" + this.volid)
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
    fetch: function () {
      this.vol = {
        type: undefined,
        message: undefined,
        name: "加载中...",
        date: undefined,
        time: undefined,
        stuMax: undefined,
        stuNow: undefined,
        description: undefined,
        status: undefined,
        inside: undefined,
        outside: undefined,
        large: undefined,
      };
      this.init();
    },
  },
  watch: {
    volid: function () {
      this.fetch();
    },
  },
};
</script>
