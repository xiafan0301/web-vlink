import Vue from 'vue/dist/vue.js';
const mixin = {
  data () {
    return {
      $_loading: false,
      $_loadingObj: null
    }
  },
  methods: {
    $_hideLoading () {
      if (this.$_loading) {
        this.$_loadingObj.close()
        this.$_loading = false
      }
    },
    $_showLoading (options = {}) {
      if (!this.$_loading) {
        this.$_loadingObj = this.$loading({
          lock: true,
          text: options.text || 'Loading',
          target: options.target || 'document.body',
          spinner: 'el-icon-loading',
          fullscreen: options.target ? false : true,
          background: options.background || 'rgba(0, 0, 0, 0.3)'
        })
        this.$_loading = true
      }
    }
  }
}
Vue.mixin(mixin)