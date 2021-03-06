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
// 布控板块 router
import routerControl from './router.control.js'
// 消息板块 router
import routerMessage from './router.message.js'
// 告警板块 router
import routerAlarm from './router.alarm.js'
// 管理板块 router
import routerManage from './router.manage.js'
// 任务板块 router
import routerTask from './router.task.js'
// 车辆侦察 router
import routerVehicle from './router.vehicle.js'
// 车辆侦察 router
import routerPortrait from './router.portrait.js'

Vue.use(VueRouter)
const router = new VueRouter({
  // mode: 'history',
  base: process.env.NODE_ENV === 'production' ? ('/' + process.env.VUE_APP_PROJECTNAME) : '',
  routes: [{
      path: '*',
      redirect: { name: 'index' }
    }, // 404
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/index/components/default.vue'),
      redirect: { name: 'vehicle' },
      children: [
        routerVideo,
        routerMap,
        routerEvent,
        routerControl,
        routerMessage,
        routerAlarm,
        routerManage,
        routerTask,
        routerVehicle,
        routerPortrait
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
      path: '/share',
      name: 'share',
      meta: { unrequireLogin: true },
      component: () => import('@/views/index/components/appshare/share.vue')
    }, {
      path: '/vehicle-report-save',
      name: 'vehicle_report_save',
      meta: { unrequireLogin: true },
      component: () => import('@/views/index/components/vehicle/analysis/reportSave.vue')
    },  {
      path: '/reportnrsave',    //人员侦察报告内容
      name: 'portrait_save',
      meta: { unrequireLogin: true },
      component: () => import('@/views/index/components/portrait/reportnrsave.vue')
    },{
      path: '/video-relay-map',
      name: 'video_relay_map',
      meta: { unrequireLogin: true },
      component: () => import('@/views/index/components/video/relay-map.vue')
    },
    // 截屏 跳转的页面
    {
      path: '/cut-ytsr-moment',  // 以图搜人
      name: 'cut_ytsr_moment',
      meta: { unrequireLogin: true },
      component: () => import('@/views/index/components/portrait/ytsr-moment.vue')
    },
    {
      path: '/cut-ytsc',  // 以图搜车
      name: 'cut_vehicle_search_ytsc',
      meta: { unrequireLogin: true },
      component: () => import('@/views/index/components/vehicle/search/ytsc.vue')
    },
    {
      path: '/cut-tzsc',  // 特征搜车
      name: 'cut_vehicle_search_tzsc',
      meta: { unrequireLogin: true },
      component: () => import('@/views/index/components/vehicle/search/tzsc.vue')
    },
    {
      path: '/cut-clgj',  // 车辆轨迹分析
      name: 'cut_vehicle_analysis_clgj',
      meta: { unrequireLogin: true },
      component: () => import('@/views/index/components/vehicle/analysis/clgj.vue')
    },
    {
      path: '/cut-rlcx',  // 特征搜人
      name: 'cut_portrait_rlcx',
      meta: { unrequireLogin: true },
      component: () => import('@/views/index/components/portrait/rlcx.vue')
    },
    {
      path: '/cut-gjfx',  // 人像轨迹分析
      name: 'cut_portrait_gjfx',
      meta: { unrequireLogin: true },
      component: () => import('@/views/index/components/portrait/gjfx.vue')
    },
  ]
})
router.beforeEach((to, from, next) => {
  // 判断该路由是否不需要登录权限
  console.log(to, from)
  if (to.meta && to.meta.unrequireLogin) {
    // 不需要登陆，直接走
    next()
  } else {
    // 需要登陆
    // 通过vuex state获取当前的token是否存在
    if (store.state.loginToken) {
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