import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'

// import 组件
Vue.use(Router)
export default new Router({
    mode: 'history',
    base: process.env.NODE_ENV === 'production' ? ('/' + process.env.VUE_APP_PROJECTNAME) : '',
    routes: [
        { path: '*', redirect: 'index' }, // 404
        { 
            path: '/',
            name: 'index',
            component: () => import('@/views/index/components/default.vue'),
        },
        { 
            path: '/login',
            name: 'login',
            component: () => import('@/views/index/components/login.vue'),
        }
    ]
})
