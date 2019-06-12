import Vue from 'vue';
import Vuex from 'vuex';
import actions from './action'
import getters from './getters'
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  currentOrganId: null, // 档案管理--当前选中的部门id
  loginToken: null,
  loginUser: null // 登录用户信息
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})