 /* 视频板块 */
export default {
  path: '/video',
  name: 'video',
  component: () => import('@/views/index/components/video/video.vue'),
  redirect: {
    name: 'video_patrol'
  },
  children: [{
    path: 'patrol',
    name: 'video_patrol',
    component: () => import('@/views/index/components/video/patrol.vue')
  }, {
    path: 'playback',
    name: 'video_playback',
    component: () => import('@/views/index/components/video/playback.vue')
  }, {
    path: 'query',
    name: 'video_query',
    component: () => import('@/views/index/components/video/query.vue')
  }, {
    path: 'signList',
    name: 'video_signList',
    component: () => import('@/views/index/components/video/signList.vue')
  },
  /* {
    path: 'videotape',
    name: 'video_videotape',
    component: () => import('@/views/index/components/video/videotape.vue')
  },  */
  {
    path: 'download',
    name: 'video_download',
    component: () => import('@/views/index/components/video/download.vue')
  }, {
    path: 'statistics',
    name: 'video_statistics',
    component: () => import('@/views/index/components/video/statistics.vue')
  }, {
    path: 'relay',
    name: 'video_relay',
    component: () => import('@/views/index/components/video/relay.vue')
  }]
}