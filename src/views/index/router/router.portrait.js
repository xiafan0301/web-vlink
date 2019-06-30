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
    // 跟踪尾随详情
    {
      path: 'detail',
      name: 'gzws_detail',
      component: () => import('@/views/index/components/portrait/gzws/detail.vue')
    }
  ]
}