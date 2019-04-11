import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../../../store/store'
/* import routers */
// 视频模块 router
import routerVideo from './router.video.js'
// 地图板块 router
import routerMap from './router.map.js'
// 事件板块 router
import routerEvent from './router.event.js'
// 研判模块 router
import routerJudge from './router.judge.js'
// 检索模块 router
import routerSearch from './router.search.js'
// 布控板块 router
import routerControl from './router.control.js'
// 消息板块 router
import routerMessage from './router.message.js'
// 告警板块 router
import routerAlarm from './router.alarm.js'
// 事件板块 router
import routerManage from './router.manage.js'

Vue.use(VueRouter)
const router = new VueRouter({
  // mode: 'history',
  base: process.env.NODE_ENV === 'production' ? ('/' + process.env.VUE_APP_PROJECTNAME) : '',
  routes: [{
      path: '*',
      redirect: {
        name: 'index'
      }
    }, // 404
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/index/components/default.vue'),
      redirect: {
        name: 'video'
      },
      children: [
        routerVideo,
        routerMap,
        routerEvent,
        routerJudge,
        routerSearch,
        routerControl,
        routerMessage,
        routerAlarm,
        routerManage
      ]
    }, {
      path: '/login',
      name: 'login',
      component: () => import('@/views/index/components/login.vue'),
      // 添加该字段，表示进入这个路由是不需要登录的
      meta: {
        unrequireLogin: true
      }
    }, {
      path: '/register',
      name: 'register',
      component: () => import('@/views/index/components/register.vue'),
      meta: {
        unrequireLogin: true
      }
    }, {
      path: '/findPwd',
      name: 'findPwd',
      component: () => import('@/views/index/components/findPwd.vue'),
      meta: {
        unrequireLogin: true
      }
    }, {
      path: '/player',
      name: 'player',
      component: () => import('@/components/common/rtmpplayer.vue')
    }
  ]
})
router.beforeEach((to, from, next) => {
  // 判断该路由是否不需要登录权限
  if (to.meta && to.meta.unrequireLogin) {
    // 不需要登陆，直接走
    next()
  } else {
    // 需要登陆
    // 通过vuex state获取当前的token是否存在
    if (store.state.loginUser) {
      next()
    } else {
      next({
        name: 'login',
        // query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    } 
  }
})
export default router