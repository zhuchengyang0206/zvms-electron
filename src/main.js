import Vue from 'vue'
import App from './App.vue'
import router from './utils/router.js'
import store from './utils/store.js'
import vuetify from './plugins/vuetify'
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost';

new Vue({
    router,
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app')