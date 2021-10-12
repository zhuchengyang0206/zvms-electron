import Vue from 'vue'
import App from './App.vue'
import router from './utils/router.js'
import store from './utils/store.js'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import NProgress from 'nprogress'
import './plugins/nprogress.css'

Vue.config.productionTip = false;

axios.defaults.baseURL = "http://172.31.2.2:5000";
// axios.defaults.baseURL = "http://localhost:5000";

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
		config.params = {
			...config.params,
			timestamp: Date.now()
		};
		config.headers.Authorization = store.state.token || '';
		return config
	},
	error => Promise.reject(error)
);

router.beforeEach((to, from, next) => {
	NProgress.start();
	if (to.path == '/report') next();
	else if (to.path != '/login') {
		if (store.state.token) {
			next();
		} else {
			next('login');
		}
	} else if(store.state.token){
		next('me');
	}else{
		next();
	}
})

router.afterEach(() => {
    NProgress.done()
})


NProgress.configure({     
    easing: 'ease',
    speed: 500,  
    showSpinner: false,    
    trickleSpeed: 200, 
    minimum: 0.3,
	color: 'F48FB1'
})

new Vue({
	router,
	vuetify,
	store,
	render: h => h(App)
}).$mount('#app')