import Vue from 'vue'
// import Vue from 'vue/dist/vue.js'
import App from '@/components/App.vue'
// include
import '@/config/include.js'
// router
import router from '@/views/index/router/index.js'
// 自定义滚动条
import vuescroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css';
// include
// import '@/config/include.js';
import store from '@/store/store.js';
// axios
import '@/config/axios.js';

Vue.use(vuescroll, {
  ops: {
    // 滚动条滚动的地方
    rail: {
      size: '6px',
      opacity: 0
    },
    // 滚动条
    bar: {
      background: '#CCC',
      onlyShowBarOnScroll: false
      // keepShow: true
    }
  }
});
Vue.config.productionTip = false

/* eslint-disable no-new */
// runtime模式（运行时）
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")

// compiler（模板）模式
/* new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
}); */