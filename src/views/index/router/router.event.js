 /* 事件板块 */
export default {
  path: '/event',
  name: 'event',
  component: () => import('@/views/index/components/event/event.vue'),
  redirect: {
    name: 'event_audit'
  },
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
    }, {
      path: 'editPlan',
      name: 'edit_plan',
      component: () => import('@/views/index/components/event/editPlan.vue')
    }, {
      path: 'ctcPlanDetail',
      name: 'ctc_plan_detail',
      component: () => import('@/views/index/components/event/ctcPlanDetail.vue')
    }, {
      path: 'ctcDetailInfo',
      name: 'ctc_detail_info',
      component: () => import('@/views/index/components/event/ctcDetailInfo.vue')
    }, {
      path: 'alarmCtcDetailInfo',
      name: 'alarm_ctc_detail_info',
      component: () => import('@/views/index/components/event/alarmCtcDetailInfo.vue')
    }, {
      path: 'ctcEnd',
      name: 'ctc_end',
      component: () => import('@/views/index/components/event/ctcEnd.vue')
    }
  ]
}