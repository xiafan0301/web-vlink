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
                  .vl_icon_control_19{
                    display: inline-block !important;
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
      }
    }
  }
}
</style>