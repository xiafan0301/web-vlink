import Vue from 'vue/dist/vue.js'
// import Vue from 'vue/dist/vue.js'
import App from '@/components/App.vue'
// axios
import '@/config/axios.js';
// router
import router from './router/index.js'
// include
import '@/config/include.js'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
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
