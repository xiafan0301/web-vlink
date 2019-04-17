 /* 告警板块 */
export default {
  path: '/alarm',
  name: 'alarm',
  component: () => import('@/views/index/components/alarm/alarm.vue'),
  redirect: {
    name: 'today_alarm'
  },
  children: [{
      path: 'today',
      name: 'today_alarm',
      component: () => import('@/views/index/components/alarm/today.vue')
    },
    {
      path: 'history',
      name: 'history_alarm',
      component: () => import('@/views/index/components/alarm/history.vue')
    },
    {
      path: 'statistics',
      name: 'alarm_statistics',
      component: () => import('@/views/index/components/alarm/statistics.vue')
    }
  ]
}