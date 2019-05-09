 /* 任务板块 */
 export default {
    path: '/task',
    name: 'task',
    component: () => import('@/views/index/components/task/task.vue'),
    redirect: {
      name: 'task_list'
    },
    children: [{
        path: 'list',
        name: 'task_list',
        component: () => import('@/views/index/components/task/taskList.vue')
      },
      {
        path: 'detail',
        name: 'task_detail',
        component: () => import('@/views/index/components/task/taskDetail.vue')
      },
      {
        path: 'handle',
        name: 'task_handle',
        component: () => import('@/views/index/components/task/taskHandle.vue')
      },
      {
        path: 'default',
        name: 'task_default',
        component: () => import('@/views/index/components/task/default.vue')
      }     
    ]
  }