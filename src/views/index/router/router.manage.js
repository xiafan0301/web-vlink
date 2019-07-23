 /* 管理板块 */
export default {
  path: '/manage',
  name: 'manage',
  redirect: {
    name: 'set_video'
  },
  component: () => import('@/views/index/components/manage/manage.vue'),
  children: [{
      path: 'specialVehicle',
      name: 'special_ehicle',
      component: () => import('@/views/index/components/manage/specialVehicle.vue')
    },
    // {
    //   path: 'departmentDetail',
    //   name: 'department_detail',
    //   component: () => import('@/views/index/components/manage/departmentDetail.vue')
    // },
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
    {
      path: 'serviceBlacklist',
      name: 'service_blacklist',
      component: () => import('@/views/index/components/manage/serviceBlacklist.vue')
    },
    {
      path: 'versionManage',
      name: 'version_manage',
      component: () => import('@/views/index/components/manage/versionManage.vue')
    },
    {
      path: 'archivesManage',
      name: 'archives_manage',
      component: () => import('@/views/index/components/manage/archivesManage.vue'),
      redirect: {
        name: 'member_file'
      },
      children: [
        {
          path: 'memberFile',
          name: 'member_file',
          component: () => import('@/views/index/components/manage/components/memberAndFile/list.vue')
        },
        {
          path: 'carGear',
          name: 'car_gear',
          component: () => import('@/views/index/components/manage/components/carAndGear/list.vue')
        },
        {
          path: 'roomStall',
          name: 'room_stall',
          component: () => import('@/views/index/components/manage/components/roomAndStall/list.vue')
        },
        {
          path: 'machineGear',
          name: 'machine_gear',
          component: () => import('@/views/index/components/manage/components/machineAndGear/list.vue')
        },
      ]
    },
    {
      path: 'memberDetail',
      name: 'member_detail',
      component: () => import('@/views/index/components/manage/components/memberAndFile/detail.vue')
    },
    {
      path: 'memberAdd',
      name: 'member_add',
      component: () => import('@/views/index/components/manage/components/memberAndFile/addInfo.vue')
    },
    {
      path: 'memberEdit',
      name: 'member_edit',
      component: () => import('@/views/index/components/manage/components/memberAndFile/editInfo.vue')
    },
    {
      path: 'carAdd',
      name: 'car_add',
      component: () => import('@/views/index/components/manage/components/carAndGear/addInfo.vue')
    },
    {
      path: 'carEdit',
      name: 'car_edit',
      component: () => import('@/views/index/components/manage/components/carAndGear/editInfo.vue')
    },
    {
      path: 'carDetail',
      name: 'car_detail',
      component: () => import('@/views/index/components/manage/components/carAndGear/detail.vue')
    },
    {
      path: 'machineDetail',
      name: 'machine_detail',
      component: () => import('@/views/index/components/manage/components/machineAndGear/detail.vue')
    },
    {
      path: 'roomAdd',
      name: 'room_add',
      component: () => import('@/views/index/components/manage/components/roomAndStall/addInfo.vue')
    },
    {
      path: 'roomEdit',
      name: 'room_edit',
      component: () => import('@/views/index/components/manage/components/roomAndStall/editInfo.vue')
    },
    {
      path: 'roomDetail',
      name: 'room_detail',
      component: () => import('@/views/index/components/manage/components/roomAndStall/detail.vue')
    },
    // 卡口管理
    {
      path: 'bayonetManage',
      name: 'bayonet_manage',
      component: () => import('@/views/index/components/manage/bayonetManage.vue'),
      redirect: {
        name: 'bayonet_manage_list'
      },
      children: [{
          path: 'list',
          name: 'bayonet_manage_list',
          component: () => import('@/views/index/components/manage/components/bayonet/list.vue')
        },
        {
          path: 'add',
          name: 'bayonet_manage_add',
          component: () => import('@/views/index/components/manage/components/bayonet/add.vue')
        },
        {
          path: 'detail',
          name: 'bayonet_manage_detail',
          component: () => import('@/views/index/components/manage/components/bayonet/detail.vue')
        }
      ]
    },
  ]
}