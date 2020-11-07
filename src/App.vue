<template style="overflow-y: hidden;" id="win">
  <v-app
    style="
      background: url(https://api.dongmanxingkong.com/suijitupian/acg/1080p/index.php);
      background-size: cover;
      background-attachment: fixed;
      overflow-y: hidden;
    "
  >
    <v-system-bar
      app
      window
      color="primary"
      dark
      style="-webkit-app-region: drag"
      align-center
    >
      <span>{{hitokoto.hitokoto}} - {{hitokoto.from}}</span>
      <v-spacer></v-spacer>
      <v-icon
        @click="minwindow"
        color="white"
        style="-webkit-app-region: no-drag"
        >mdi-window-minimize</v-icon
      >
      <v-icon
        @click="maxwindow"
        color="white"
        style="-webkit-app-region: no-drag"
        >mdi-window-maximize</v-icon
      >
      <v-icon
        @click="closewindow"
        color="white"
        style="-webkit-app-region: no-drag; margin-right: 0"
        >mdi-close</v-icon
      >
    </v-system-bar>
    <v-navigation-drawer
      color="primary"
      expand-on-hover
      miniVariant
      app
      dark
      permanent
      style="backdrop-filter: blur(10px)"
    >
      <v-list nav dense class="py-0">
        <v-list-item two-line class="px-0">
          <v-list-item-avatar tile>
            <img src="./assets/logo.png" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>义工管理系统</v-list-item-title>
            <v-list-item-subtitle>内测版</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="item in $store.state.draweritems"
          :key="item.title"
          :to="item.to"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-3">
          <v-progress-circular
            color="white"
            indeterminate
            v-show="$store.state.isLoading"
          ></v-progress-circular>
        </div>
        <div class="pa-4">
          <v-icon
            @click="changeColorTheme"
            color="white"
            style="-webkit-app-region: no-drag; margin-right: 0"
            >mdi-brightness-6</v-icon
          >
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer
      dense
      absolute
      class="font-weight-light"
      padless
      color="rgba(255,255,255,0.3)"
    >
      <v-col class="text-center" cols="12"
        >{{ new Date().getFullYear() }} - ©mo_yi</v-col
      >
    </v-footer>
  </v-app>
</template>
<style>
::-webkit-scrollbar {
  width: 0px;
  height: 4px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0;
}
#drag {
  padding: 0;
  margin: 0;
}
</style>
<script>
import dialogs from "./utils/dialogs";
import axios from "axios";

const { BrowserWindow } = window.require("electron").remote;
export default {
  name: "App",
  data: () => ({
    activeBtn: 1,
    drawer: true,
    phone: false,
    hitokoto: {
      hitokoto: undefined,
      from: undefined,
      from_who: undefined
    }
  }),
  mounted: function () {
    this.getTheme();
    this.getHitokoto();
  },
  methods: {
    minwindow() {
      const window = BrowserWindow.getFocusedWindow();
      window.minimize();
    },
    maxwindow() {
      const window = BrowserWindow.getFocusedWindow();
      if (window.isMaximized()) {
        window.restore();
      } else {
        window.maximize();
      }
    },
    closewindow() {
      const window = BrowserWindow.getFocusedWindow();
      window.close();
    },
    getTheme() {
      this.$store.commit("loading", true);
      axios
        .get("https://zvms.gitee.io/config/theme.json")
        .then((response) => {
          this.$vuetify.theme.themes = response.data;
        })
        .catch((error) => {
          dialogs.toasts.error(error);
        })
        .finally(() => {this.$store.commit("loading", false);});
    },
    changeColorTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    getHitokoto(){
      this.$store.commit("loading", true);
      axios
        .get("https://v1.hitokoto.cn")
        .then((response) => {
          this.hitokoto.hitokoto = response.data.hitokoto;
          this.hitokoto.from = response.data.from;
          this.hitokoto.from_who = response.data.from_who;
        })
        .catch((error) => {
          dialogs.toasts.error(error);
        })
        .finally(() => {this.$store.commit("loading", false);})
    }
  },
};
</script>
