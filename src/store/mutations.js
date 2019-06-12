export default {
  setLoginUser (state, options) {
    state.loginUser = options.loginUser;
  },
  setLoginToken (state, options) {
    state.loginToken = options.loginToken;
  },
  setCurrentOrgan (state, options) {
    state.currentOrganId = options.currentOrganId;
  }
}