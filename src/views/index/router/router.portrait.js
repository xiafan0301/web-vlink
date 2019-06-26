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
    }
  ]
}