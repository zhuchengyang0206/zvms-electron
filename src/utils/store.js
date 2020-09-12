import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLogined: false,
        isLoading: false,
        draweritems: [
            { title: '登录', to: '/login', icon: 'mdi-account-circle' },
        ]
    },
    mutations: {
        loading: (state, payload) => {
            state.isLoading = payload
        },
        draweritems: (state, payload) => {
            state.draweritems = payload
        }
    },
    plugins: [createPersistedState()]
});