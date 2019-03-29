/*
* 通用引入，包含element-ui等
* */
import Vue from 'vue/dist/vue.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 2.0
import VueAwesomeSwiper from 'vue-awesome-swiper'
// require styles
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */)
// 项目公用样式
import '@/assets/css/style.css';
// import 全局filter
import '@/utils/filter.js';
// import 全局方法
import '@/utils/method.js';
// import 自定义shape for AntV/g2
import '@/utils/antv.shape.js';
// 混入
import '@/utils/mixins.js';
import store from '@/store/store.js'
// use element-ui
Vue.use(ElementUI);

const loginInfo = localStorage.getItem('as_vlink_user_info');

if (loginInfo) {
  store.commit('setLoginUser', {
    loginUser: JSON.parse(loginInfo)
  });
}
