import Vue from 'vue';
import Vuex from 'vuex';
import actions from './action'
import getters from './getters'
import mutations from './mutations';

Vue.use(Vuex);

const state = {
  currentOrganId: null, // 档案管理--当前选中的部门id
  loginToken: null,
  loginUser: null, // 登录用户信息

  // 视频通话相关
  oAdd: {},
  oDel: {},
  stateHandler: {}, // 监听是否有状态改变，具体是哪一个通话的状态变化，从传入的通话对象来判断
  switchCall: {}, // 切换语音聊天
  callingList: [] // 通话状态下的人员列表，{}包含
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})