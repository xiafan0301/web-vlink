<template>
  <div class="mes_help_det">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)">民众互助</el-breadcrumb-item>
        <el-breadcrumb-item>查看互助</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="help_det_box">
      <div class="det_info">
        <ul>
          <li>
            <div><span>上报人：</span><span style="color: #0C70F8;">13890809908</span></div>
            <div><span>发布平台：</span><span>13890809908</span></div>
          </li>
          <li>
            <div><span>报案时间：</span><span>13890809908</span></div>
            <div><span>人员伤亡：</span><span>13890809908</span></div>
          </li>
          <li>
            <div><span>事件类型：</span><span>13890809908</span></div>
            <div><span>事件状态：</span><span>13890809908</span></div>
          </li>
        </ul>
        <div style="margin-bottom: 12px;"><span>事件情况：</span><span>园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火事件情况文字达到140字的行数。</span></div>
        <div><span>事发地点：</span><span>长沙市天心区创谷广告产业园</span></div>
      </div>
      <div class="det_list">
        <div class="list_title">
          <span>5</span><span>条信息</span>
        </div>
        <div class="list_content" v-for="item in messageList" :key="item.id">
          <img src="//via.placeholder.com/32x32" alt="">
          <ul>
            <li class="con_one"><span>13900001234</span><span class="vl_f_999 vl_f_12">（信息部门-信息科长）</span></li>
            <li class="con_two"><span class="vl_f_999 vl_f_12">2017-10-01 18:00</span><span class="vl_f_999 vl_f_12">来源 全域智能视联系统APP</span></li>
            <li class="con_three">未参与民众互助</li>
            <li class="con_four vl_f_333">园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火事件情况文字达到140字的行数。</li>
            <li class="con_five">
              <img src="//via.placeholder.com/117x117" alt="">
              <img src="//via.placeholder.com/117x117" alt="">
              <img src="//via.placeholder.com/117x117" alt="">
            </li>
            <li class="con_six">
              <div><i class="el-icon-close"></i><span class="vl_f_666" @click="messageId = item.id">回复该评论</span></div>
              <div><i class="el-icon-close"></i><span class="vl_f_666" @click="shieldDialog = true">屏蔽该评论</span></div>
            </li>
            <el-collapse-transition>
              <li class="con_seven" v-if="messageId === item.id">
                <el-input v-model="comment" placeholder="请对事发情况进行描述，文字限制140字"></el-input>
                <div class="con_btn">
                  <el-button type="primary">回复评论</el-button>
                  <el-button @click="messageId = null">取消评论</el-button>
                </div>
              </li>
            </el-collapse-transition>
          </ul>
        </div>
      </div>
    </div>
    <div class="shield_dialog">
      <el-dialog
        :visible.sync="shieldDialog"
        :close-on-click-modal="false"
        width="482px"
        top="40vh">
        <h1 class="vl_f_16 vl_f_333" style="margin-bottom: 4px;">是否确定屏蔽该评论？</h1>
        <el-checkbox v-model="shieldChecked">并将该用户加入黑名单</el-checkbox>
        <div slot="footer">
          <el-button @click="shieldDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      comment: null,//评论内容
      messageList: [
        {id: '001'},
        {id: '002'},
        {id: '003'},
        {id: '004'},
        {id: '005'},
        {id: '006'}
      ],//信息列表
      messageId: null,//信息id
      // 屏蔽弹窗参数
      shieldDialog: null,
      shieldChecked: false,
      loadingBtn: false
    }
  },
  mounted () {
   
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    }
  }
}
</script>
<style lang="scss" scoped>
.mes_help_det{
  width: 100%;
  position: relative;
  .help_det_box{
    margin: 0 20px 20px 20px;
    .det_info, .det_list{
      background: #fff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
    }
    .det_info{
      margin-bottom: 20px;
      padding: 16px 45px;
      > ul{
        display: flex;
        > li{
          width: 25%;
          > div{
            padding-bottom: 12px;
            > span:nth-child(1){
              color: #666;
            }
            > span:nth-child(2){
              color: #333;
            }
          }
        }
      }
      > div{
        display: flex;
        > span:nth-child(1){
          width: 5%;
          color: #666;
        }
        > span:nth-child(2){
          width: 95%;
          color: #333;
        }
      }
    }
    .det_list{
      .list_title{
        padding: 0 20px;
        height: 58px;
        line-height: 58px;
        border-bottom: 1px solid #F2F2F2;
        > span{
          color: #333;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .list_content{
        display: flex;
        padding: 12px 20px;
        border-bottom: 1px solid #F2F2F2;
        > img{
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 10px;
        }
        > ul{
          .con_one{
            margin-bottom: 10px;
            > span:nth-child(1){
              color: #333;
              font-weight: bold;
            }
          }
          .con_two{
            margin-bottom: 10px;
          }
          .con_four{
            line-height: 20px;
          }
          .con_three{
            width: 100px;
            height: 22px;
            line-height: 20px;
            margin-bottom: 20px;
            text-align: center;
            background:rgba(245,245,245,1);
            border-radius:4px;
            border:1px solid rgba(211,211,211,1);
          }
          .con_five{
            padding: 20px 0;
            > img{
              width:117px;
              height:117px;
              margin-right: 20px;
              border-radius:4px;
              border:1px solid rgba(211,211,211,1);
            }
          }
          .con_six{
            display: flex;
            margin-bottom: 20px;
            > div{
              margin-right: 30px;
              > span:nth-child(2){
                margin-left: 10px;
              }
              > span:nth-child(2):hover{
                cursor: pointer;
                color: #0C70F8;
              }
            }
          }
          .con_seven{
            width:710px;
            height:110px;
            padding: 10px;
            background:rgba(250,250,250,1);
            border-radius:2px;
            .con_btn{
              width: 100%;
              padding-top: 10px;
              text-align: right;
            }
          }
        }
      }
    }
  }
 
}
</style>
<style lang="scss">
  .mes_help_det .shield_dialog{
    .el-checkbox__label{
      color: #999;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label{
      color: #409EFF;
    }
  }
</style>

