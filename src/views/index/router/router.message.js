 /* 消息板块 */
export default {
  path: '/message',
  name: 'message',
  component: () => import('@/views/index/components/message/message.vue'),
  redirect: {
    name: 'message_help'
  },
  children: [{
      path: 'help',
      name: 'message_help',
      component: () => import('@/views/index/components/message/help.vue')
    },
    {
      path: 'notice',
      name: 'message_notice',
      component: () => import('@/views/index/components/message/notice.vue')
    },
    {
      path: 'note',
      name: 'message_note',
      component: () => import('@/views/index/components/message/note.vue')
    },
    {
      path: 'system',
      name: 'message_system',
      component: () => import('@/views/index/components/message/system.vue')
    }
  ]
}