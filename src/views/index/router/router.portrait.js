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
      path: 'peer-analysis', // 同行分析
      name: 'peer_analysis',
      component: () => import('@/views/index/components/portrait/peer-analysis.vue')
    }
  ]
}