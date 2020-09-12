import Vue from 'vue'
import App from './App.vue'
import router from './utils/router.js'
import store from './utils/store.js'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import qs from 'querystring'

Vue.config.productionTip = false

//远程服务器地址
axios.defaults.baseURL = 'http://localhost';
//axios携带cookie
axios.defaults.withCredentials = true;
//post设定，自动序列化表单的json数据
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data){
    data = qs.stringify(data);
    return data;
}]

new Vue({
    router,
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app')