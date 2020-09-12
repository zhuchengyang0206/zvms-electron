import Vue from 'vue'
import App from './App.vue'
import router from './utils/router.js'
import store from './utils/store.js'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import qs from 'querystring'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://localhost';
axios.defaults.withCredentials = true;
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