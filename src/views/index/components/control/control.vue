<template>
  <div class="vl_control clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'control_map'}">布控地图</router-link>
      </li>
      <li>
        <router-link :to="{name: 'control_manage'}">布控管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'control_create'}">新建布控</router-link>
      </li>
      <li>
        <router-link :to="{name: 'control_library'}">布控库</router-link>
      </li>
    </ul>
    <div class="con_content">
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
<style lang="scss">
.vl_control {
  position: relative;
  height: 100%;
  > .con_content {
    height: 100%;
    padding-left: 200px;
    overflow: auto;
    // 布控模块地图公用样式
    .manage_d_s_m{
      width: 100%;
      height: 100%;
      position: relative;
      > div:nth-child(1){
        width: 100%;
        height: 802px;
      }
      .manage_d_s_m_l{
        width: 260px;
        height: 765px;
        position: absolute;
        left: 20px;
        top: 20px;
        > div{
          box-shadow:4px 0px 15px 0px rgba(131,131,131,0.23),0px 0px 13px 0px rgba(255,255,255,0.55);
          border:1px solid rgba(223,223,223,1);
        }
        > div:nth-child(1){
          width: 100%;
          height: 78px;
          padding-left: 20px;
          background: #fff;
          p{
            margin-top: 12px;
            &:nth-child(1){
              padding-left: 14px;
            }
          }
        }
        .equ_h{
          height: 80px!important;
        }
        > div:nth-child(2){
          width: 100%;
          height: 667px;
          margin-top: 20px;
          background: #fff;
          overflow: hidden;
          >.top{
            padding: 15px;
            border-bottom: 1px solid #E2E2E2;
          }
          >.dp_box{
            .track_t{
              display: flex;
              flex-wrap: nowrap;
              padding: 10px;
              cursor: pointer;
              i{
                margin-right: 10px;
                margin-top: 2px;
              }
              &.active{
                color: #0C70F8;
              }
              &:hover{
                color: #0C70F8;
              }
            }
            .equ_m{
              margin: 0 20px;
              height: 28px;
              line-height: 28px;
              border-radius:4px;
              border:1px solid rgba(211,211,211,1);
              display: flex;
              overflow: hidden;
              >div{
                width: 50%;
                height: 100%;
                text-align: center;
                background: #fff;
                color: #666;
                cursor: pointer;
                &.active{
                  background: rgba(235,239,242,1);
                  color: #0C70F8;
                }
                &:hover{
                  background: rgba(235,239,242,1);
                  color: #0C70F8;
                }

              }
            }
            ul{
              margin-top: 10px;
              li{
                width: 100%;
                padding: 10px 30px;
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                background: #fff;
                color: #666;
              }
              li.normal{
                cursor: pointer;
                &.active, &:hover{
                  background: rgba(235,239,242,1);
                }
                &:hover{
                  .el-checkbox{
                    display: inline-block !important;
                    
                  }
                }
                &{
                  .el-checkbox{
                    position: relative;
                    bottom: 6px;
                  }
                }
              }
            }
          }
        }
      }
      .manage_d_s_m_r{
        width: 78px;
        position: absolute;
        right: 20px;
        bottom: 20px;
        .top, .bottom > li{
          width: 100%;
          height: 70px;
          line-height: 80px;
          background: #fff;
          text-align: center;
          cursor: pointer;
          i{
            margin-top: 16px;
            font-size: 20px;
            color: #999999;
          }
          &:hover{
            i{
              color: #0C70F8;
            }
          }
        }
        .top{
          margin-bottom: 10px;
          p.active{
            color: #0C70F8;
          }
        }
        .top, .bottom{
          box-shadow:4px 0px 15px 0px rgba(131,131,131,0.23),0px 0px 13px 0px rgba(255,255,255,0.55);
        }
        .bottom > li:nth-child(1){
          border-bottom: 1px solid #F1F1F1;
        }
        .area{
          line-height: 14px;
          p{
            font-size: 12px;
            color: #666;
          }
          &.active{
            i{
              background-position: -97px -347px;
            }
            p{
              color: #0C70F8;
            }
          }
        }
      }
      .vl_icon{
        transition: none;
      }
    }
    // 布控模块面包屑样式
    .con_back > .el-breadcrumb__inner{
      color: #999;
      &:hover{
        color: #409EFF;
        cursor: pointer;
      }
    }
    // 布控库设置页公共样式
    .control_library .set_list{
      width: 100%;
      height: 100%;
      .member_title{
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 10px 20px;
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
            position: absolute;
            left: 0;
            top: 50px;
            z-index: 999;
            background:rgba(255,255,255,1);
            box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
            border-radius:4px;
            > li{
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
        margin: 20px 0.5%;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        .list_info{
          margin: 0 0.5%;
          width: 32%;
          padding: 20px;
          margin-bottom: 20px;
          background:rgba(255,255,255,1);
          box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
          display: flex;
          justify-content: space-between;
          overflow: hidden;
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
                > span{
                  margin-bottom: 10px;
                  cursor: pointer;
                  color: #0C70F8;
                }
                > div{
                  width: 220px;
                  padding: 20px 20px 10px;
                  position: absolute;
                  right: 72px;
                  bottom: 0;
                  background:rgba(255,255,255,1);
                  box-shadow:0px 5px 18px 0px rgba(169,169,169,0.39);
                  border-radius: 5px;
                  display: flex;
                  flex-wrap: wrap;
                  > span{
                    margin-bottom: 10px;
                    margin-right: 2px;
                  }
                }
                > i{
                  position: absolute;
                  left: -8px;
                  top: 6px;
                  display: inline-block;
                  border: 6px solid transparent;
                  border-left-color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>