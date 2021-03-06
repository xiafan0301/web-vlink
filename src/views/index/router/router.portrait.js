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
      path: 'qyryfx-result', // 区域人员分析结果页
      name: 'portrait_qyryfx_result',
      component: () => import('@/views/index/components/portrait/qyryfx-result.vue')
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
      path: 'peer-analysis-result', // 同行分析
      name: 'peer_analysis_result',
      component: () => import('@/views/index/components/portrait/peer-analysis-result.vue')
    },
    {
      path: 'peer-analysis-record', // 同行分析记录
      name: 'peer_analysis_record',
      component: () => import('@/views/index/components/portrait/peer-analysis-record.vue')
    },
    {
      path: 'xjpfcm',     //新建分析任务
      name: 'portrait_xjpfcm',
      component: () => import('@/views/index/components/portrait/xjpfcm.vue')
    },
    {
      path: 'rlcx',    // 特征搜人
      name: 'portrait_rlcx',
      component: () => import('@/views/index/components/portrait/rlcx.vue')
    },
    {
      path: 'rxbd', // 人像比对
      name: 'portrait_rxbd',
      component: () => import('@/views/index/components/portrait/rxbd.vue')
    },
    {
      path: 'ytsr', // 以图搜人-结果
      name: 'portrait_ytsr',
      component: () => import('@/views/index/components/portrait/ytsr.vue')
    },
    {
      path: 'ytsr_shot', // 以图搜人-抓拍库搜索的结果
      name: 'portrait_ytsr_shot',
      component: () => import('@/views/index/components/portrait/ytsr-shot.vue')
    },
    {
      path: 'ytsr_moment', // 以图搜人-实时
      name: 'portrait_ytsr_moment',
      component: () => import('@/views/index/components/portrait/ytsr-moment.vue')
    },
    {
      path: 'gjfx', // 轨迹分析
      name: 'portrait_gjfx',
      component: () => import('@/views/index/components/portrait/gjfx.vue')
    },
    {
      path: 'gjfx_jg', // 轨迹分析结果
      name: 'portrait_gjfx_jg',
      component: () => import('@/views/index/components/portrait/gjfx-jg.vue')
    },
    {
      path: 'rlsjfx',
      name: 'portrait_rlsjfx',
      component: () => import('@/views/index/components/portrait/rlsjfx.vue')
    },{

      path: 'zdgz', // 重点关注
      name: 'portrait_zdgz',
      component: () => import('@/views/index/components/portrait/zdgz.vue')
    },{

      path: 'zdgz_jg', // 重点关注结果页
      name: 'portrait_zdgz_jg',
      component: () => import('@/views/index/components/portrait/zdgz-jg.vue')
    },
    {
      path: 'ljd', // 落脚点分析
      name: 'portrait_ljd',
      component: () => import('@/views/index/components/portrait/ljd.vue')
    },
    {
      path: 'ljd_jg', // 落脚点分析
      name: 'portrait_ljd_jg',
      component: () => import('@/views/index/components/portrait/ljd-jg.vue')
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
    },
    {
      path: 'new_pfcm',    //频繁出没
      name: 'portrait_new_pfcm',
      component: () => import('@/views/index/components/portrait/newPfcm.vue')
    }
  ]
}