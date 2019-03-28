import Vue from 'vue/dist/vue.js'
// import Vue from 'vue/dist/vue.js'
import App from '@/components/App.vue'
// axios
import '@/config/axios.js';
// router
import router from './router/index.js'
// include
import '@/config/include.js'
// 自定义滚动条
import vuescroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css';

// include
// import '@/config/include.js';
import store from '@/store/store.js';

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
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});

// var history = require('connect-history-api-fallback')
// App.use(history({
//     rewrites: [
//         { from: 'index', to: '/index.html'}, // 默认入口
//         { from: 'ecc', to: '/ecc.html'} // 其他入口
//     ]
// }))
