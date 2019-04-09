 /* 地图板块 */
export default {
  path: 'map',
  name: 'map',
  component: () => import('@/views/index/components/map/default.vue'),
  redirect: {
    name: 'map_map'
  },
  children: [{
    path: 'map',
    name: 'map_map',
    component: () => import('@/views/index/components/map/map.vue')
  }, {
    path: 'communication/:userId/:type',
    name: 'map_communication',
    component: () => import('@/views/index/components/map/communication.vue')
  }]
}