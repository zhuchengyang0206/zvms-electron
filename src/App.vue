<template style="overflow-y: hidden;" id="win">
	<!--<v-app style="
		background: url(https://api.dongmanxingkong.com/suijitupian/acg/1080p/index.php);
		https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture
		background-size: cover;
		background-attachment: fixed;
		overflow-y: hidden;"
	>-->
	<v-app style="
		background: url(https://api.dongmanxingkong.com/suijitupian/acg/1080p/index.php);
		background-size: cover;
		background-attachment: fixed;
		overflow-y: hidden;"
	>
	<v-system-bar window color="primary" app style="-webkit-app-region: drag;">
		<span>ZVMS</span>
		<v-spacer></v-spacer>
		<v-icon @click="minwindow" color="white" style="-webkit-app-region: no-drag;">mdi-window-minimize</v-icon>
		<v-icon @click="maxwindow" color="white" style="-webkit-app-region: no-drag;">mdi-window-maximize</v-icon>
		<v-icon @click="closewindow" color="white" style="-webkit-app-region: no-drag; margin-right: 0;">mdi-close</v-icon>
	</v-system-bar>
    <v-navigation-drawer color="primary" expand-on-hover miniVariant app dark permanent style="backdrop-filter: blur(10px);">
      <v-list nav dense class="py-0">
        <v-list-item two-line class="px-0">
          <v-list-item-avatar tile>
            <img src="./assets/logo.png">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>ZVMS</v-list-item-title>
            <v-list-item-subtitle>β-1.0</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
          <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
      </v-list>
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
		color=rgba(255,255,255,0.3)
	>
		<v-col
			class="text-center"
			cols="12"
		>
        ©mo_yi 2020
		</v-col>
    </v-footer>
  </v-app>
</template>
<style>
::-webkit-scrollbar{width:0px;height:4px}
::-webkit-scrollbar-button{width:0px;height:0}
#drag{
	padding: 0;
	margin: 0;
}
</style>
<script>
	//import {remote} from "electron";
	const { BrowserWindow } = window.require('electron').remote;
	export default {
		name: 'App',
		data: () => ({
		activeBtn: 1,
		drawer: true,
		phone: false,
		items: [
			//{ title: '主页', to: '/', icon: 'mdi-home' },
			{ title: '登录', to: '/login', icon: 'mdi-account-circle' },
		],
		}),
		methods:{
			minwindow(){
				const window = BrowserWindow.getFocusedWindow();
				window.minimize();
			},
			maxwindow(){
				const window = BrowserWindow.getFocusedWindow();
				if(window.isMaximized()){window.restore()}
				else{window.maximize()}
				
			},
			closewindow(){
				const window = BrowserWindow.getFocusedWindow();
				window.close();
			}
		}
	}
</script>
