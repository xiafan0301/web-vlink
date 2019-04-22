import Vue from 'vue';
import Vuex from 'vuex';
import actions from './action'
import getters from './getters'
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  loginToken: null,
  loginUser: null // 登录用户信息
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})