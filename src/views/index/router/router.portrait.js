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
    }
  ]
}