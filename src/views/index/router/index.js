import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'

// import 组件
Vue.use(Router)
export default new Router({
    // mode: 'history',
    // base: '/' + (process.env && process.env.VUE_APP_PROJECTNAME) ? process.env.VUE_APP_PROJECTNAME : 'web',
    routes: [
        { path: '*', redirect: 'index' }, // 404
        { 
            path: '/',
            name: 'index',
            component: () => import('@/views/index/components/default.vue'),
        }
    ]
})
