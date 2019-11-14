 /* 地图板块 */
export default {
  path: '/map',
  name: 'map',
  component: () => import('@/views/index/components/map/default.vue'),
  children: [
    {
      path: 'map',
      name: 'map_map',
      component: () => import('@/views/index/components/map/map.vue')
    },
    {
      path: 'etc',
      name: 'map_etc',
      component: () => import('@/views/index/components/map/etc.vue')
    },
    {
      path: 'video',
      name: 'map_video',
      component: () => import('@/views/index/components/map/video.vue')
    },
    {
      path: 'trace',
      name: 'map_trace',
      component: () => import('@/views/index/components/map/trace.vue')
    },
  ]
}