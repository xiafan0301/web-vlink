import Vue from 'vue';
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
Vue.mixin(mixin);

/*
* 定义需要公用插入组件的方法，
* 使用是直接this.testOne()，即可
* */
const testMxin = {
  methods: {
    testOne () {
      console.log('随便来点')
    }
  }
}

export {testMxin}