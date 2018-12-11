/*
* 通用引入，包含element-ui等
* */
import Vue from 'vue/dist/vue.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 2.0
// 项目公用样式
import '@/assets/css/style.css';
// import 全局filter
import '@/utils/filter.js';
// import 全局方法
import '@/utils/method.js';
// use element-ui
Vue.use(ElementUI);
