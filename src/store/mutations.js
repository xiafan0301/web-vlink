export default {
  setLoginUser (state, options) {
    state.loginUser = options.loginUser;
  },
  setLoginToken (state, options) {
    state.loginToken = options.loginToken;
  },
  setCurrentOrgan (state, options) {
    state.currentOrganObj = options.currentOrganObj;
  },

  // 视频通话
  // 新增通话
  ADD_WEBRTC (state, options) {
    let _obj = Object.assign({}, options.oAdd)
    let countTime = (data) => {
      data.timer = setInterval(() => {
        if (data.second < 59) {
          data.second += 1;
        } else {
          data.second = 0;
          data.minute += 1;
        }
      }, 1000)
    };
    let clearTime = (data) => {
      if (data.timer) {
        clearInterval(data.timer)
        data.timer = null;
      }
    };
    _obj.countTime = countTime;
    _obj.clearTime = clearTime;

    state.oAdd = _obj;
    state.callingList.push(_obj);
  },
  // 删除通话
  DEL_WEBRTC (state, data) {
    let _index = state.callingList.findIndex(x => x.uid === data.uid);
    if (_index !== -1) {
      state.callingList.splice(_index, 1);
    }
  },
  // 通话状态变化
  STATE_HANDLER (state, data) {
    state.stateHandler = data;
  },
  // 切换成语音聊天
  SWITCH_CALL (state, data) {
    state.switchCall = data;
  }
}