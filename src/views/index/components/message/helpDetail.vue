<template>
  <div class="mes_help_det">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)" class="mes_back">民众互助</el-breadcrumb-item>
        <el-breadcrumb-item>查看互助</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="help_det_box">
      <div class="det_info">
        <div style="padding-left: 14px;margin-bottom: 12px;">
          <span>上报人：</span>
          <el-popover
            placement="top-start"
            width="150"
            trigger="click"
            >
            <div class="det_info_com"><i class="vl_icon vl_icon_message_1"></i><span>语音通话</span></div>
            <div class="det_info_com"><i class="vl_icon vl_icon_message_2"></i><span>视频通话</span></div>
            <span class="det_info_click" slot="reference">13890809908</span>
          </el-popover>
        </div>
        <div><span class="vl_f_666" style="margin-bottom: 12px;">事发时间：</span><span class="vl_f_333">2018.08.07  12:13:14</span></div>
        <div style="margin-bottom: 12px;"><span class="vl_f_666">事件情况：</span><span class="vl_f_333">园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火事件情况文字达到140字的行数。</span></div>
        <div><span class="vl_f_666">事发地点：</span><span class="vl_f_333">长沙市天心区创谷广告产业园</span></div>
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
              <div><i class="vl_icon vl_icon_message_5"></i><span class="vl_f_666" @click="messageId = item.id;isConfirmation = false;">回复该评论</span></div>
              <div><i class="vl_icon vl_icon_message_4"></i><span class="vl_f_666" @click="shieldDialog = true">屏蔽该评论</span></div>
            </li>
            <el-collapse-transition>
              <li class="con_seven" v-if="messageId === item.id && !isConfirmation">
                <el-input v-model="content" placeholder="请对事发情况进行描述，文字限制140字"></el-input>
                <div class="con_btn">
                  <i class="vl_icon vl_icon_message_6" @click="isShowEmoji = !isShowEmoji"></i>
                  <el-button type="primary" @click="confirmation">回复评论</el-button>
                  <el-button @click="messageId = null;isShowEmoji = false;">取消评论</el-button>
                </div>
                <!-- emoji表情选择框 -->
                <div class="emoji_box" v-if="messageId === item.id && isShowEmoji">
                  <emotion @emotion="handleEmotion" :height="200"></emotion>
                </div>
              </li>
            </el-collapse-transition>
            <li class="reply_content" v-if="messageId === item.id && isConfirmation">
              <!-- /\#[\u4E00-\u9FA5]{1,3}\;/gi 匹配出含 #XXX; 的字段 -->
              <p>回复内容：</p>
              <p v-html="content.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)" class="vl_f_333"></p>
            </li>
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
import emotion from './emotion/index.vue';
export default {
  components: {emotion},
  data () {
    return {
      content: '',//评论内容,
      isShowEmoji: false,//是否显示表情选择框
      isConfirmation: false,//是否确认回复评论
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
    },
    handleEmotion (i) {
      this.content += i
    },
    // 将匹配结果替换表情图片
    emotion (res) {
      let word = res.replace(/#|;/gi,'')
      const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极']
      let index = list.indexOf(word)
      return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="top">`   
    },
    // 确认回复
    confirmation () {
      this.isConfirmation = !this.isConfirmation;
      this.isShowEmoji = false;
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
      .det_info_click{
        &:hover{
          color: #0C70F8;
          cursor: pointer;
        }
      }
      > div{
        display: flex;
        line-height: 20px;
        > span:nth-child(2){
          flex: 1;
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
                margin-left: 6px;
              }
              > span:nth-child(2):hover{
                cursor: pointer;
                color: #0C70F8;
              }
              .vl_icon{
                vertical-align: top;
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
              .vl_icon_message_6{
                float: left;
                margin-top: 10px;
                cursor: pointer;
                transition: none;
                &:hover{
                  background-position: -766px -425px;
                }
              }
            }
            .emoji_box{
              width: 400px;
              margin-top: 20px;
            }
          }
          .reply_content{
            width: 710px;
            padding: 20px 10px;
            background:rgba(250,250,250,1);
            border-radius:2px;
            img{
              vertical-align: text-bottom;
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
  .el-popover{
    .det_info_com{
      > span{
        margin-left: 6px;
        cursor: pointer;
        &:hover{
          color: #0C70F8;
        }
      }
    }
  }
</style>

