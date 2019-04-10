 /* 研判模块 */
export default {
  path: 'judge',
  name: 'judge',
  component: () => import('@/views/index/components/judge/judge.vue'),
  redirect: {
    name: 'trajectory_collide'
  },
  children: [{
      path: 'trajectoryCollide',
      name: 'trajectory_collide',
      component: () => import('@/views/index/components/judge/trajectoryCollide.vue')
    },
    {
      path: 'focusOn',
      name: 'focus_on',
      component: () => import('@/views/index/components/judge/focusOn.vue')
    },
    {
      path: 'investigation',
      name: 'investigation',
      component: () => import('@/views/index/components/judge/investigation.vue')
    },
    {
      path: 'highArea',
      name: 'high_area',
      component: () => import('@/views/index/components/judge/highArea.vue')
    }
  ]
}