import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLogined: false,
        isLoading: false,
    },
    mutations: {
        loading: (state, payload) => {
            state.isLoading = payload
        }
    },
    plugins: [createPersistedState()]
});