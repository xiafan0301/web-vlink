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
                    path: 'map',
                    name: 'map',
                    component: () => import('@/views/index/components/map/map.vue')
                }, {
                    path: 'event',
                    name: 'event',
                    component: () => import('@/views/index/components/event/event.vue')
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
