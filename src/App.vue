<template style="overflow-y: hidden;" id="win">
  <v-app
    style="
      background: url(https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fphoto.tuchong.com%2F16667757%2Ff%2F1152125355.jpg&refer=http%3A%2F%2Fphoto.tuchong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1631932457&t=5662d318816fc73507d495f273b42ad5);
      background-size: cover;
      background-attachment: fixed;
      overflow-y: hidden;
    "
  >
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
            <v-list-item-subtitle>内测</v-list-item-subtitle>
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
        >{{ new Date().getFullYear() }} - © mo_yi &amp; Zecyel &amp; fpc7519</v-col
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
export default {
  name: "App",
  data: () => ({
    activeBtn: 1,
    drawer: true,
    phone: false,
  }),
  mounted: function () {
  },
  methods: {
    changeColorTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>