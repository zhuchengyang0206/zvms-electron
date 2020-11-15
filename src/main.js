import Vue from 'vue'
import App from './App.vue'
import router from './utils/router.js'
import store from './utils/store.js'
import vuetify from './plugins/vuetify'
import axios from 'axios'

Vue.config.productionTip = false;

//axios携带cookie
axios.defaults.withCredentials = true;
//post设定，自动序列化表单的json数据
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//如果要把表单数据转化为url格式就去掉注释
// axios.defaults.transformRequest = [function (data){
//     data = qs.stringify(data);
//     return data;
// }]
axios.interceptors.request.use(
	config => {
		config.params = { ...config.params,
			timestamp: Date.now()
		};
		config.headers.Authorize = localStorage.getItem('token') || '';
		return config
	},
	error => Promise.reject(error)
);

new Vue({
	router,
	vuetify,
	store,
	render: h => h(App)
}).$mount('#app')