import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'

// import 组件
Vue.use(Router)
export default new Router({
    // mode: 'history',
    base: process.env.NODE_ENV === 'production' ? ('/' + process.env.VUE_APP_PROJECTNAME) : '',
    routes: [
        { path: '*', redirect: {name: 'index'} }, // 404
        { 
            path: '/',
            name: 'index',
            component: () => import('@/views/index/components/default.vue'),
            redirect: {name: 'video'},
            children: [
                {
                    /* 视频板块 */
                    path: 'video',
                    name: 'video',
                    component: () => import('@/views/index/components/video/video.vue'),
                    redirect: {name: 'video_patrol'},
                    children: [
                        {
                            path: 'patrol',
                            name: 'video_patrol',
                            component: () => import('@/views/index/components/video/patrol.vue')
                        }, {
                            path: 'playback',
                            name: 'video_playback',
                            component: () => import('@/views/index/components/video/playback.vue')
                        }, {
                            path: 'query',
                            name: 'video_query',
                            component: () => import('@/views/index/components/video/query.vue')
                        }, {
                            path: 'signList',
                            name: 'video_signList',
                            component: () => import('@/views/index/components/video/signList.vue')
                        }, {
                            path: 'download',
                            name: 'video_download',
                            component: () => import('@/views/index/components/video/download.vue')
                        }, {
                            path: 'setting',
                            name: 'video_setting',
                            component: () => import('@/views/index/components/video/setting.vue')
                        }
                    ]
                }, {
                    /* 地图板块 */
                    path: 'map',
                    name: 'map',
                    component: () => import('@/views/index/components/map/map.vue')
                }, {
                    /* 事件板块 */
                    path: 'event',
                    name: 'event',
                    component: () => import('@/views/index/components/event/event.vue'),
                    redirect: {name: 'event_audit'},
                    children: [
                        {
                            path: 'audit',
                            name: 'event_audit',
                            component: () => import('@/views/index/components/event/audit.vue')
                        }, {
                            path: 'manage',
                            name: 'event_manage',
                            component: () => import('@/views/index/components/event/manage.vue')
                        }, {
                            path: 'ctc',
                            name: 'event_ctc',
                            component: () => import('@/views/index/components/event/ctc.vue')
                        }, {
                            path: 'ctcplan',
                            name: 'event_ctcplan',
                            component: () => import('@/views/index/components/event/ctcplan.vue')
                        }, {
                            path: 'statistics',
                            name: 'event_statistics',
                            component: () => import('@/views/index/components/event/statistics.vue')
                        }
                    ]
                }, { 
                    path: 'judge',
                    name: 'judge',
                    component: () => import('@/views/index/components/judge/judge.vue')
                }, {
                    path: 'search',
                    name: 'search',
                    component: () => import('@/views/index/components/search/search.vue')
                }, {
                    path: 'control',
                    name: 'control',
                    component: () => import('@/views/index/components/control/control.vue')
                }, {
                    path: 'message',
                    name: 'message',
                    component: () => import('@/views/index/components/message/message.vue')
                }, {
                    path: 'manage',
                    name: 'manage',
                    component: () => import('@/views/index/components/manage/manage.vue')
                }
            ]
        },
        { 
            path: '/login',
            name: 'login',
            component: () => import('@/views/index/components/login.vue')
        },
        { 
            path: '/register',
            name: 'register',
            component: () => import('@/views/index/components/register.vue')
        },
        { 
            path: '/findPwd',
            name: 'findPwd',
            component: () => import('@/views/index/components/findPwd.vue')
        }
    ]
})
