<template>
  <div class="vl_manage clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'set_video'}">视频设置</router-link>
      </li>
      <li>
        <router-link :to="{name: 'basic_info'}">基础信息库</router-link>
      </li>
      <li>
        <router-link :to="{name: 'control_library'}">布控库管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'special_ehicle'}">特殊车辆管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'special_csmanage'}">特殊场所管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'camera_manage'}">摄像头管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'bayonet_manage'}">卡口管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'archives_manage'}">档案管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'user'}">用户管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'role_manage'}">角色管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'authority_info'}">权限管理</router-link>
      </li>
       <li>
        <router-link :to="{name: 'params_setting'}">参数设置</router-link>
      </li>
      <li>
        <router-link :to="{name: 'service_blacklist'}">服务黑名单</router-link>
      </li>
      <li>
        <router-link :to="{name: 'version_manage'}">APP版本管理</router-link>
      </li>
    </ul>
    <div class="manage_content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.vl_manage {
  position: relative;
  height: 100%;
  overflow: hidden;
  .menu_div {
    height: 100%;
  }
  > .manage_content {
    height: 100%;
    padding-left: 200px;
  }
}
</style>
<style lang="scss">
// 布控库设置页公共样式
.vl_manage .manage_content{
  .control_library{
    .set_list{
      width: 100%;
      height: 100%;
      .member_title{
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 10px 20px 0 20px;
        line-height: 40px;
        > div:nth-child(1){
          display: flex;
          > div:nth-child(1){
            margin-right: 20px;
            > span{
              font-size: 20px;
            }
            > i{
              margin-left: 10px;
              color: #186DFB;
              cursor: pointer;
            }
          }
          > div:nth-child(2){
            > span{
              margin-left: 10px;
              > span{
                color: #0C70F8;
              }
            }
          }
        }
        > div:nth-child(2){
          position: relative;
          .group_copy{
            width:152px;
            height: 280px;
            position: absolute;
            left: 0;
            top: 50px;
            z-index: 999;
            background:rgba(255,255,255,1);
            box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
            border-radius:4px;
            li{
              padding: 0 10px;
              cursor: pointer;
              &:hover{
                background:rgba(237,249,255,1);
                border-radius:4px 4px 0px 0px;
              }
            }
            .group_copy_add{
              > i{
                position: relative;
                top: 2px;
                font-size: 20px;
              }
              > span{
                margin-left: 10px;
              }
            }
          }
        }
      }
      .list_box{
        max-height: calc(100% - 156px);
        margin: 20px 0.5%;  
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        overflow-y: auto;
        .list_info{
          margin: 0 0.5%;
          width: 32%;
          height: 240px;
          padding: 20px;
          margin-bottom: 1%;
          background:rgba(255,255,255,1);
          box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
          display: flex;
          justify-content: space-between;
          .list_img{
            width: 50%;
            padding-right: 20px;
          }
          .list_data{
            width: 50%;
            .data_title{
              display: flex;
              justify-content: space-between;
              i{
                cursor: pointer;
                &:hover{
                  background-position: -584px -347px!important;
                }
              }
            }
            .data_list{
              display: flex;
              margin-top: 9px;
              span{
                padding: 5px 10px;
                background:rgba(250,250,250,1);
                border:1px solid rgba(242,242,242,1);
                border-radius: 3px;
                white-space:nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              & > span:not(:last-child){
                margin-right: 2px;
              }
              .more{
                position: relative;
                padding-top: 6px;
                .more_hover{
                  margin-bottom: 10px;
                  cursor: pointer;
                  color: #0C70F8;
                  border: none;
                  padding: 0;
                }
              }
            }
          }
        }
      }
      .bread_crumbs{
        margin: 20px 20px 0 20px;
        padding-bottom: 14px;
        border-bottom: 1px solid rgba(221,221,221,1);
        > span:nth-child(5){
          color: #666;
        }
        > span:not(:nth-child(5)){
          color: #999;
          cursor: pointer;
          &:hover{
            color: #666;
          }
        }
      }
    }
    // 重置布控库按钮样式
    .select_btn, .reset_btn {
      width: 80px;
    }
    .btn_90{
      width: 90px!important;
    }
    .btn_100{
      width: 100px!important;
    }
    .btn_140{
      width: 140px!important;
    }
    // 重置下拉多选列表的样式
    .el-select{
      .el-tag{
        background:rgba(242,242,242,1);
        border-radius:2px;
        border:1px solid rgba(217,217,217,1);
      }
      .el-tag__close.el-icon-close{
        margin-bottom: 2px; 
        background:rgba(242,242,242,1);
        font-size: 16px;
        color: #B2B2B2;
      }
    }
  }
}
// 重置布控库popover
.more_popover_box .more_popover{
  max-height: 240px;
  display: flex;
  flex-wrap: wrap;
  > span{
    margin-bottom: 10px;
    margin-right: 2px;
    padding: 5px 10px;
    background:rgba(250,250,250,1);
    border:1px solid rgba(242,242,242,1);
    border-radius: 3px;
    white-space:nowrap;
    text-overflow: ellipsis;
    overflow: hidden; 
  }
}
</style>