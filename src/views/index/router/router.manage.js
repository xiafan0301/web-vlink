 /* 管理板块 */
export default {
  path: 'manage',
  name: 'manage',
  redirect: {
    name: 'set_video'
  },
  component: () => import('@/views/index/components/manage/manage.vue'),
  children: [{
      path: 'department',
      name: 'manage_department',
      component: () => import('@/views/index/components/manage/departmentList.vue')
    },
    {
      path: 'departmentDetail',
      name: 'department_detail',
      component: () => import('@/views/index/components/manage/departmentDetail.vue')
    },
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/index/components/manage/user.vue'),
      redirect: {
        name: 'user_manage'
      },
      children: [{
          path: 'userManage',
          name: 'user_manage',
          component: () => import('@/views/index/components/manage/userManage.vue')
        },
        {
          path: 'groupManage',
          name: 'group_manage',
          component: () => import('@/views/index/components/manage/groupManage.vue')
        },
      ]
    },
    {
      path: 'addUser',
      name: 'add_user',
      component: () => import('@/views/index/components/manage/addUser.vue')
    },
    {
      path: 'roleManage',
      name: 'role_manage',
      component: () => import('@/views/index/components/manage/roleManage.vue')
    },
    {
      path: 'videoSetting',
      name: 'set_video',
      component: () => import('@/views/index/components/manage/videoSetting.vue'),
      redirect: {
        name: 'custom_group'
      },
      children: [{
          path: 'customGroup',
          name: 'custom_group',
          component: () => import('@/views/index/components/manage/customGroup.vue')
        },
        {
          path: 'tirotationSetting',
          name: 'tirotation_setting',
          component: () => import('@/views/index/components/manage/tirotationSetting.vue')
        },
        {
          path: 'deviceAuthorize',
          name: 'device_authorize',
          component: () => import('@/views/index/components/manage/deviceAuthorize.vue')
        },
        {
          path: 'markManage',
          name: 'mark_manage',
          component: () => import('@/views/index/components/manage/markManage.vue')
        }
      ]
    },
    {
      path: 'basicInfo',
      name: 'basic_info',
      redirect: {
        name: 'person_info'
      },
      component: () => import('@/views/index/components/manage/basicInfo.vue'),
      children: [{
          path: 'personInfo',
          name: 'person_info',
          component: () => import('@/views/index/components/manage/personInfo.vue')
        },
        {
          path: 'vehicleInfo',
          name: 'vehicle_info',
          component: () => import('@/views/index/components/manage/vehicleInfo.vue')
        },
      ]
    },
    {
      path: 'adminPersonInfo',
      name: 'admin_person_info',
      component: () => import('@/views/index/components/manage/adminPersonInfo.vue')
    },
    {
      path: 'adminVehicleInfo',
      name: 'admin_vehicle_info',
      component: () => import('@/views/index/components/manage/adminVehicleInfo.vue')
    },
    {
      path: 'authorityInfo',
      name: 'authority_info',
      component: () => import('@/views/index/components/manage/authorityInfo.vue')
    },
    {
      path: 'addGroup',
      name: 'add_group',
      component: () => import('@/views/index/components/manage/addGroup.vue')
    },
    {
      path: 'addPatrol',
      name: 'add_patrol',
      component: () => import('@/views/index/components/manage/addPatrol.vue')
    },
    {
      path: 'addTempGrant',
      name: 'add_temp_grant',
      component: () => import('@/views/index/components/manage/addTempGrant.vue')
    },
    {
      path: 'authorizeGrant',
      name: 'authorize_grant',
      component: () => import('@/views/index/components/manage/authorizeGrant.vue')
    },
  ]
}