 /* 研判模块 */
export default {
  path: '/vehicle',
  name: 'vehicle',
  component: () => import('@/views/index/components/vehicle/vehicle.vue'),
  redirect: { name: 'vehicle_menu' },
  children: [
    {
      path: 'menu',
      name: 'vehicle_menu',
      component: () => import('@/views/index/components/vehicle/menu.vue')
    },
    /* 查询 */
    {
      path: 'clcx', // 车辆查询
      name: 'vehicle_search_clcx',
      component: () => import('@/views/index/components/vehicle/search/clcx.vue')
    },{
      path: 'clcxdetail', // 车辆详情
      name: 'vehicle_search_clcxdetail', 
      component: () => import('@/views/index/components/vehicle/search/clcxdetail.vue')
    }, {
      path: 'tzsc', // 特征搜车
      name: 'vehicle_search_tzsc',
      component: () => import('@/views/index/components/vehicle/search/tzsc.vue')
    }, {
      path: 'ycsc', // 以图搜车
      name: 'vehicle_search_ycsc',
      component: () => import('@/views/index/components/vehicle/search/ycsc.vue')
    },
       {
      path: 'mhsc', // 模糊搜车
      name: 'vehicle_search_mhsc',
      component: () => import('@/views/index/components/vehicle/search/mhsc.vue')
    }, {
      path: 'gcck', // 过车查看
      name: 'vehicle_search_gcck',
      component: () => import('@/views/index/components/vehicle/search/gcck.vue')
    }, {
      path: 'clxx', // 车辆信息
      name: 'vehicle_search_clxx',
      component: () => import('@/views/index/components/vehicle/search/clxx.vue')
    }, {
      path: 'lxwf', // 连续违法
      name: 'vehicle_search_lxwf',
      component: () => import('@/views/index/components/vehicle/search/lxwf.vue')
    }, {
      path: 'pfgc', // 频繁过车
      name: 'vehicle_search_pfgc',
      component: () => import('@/views/index/components/vehicle/search/pfgc.vue')
    },
    /* 分析 */
    {
      path: 'clgj', // 车辆轨迹分析
      name: 'vehicle_analysis_clgj',
      component: () => import('@/views/index/components/vehicle/analysis/clgj.vue')
    }, {
      path: 'ljd', // 落脚点分析
      name: 'vehicle_search_ljd',
      component: () => import('@/views/index/components/vehicle/analysis/ljd.vue'),
      meta: {
        unrequireLogin: true
      }
    }, {
      path: 'qy', // 区域分析
      name: 'vehicle_search_qy',
      component: () => import('@/views/index/components/vehicle/analysis/qy.vue')
    }, {
      path: 'xcgl', // 行车规律分析
      name: 'vehicle_search_xcgl',
      component: () => import('@/views/index/components/vehicle/analysis/xcgl.vue')
    }, {
      path: 'tpc', // 套牌车分析
      name: 'vehicle_search_tpc',
      component: () => import('@/views/index/components/vehicle/analysis/tpc.vue')
    }, {
      path: 'txcl', // 同行车辆分析
      name: 'vehicle_search_txcl',
      component: () => import('@/views/index/components/vehicle/analysis/txcl.vue')
    }, {
      path: 'ws', // 尾随分析
      name: 'vehicle_search_ws',
      component: () => import('@/views/index/components/vehicle/analysis/ws.vue')
    }, {
      path: 'dctx', // 多车同行分析
      name: 'vehicle_search_dctx',
      component: () => import('@/views/index/components/vehicle/analysis/dctx.vue')
    },
    /* 统计 */
    {
      path: 'cll', // 车流量统计
      name: 'vehicle_search_cll',
      component: () => import('@/views/index/components/vehicle/statistics/cll.vue')
    }, {
      path: 'ccrc', // 初次入城统计
      name: 'vehicle_search_ccrc',
      component: () => import('@/views/index/components/vehicle/statistics/ccrc.vue')
    }, {
      path: 'bkclcc', // 布控车辆出城
      name: 'vehicle_search_bkclcc',
      component: () => import('@/views/index/components/vehicle/statistics/bkclcc.vue')
    }, {
      path: 'gcsj', // 过车数据统计
      name: 'vehicle_search_gcsj',
      component: () => import('@/views/index/components/vehicle/statistics/gcsj.vue')
    }, {
      path: 'ycxc', // 夜车行车统计
      name: 'vehicle_search_ycxc',
      component: () => import('@/views/index/components/vehicle/statistics/ycxc.vue')
    }, {
      path: 'ycxc-record', // 夜车行车抓拍记录
      name: 'vehicle_search_ycxc_record',
      component: () => import('@/views/index/components/vehicle/statistics/ycxc-record.vue')
    }, {
      path: 'yjxc', // 夜车行车统计
      name: 'vehicle_search_yjxc',
      component: () => import('@/views/index/components/vehicle/statistics/yjxc.vue')
    }
  ]
}