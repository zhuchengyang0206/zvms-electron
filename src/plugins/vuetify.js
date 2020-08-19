import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';


Vue.use(Vuetify)

const opts = {
  icons: {
    // iconfont: 'mdi',
    iconfont: 'fa'
  }
}
export default new Vuetify(opts)
