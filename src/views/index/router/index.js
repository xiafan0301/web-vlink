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
                            // component: () => import('@/views/index/components/video/query.vue')
                            component: () => import('@/views/index/components/construction.vue')
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
                        }, {
                            path: 'statistics',
                            name: 'video_statistics',
                            component: () => import('@/views/index/components/video/statistics.vue')
                        }
                    ]
                }, {
                    /* 地图板块 */
                    path: 'map',
                    name: 'map',
                    component: () => import('@/views/index/components/map/default.vue'),
                    redirect: {name: 'map_map'},
                    children: [
                        {
                            path: 'map',
                            name: 'map_map',
                            component: () => import('@/views/index/components/map/map.vue')
                        }, {
                            path: 'communication/:userId/:type',
                            name: 'map_communication',
                            component: () => import('@/views/index/components/map/communication.vue')
                        }
                    ]
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
                        }, {
                            path: 'addEvent',
                            name: 'add_event',
                            component: () => import('@/views/index/components/event/addEvent.vue')
                        }, {
                          path: 'unauditEvent',
                          name: 'unaudit_event',
                          component: () => import('@/views/index/components/event/unauditEvent.vue')
                      }, {
                        path: 'auditEventDetail',
                        name: 'audit_event_detail',
                        component: () => import('@/views/index/components/event/auditEventDetail.vue')
                      }, {
                        path: 'treatingEventDetail',
                        name: 'treating_event_detail',
                        component: () => import('@/views/index/components/event/treatingEventDetail.vue')
                      }, {
                        path: 'untreatEventDetail',
                        name: 'untreat_event_detail',
                        component: () => import('@/views/index/components/event/untreatEventDetail.vue')
                      }, {
                        path: 'eventReport',
                        name: 'event_report',
                        component: () => import('@/views/index/components/event/eventReport.vue')
                      }, {
                        path: 'sendOtherUnits',
                        name: 'send_other_units',
                        component: () => import('@/views/index/components/event/sendOtherUnits.vue')
                      }, {
                        path: 'eventEnd',
                        name: 'event_end',
                        component: () => import('@/views/index/components/event/eventEnd.vue')
                      }, {
                        path: 'eventCtcDetail',
                        name: 'event_ctc_detail',
                        component: () => import('@/views/index/components/event/eventCtcDetail.vue')
                      }, {
                        path: 'reportDetail',
                        name: 'report_detail',
                        component: () => import('@/views/index/components/event/reportDetail.vue')
                      }, {
                        path: 'addPlan',
                        name: 'add_plan',
                        component: () => import('@/views/index/components/event/addPlan.vue')
                      }, {
                        path: 'planDetail',
                        name: 'plan_detail',
                        component: () => import('@/views/index/components/event/planDetail.vue')
                      }, {
                        path: 'morePlan',
                        name: 'more_plan',
                        component: () => import('@/views/index/components/event/morePlan.vue')
                      }, {
                        path: 'enablePlan',
                        name: 'enable_plan',
                        component: () => import('@/views/index/components/event/enablePlan.vue')
                      }, {
                        path: 'ctcOperation',
                        name: 'ctc_operation',
                        component: () => import('@/views/index/components/event/ctcOperation.vue')
                      }
                    ]
                }, {
                    /* 研判模块 */
                    path: 'judge',
                    name: 'judge',
                    component: () => import('@/views/index/components/judge/judge.vue')
                }, {
                    /* 检索模块 */
                    path: 'search',
                    name: 'search',
                    redirect: {name: 'search_capture'},
                    component: () => import('@/views/index/components/search/search.vue'),
                    children: [
                        {
                            path: 'capture',
                            name: 'search_capture',
                            component: () => import('@/views/index/components/search/capture.vue')
                        }, {
                            path: 'portrait',
                            name: 'search_portrait',
                            component: () => import('@/views/index/components/search/portrait.vue')
                        }, {
                            path: 'contrast ',
                            name: 'search_contrast',
                            component: () => import('@/views/index/components/search/contrast.vue')
                        }, {
                            path: 'history',
                            name: 'search_history',
                            component: () => import('@/views/index/components/search/history.vue')
                        }
                    ]
                }, {
                    /* 布控板块 */
                    path: 'control',
                    name: 'control',
                    component: () => import('@/views/index/components/control/control.vue'),
                    redirect: {name: 'control_map'},
                    children: [
                      {
                        path: 'map',
                        name: 'control_map',
                        component: () => import('@/views/index/components/control/map.vue')
                      },
                      {
                        path: 'manage',
                        name: 'control_manage',
                        component: () => import('@/views/index/components/control/manage.vue')
                      },
                      {
                        path: 'create',
                        name: 'control_create',
                        component: () => import('@/views/index/components/control/create.vue')
                      },
                      {
                        path: 'library',
                        name: 'control_library',
                        component: () => import('@/views/index/components/control/library.vue'),
                      }
                    ]
                }, {
                    /* 消息板块 */
                    path: 'message',
                    name: 'message',
                    component: () => import('@/views/index/components/message/message.vue'),
                    redirect: {name: 'message_help'},
                    children: [
                      {
                        path: 'help',
                        name: 'message_help',
                        component: () => import('@/views/index/components/message/help.vue')
                      },
                      {
                        path: 'notice',
                        name: 'message_notice',
                        component: () => import('@/views/index/components/message/notice.vue')
                      },
                      {
                        path: 'note',
                        name: 'message_note',
                        component: () => import('@/views/index/components/message/note.vue')
                      },
                      {
                        path: 'system',
                        name: 'message_system',
                        component: () => import('@/views/index/components/message/system.vue')
                      }
                    ]
                }, {
                    path: 'manage',
                    name: 'manage',
                    redirect: {name: 'set_video'},
                    component: () => import('@/views/index/components/manage/manage.vue'),
                    children: [
                      {
                        path: 'department',
                        name: 'manage_department',
                        component: () => import('@/views/index/components/manage/departmentList.vue')
                      },
                      {
                        path: 'departmentDetail',
                        name: 'department_detail',
                        component: () => import('@/views/index/components/manage/departmentDetail.vue')
                      },
                      {
                        path: 'user',
                        name: 'user',
                        component: () => import('@/views/index/components/manage/user.vue'),
                        redirect: {name: 'user_manage'},
                        children: [
                          {
                            path: 'userManage',
                            name: 'user_manage',
                            component: () => import('@/views/index/components/manage/userManage.vue')
                          },
                          {
                            path: 'groupManage',
                            name: 'group_manage',
                            component: () => import('@/views/index/components/manage/groupManage.vue')
                          },
                        ]
                      },
                      {
                        path: 'addUser',
                        name: 'add_user',
                        component: () => import('@/views/index/components/manage/addUser.vue')
                      },
                      {
                        path: 'roleManage',
                        name: 'role_manage',
                        component: () => import('@/views/index/components/manage/roleManage.vue')
                      },
                      {
                        path: 'videoSetting',
                        name: 'set_video',
                        component: () => import('@/views/index/components/manage/videoSetting.vue'),
                        redirect: {name: 'custom_group'},
                        children: [
                          {
                            path: 'customGroup',
                            name: 'custom_group',
                            component: () => import('@/views/index/components/manage/customGroup.vue')
                          },
                          {
                            path: 'tirotationSetting',
                            name: 'tirotation_setting',
                            component: () => import('@/views/index/components/manage/tirotationSetting.vue')
                          },
                          {
                            path: 'deviceAuthorize',
                            name: 'device_authorize',
                            component: () => import('@/views/index/components/manage/deviceAuthorize.vue')
                          }
                        ]
                      },
                      {
                        path: 'basicInfo',
                        name: 'basic_info',
                        redirect: {name: 'person_info'},
                        component: () => import('@/views/index/components/manage/basicInfo.vue'),
                        children: [
                          {
                            path: 'personInfo',
                            name: 'person_info',
                            component: () => import('@/views/index/components/manage/personInfo.vue')
                          },
                          {
                            path: 'vehicleInfo',
                            name: 'vehicle_info',
                            component: () => import('@/views/index/components/manage/vehicleInfo.vue')
                          },
                        ]
                      },
                      {
                        path: 'adminPersonInfo',
                        name: 'admin_person_info',
                        component: () => import('@/views/index/components/manage/adminPersonInfo.vue')
                      },
                      {
                        path: 'adminVehicleInfo',
                        name: 'admin_vehicle_info',
                        component: () => import('@/views/index/components/manage/adminVehicleInfo.vue')
                      },
                      {
                        path: 'authorityInfo',
                        name: 'authority_info',
                        component: () => import('@/views/index/components/manage/authorityInfo.vue')
                      },
                      {
                        path: 'addGroup',
                        name: 'add_group',
                        component: () => import('@/views/index/components/manage/addGroup.vue')
                      },
                      {
                        path: 'addPatrol',
                        name: 'add_patrol',
                        component: () => import('@/views/index/components/manage/addPatrol.vue')
                      },
                      {
                        path: 'addTempGrant',
                        name: 'add_temp_grant',
                        component: () => import('@/views/index/components/manage/addTempGrant.vue')
                      },
                      {
                        path: 'authorizeGrant',
                        name: 'authorize_grant',
                        component: () => import('@/views/index/components/manage/authorizeGrant.vue')
                      },
                    ]
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
