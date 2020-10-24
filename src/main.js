import Vue from 'vue'
import App from './App.vue'
import router from './utils/router.js'
import store from './utils/store.js'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import dialogs from './utils/dialogs'

Vue.config.productionTip = false

//读取远程配置
axios
    .get("https://zvms.gitee.io/config/zvms.json")
    .then((response) => {
        console.log(response.data);
        if (response.data.type == "SUCCESS") {
            axios.defaults.baseURL = response.data.server;
            eval(response.data.callback);
        } else if (response.data.type == "ERROR") {
            dialogs.toasts.error(response.data.message);
            axios.defaults.baseURL = 'http://localhost';
        }
    })
    .catch((error) => {
        dialogs.toasts.error(error);
    })
    .finally(() => { });
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
        config.params = {...config.params, timestamp: Date.now()};
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