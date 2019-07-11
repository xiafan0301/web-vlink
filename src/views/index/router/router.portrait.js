 /* 研判模块 */
export default {
  path: '/portrait',
  name: 'portrait',
  component: () => import('@/views/index/components/portrait/portrait.vue'),
  redirect: { name: 'portrait_menu' },
  children: [
    {
      path: 'menu',
      name: 'portrait_menu',
      component: () => import('@/views/index/components/portrait/menu.vue')
    },
    // 身份确认
    {
      path: 'indenty',
      name: 'indenty_recog',
      component: () => import('@/views/index/components/portrait/identRecog/indenty.vue')
    },
    // 跟踪尾随
    {
      path: 'gzws',
      name: 'gzws_portrait',
      component: () => import('@/views/index/components/portrait/gzws/gzws.vue')
    },
    // 跟踪尾随分析结果
    {
      path: 'gzwsResult',
      name: 'gzws_result',
      component: () => import('@/views/index/components/portrait/gzws/result.vue')
    },
    // 跟踪尾随详情
    {
      path: 'gzwsDetail',
      name: 'gzws_detail',
      component: () => import('@/views/index/components/portrait/gzws/detail.vue')
    },
    {
      path: 'qyryfx', // 区域人员分析
      name: 'portrait_qyryfx',
      component: () => import('@/views/index/components/portrait/qyryfx.vue')
    },
    {
      path: 'pfcm',    //频繁出没
      name: 'portrait_pfcm',
      component: () => import('@/views/index/components/portrait/pfcm.vue')
    },
    {
      path: 'peer-analysis-list', // 同行分析列表
      name: 'peer_analysis_list',
      component: () => import('@/views/index/components/portrait/peer-analysis-list.vue')
    },
    {
      path: 'peer-analysis', // 同行分析
      name: 'peer_analysis',
      component: () => import('@/views/index/components/portrait/peer-analysis.vue')
    },
    {
      path: 'xjpfcm',     //新建分析任务
      name: 'portrait_xjpfcm',
      component: () => import('@/views/index/components/portrait/xjpfcm.vue')
    },
    {
      path: 'rlcx',
      name: 'portrait_rlcx',
      component: () => import('@/views/index/components/portrait/rlcx.vue')
    },
    {
      path: 'rxbd', // 人像比对
      name: 'portrait_rxbd',
      component: () => import('@/views/index/components/portrait/rxbd.vue')
    },
    {
      path: 'ytsr', // 意图搜人
      name: 'portrait_ytsr',
      component: () => import('@/views/index/components/portrait/ytsr.vue')
    },
    {
      path: 'gjfx', // 轨迹分析
      name: 'portrait_gjfx',
      component: () => import('@/views/index/components/portrait/gjfx.vue')
    }, {
      path: 'rlsjfx',
      name: 'portrait_rlsjfx',
      component: () => import('@/views/index/components/portrait/rlsjfx.vue')
    },{

      path: 'zdgz', // 重点关注
      name: 'portrait_zdgz',
      component: () => import('@/views/index/components/portrait/zdgz.vue')
    },
    {

      path: 'ljd', // 重点关注
      name: 'portrait_ljd',
      component: () => import('@/views/index/components/portrait/ljd.vue')
    },
    {
      path: 'fxjg',    //分析结果
      name: 'portrait_fxjg',
      component: () => import('@/views/index/components/portrait/fxjg.vue')
    },
    {
      path: 'reportnr',    //人员侦察报告内容
      name: 'portrait_nr',
      component: () => import('@/views/index/components/portrait/reportnr.vue')
    },
    {
      path: 'report',
      name: 'portrait_report',
      component: () => import('@/views/index/components/portrait/report.vue')
    }
  ]
}