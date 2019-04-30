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
      }
    ]
  }