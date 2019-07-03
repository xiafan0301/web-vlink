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
      path: 'detail',
      name: 'gzws_detail',
      component: () => import('@/views/index/components/portrait/gzws/detail.vue')
    },
    {
      path: 'qyryfx', // 区域人员分析
      name: 'portrait_qyryfx',
      component: () => import('@/views/index/components/portrait/qyryfx.vue')
    },
    {
      path: 'pfcm',
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
      path: 'xjpfcm',
      name: 'portrait_xjpfcm',
      component: () => import('@/views/index/components/portrait/xjpfcm.vue')
    },
    {
      path: 'rlcx',
      name: 'portrait_rlcx',
      component: () => import('@/views/index/components/portrait/rlcx.vue')
    },
    {
      path: 'rlsjfx',
      name: 'portrait_rlsjfx',
      component: () => import('@/views/index/components/portrait/rlsjfx.vue')
    },{

      path: 'zdgz', // 重点关注
      name: 'portrait_zdgz',
      component: () => import('@/views/index/components/portrait/zdgz.vue')
    },
  ]
}