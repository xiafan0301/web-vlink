 /* 检索模块 */
export default {
  path: 'search',
  name: 'search',
  redirect: {
    name: 'search_capture'
  },
  component: () => import('@/views/index/components/search/search.vue'),
  children: [{
    path: 'capture',
    name: 'search_capture',
    component: () => import('@/views/index/components/search/capture.vue')
  }, {
    path: 'portrait',
    name: 'search_portrait',
    component: () => import('@/views/index/components/search/portrait.vue')
  }, {
    path: 'contrast ',
    name: 'search_contrast',
    component: () => import('@/views/index/components/search/contrast.vue')
  }, {
    path: 'history',
    name: 'search_history',
    component: () => import('@/views/index/components/search/history.vue')
  }]
}