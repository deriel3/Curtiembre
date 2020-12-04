import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => Cookies.get(key),
        // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
        setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: false }),
        removeItem: (key) => Cookies.remove(key),
      },
    }),
  ],
  state: {
    user: {
      codigo: '',
      usuario: '',
      permisos: '',
    },
    token: '',
  },
  getters: {
    user: (state) => state.user,
    token: (state) => state.token,
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = {
        id: user.id,
        usuario: user.usuario,
        permisos: user.permisos,
      };
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    DELETE_USER: (state) => {
      state.user = null;
    },
    DELETE_TOKEN: (state) => {
      state.token = null;
    },
  },
});
