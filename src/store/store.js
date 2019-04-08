import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';
import actions from './action'
import getters from './getters'
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  loginUser: null // 登录用户信息
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})