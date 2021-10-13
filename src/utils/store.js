import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
    //用于保存状态的store
    state: {
        isLogined: false,
        isLoading: false,
        token: undefined,
        info: {
            username: undefined,
            permission: undefined,
            class: undefined,
            classname: undefined
        },
        draweritems: [
            { title: '登录', to: '/login', icon: 'mdi-account-circle' },
            { title: "反馈错误", to: "/report", icon: "mdi-alert" }
        ]
    },

    //传值操作
    mutations: {
        loading: (state, payload) => {
            state.isLoading = payload
        },
        info: (state, payload) => {
            state.info = payload
        },
        login: (state, payload) => {
            state.isLogined = payload
        },
        draweritems: (state, payload) => {
            state.draweritems = payload
        },
        token: (state, payload) => {
            state.token = payload
        }
    },
    plugins: [createPersistedState()]
});