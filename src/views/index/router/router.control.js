 /* 布控板块 */
export default {
  path: '/control',
  name: 'control',
  component: () => import('@/views/index/components/control/control.vue'),
  redirect: {
    name: 'control_map'
  },
  children: [{
      path: 'map',
      name: 'control_map',
      component: () => import('@/views/index/components/control/map.vue')
    },
    {
      path: 'manage',
      name: 'control_manage',
      component: () => import('@/views/index/components/control/manage.vue')
    },
    {
      path: 'create',
      name: 'control_create',
      component: () => import('@/views/index/components/control/create.vue')
    },
    {
      path: 'add',
      name: 'control_add',
      component: () => import('@/views/index/components/control/add.vue')
    },
    {
      path: 'library',
      name: 'control_library',
      component: () => import('@/views/index/components/control/library.vue'),
    }
  ]
}