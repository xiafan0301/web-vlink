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
      <div class="det_info" v-if="helpDetail">
        <div style="padding-left: 14px;margin-bottom: 12px;">
          <span>上报人：</span>
          <el-popover
            placement="top-start"
            width="150"
            trigger="click"
            >
            <div class="det_info_com"><i class="vl_icon vl_icon_message_1"></i><span>语音通话</span></div>
            <div class="det_info_com"><i class="vl_icon vl_icon_message_2"></i><span>视频通话</span></div>
            <span class="det_info_click" slot="reference">{{helpDetail.reporterPhone}}</span>
          </el-popover>
        </div>
        <div><span class="vl_f_666" style="margin-bottom: 12px;">事发时间：</span><span class="vl_f_333">{{helpDetail.reportTime}}</span></div>
        <div style="margin-bottom: 12px;"><span class="vl_f_666">事件情况：</span><span class="vl_f_333">{{helpDetail.eventDetail}}</span></div>
        <div><span class="vl_f_666">事发地点：</span><span class="vl_f_333">{{helpDetail.eventAddress}}</span></div>
        <div class="help_det_img_list" v-if="helpDetail.attachmentList.length > 0" id="imgsOne">
          <div v-if="helpDetail.attachmentList.length > 0 && helpDetail.attachmentList[0].fileType === 2" @mouseenter="eventVideoTool = true;" @mouseleave="eventVideoTool = false;">
            <video id="eventVideo" :src="helpDetail.attachmentList[0].path" width="117px" height="117px" style="object-fit: fill;" @click="showLargeVideo()"></video>
            <div class="result_tool" v-show="eventVideoTool">
              <div>
                <i class="vl_icon vl_icon_judge_01" v-if="curVideoPlay" @click="_pauseVideo()"></i>
                <i class="vl_icon vl_icon_control_09" v-else @click="_playVideo()"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="det_list" v-if="commentList.length > 0">
        <div class="list_title">
          <span>{{total}}</span><span>条信息</span>
        </div>
        <div class="list_content" v-for="(item, index) in commentList" :key="item.uid">
          <!-- <img src="//via.placeholder.com/32x32" alt=""> -->
          <img src="../../../../assets/img/wr_photo.png" alt="">
          <ul>
            <li class="con_one"><span>{{item.commentUserMobile}}</span><span class="vl_f_999 vl_f_12">（{{item.commentUserIdentity}}）</span></li>
            <li class="con_two"><span class="vl_f_999 vl_f_12" style="margin-right: 10px;">{{item.createTime | fmTimestamp('yyyy-MM-dd HH:mm')}}</span><span class="vl_f_999 vl_f_12">来源 {{dicFormater(sourceType, String(item.eventSource || 2))}}</span></li>
            <li class="con_three">{{item.isParticipate ? '已参与民众互助' : '未参与民众互助'}}</li>
            <li class="con_four vl_f_333">{{item.content}}</li>
            <li class="con_five" v-if="item.sysAppendixInfoList.length > 0" :id="'imgsTwo_' + item.uid">
              <!-- <img :src="info.path" alt="" v-for="info in item.sysAppendixInfoList" :key="info.uid"> -->
            </li>
            <li class="con_six">
              <div><i class="vl_icon vl_icon_message_5"></i><span class="vl_f_666" @click="commentId = item.uid;isConfirmation = false;">回复该评论</span></div>
              <div><i class="vl_icon vl_icon_message_4"></i><span class="vl_f_666" @click="popShield(item, index)">屏蔽该评论</span></div>
            </li>
            <template v-if="item.replayList.length > 0 || (commentId === item.uid && isConfirmation)">
              <li class="reply_content" v-for="_item in item.replayList" :key="_item.uid">
                <!-- /\#[\u4E00-\u9FA5]{1,3}\;/gi 匹配出含 #XXX; 的字段 -->
                <p>{{_item.organ || 'xxx'}}回复：</p>
                <p  v-html="_item.replayContent ? _item.replayContent.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion) : ''" class="vl_f_333"></p>
              </li>
            </template>
            <el-collapse-transition>
              <li class="con_seven" v-if="commentId === item.uid && !isConfirmation">
                <el-input v-model="content" placeholder="请对事发情况进行描述，文字限制140字"></el-input>
                <div class="con_btn">
                  <i class="vl_icon vl_icon_message_6" @click="isShowEmoji = !isShowEmoji"></i>
                  <el-button type="primary" :loading="loadingBtn" @click="replyComment">回复评论</el-button>
                  <el-button @click="commentId = null;isShowEmoji = false;">取消评论</el-button>
                </div>
                <!-- emoji表情选择框 -->
                <div class="emoji_box" v-if="commentId === item.uid && isShowEmoji">
                  <emotion @emotion="handleEmotion" :height="200"></emotion>
                </div>
              </li>
            </el-collapse-transition>
          </ul>
        </div>
        <div class="list_more" v-if="total > 5">
          <el-button @click="getCommentInfoList">加载更多...</el-button>
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
          <el-button :loading="loadingBtn" type="primary" @click="shieldComment">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <div style="width: 0; height: 0;" v-show="showLarge" :class="{vl_j_fullscreen: showLarge}">
      <video id="controlResultLarge" style="object-fit: fill;" :src="videoObj.snapVideo"></video>
      <div @click="closeLargeVideo" class="close_btn el-icon-error"></div>
      <div class="control_bottom">
        <div>{{videoObj.deviceName}}</div>
        <div>
          <span @click="pauseLargeVideo" class="vl_icon vl_icon_judge_01" v-if="largeVideoPlay"></span>
          <span @click="playLargeVideo" class="vl_icon vl_icon_control_09" v-else></span>
          <span><a download="视频" :href="videoObj.snapVideo" class="el-icon-download"></a></span>
          <span @click="cutScreen" class="vl_icon vl_icon_control_07"></span>
        </div>
      </div>
    </div>
    <div style="width: 0; height: 0;" v-show="showCut"  :class="{vl_j_cutscreen: showCut}">
      <img :src="demoImg" alt="">
      <i @click="showCut = false" class="close_btn el-icon-error"></i>
      <a download="截图" :href="demoImg" id="controlResultCutImg" ></a>
    </div>
  </div>
</template>
<script>
import emotion from './emotion/index.vue';
import {objDeepCopy} from '../../../../utils/util.js';
import {getEventDetail} from '@/views/index/api/api.event.js';
import {getCommentInfoList, replyComment, shieldComment} from '@/views/index/api/api.message.js';
import {dataList} from '@/utils/data.js';
export default {
  components: {emotion},
  props: ['helpId'],
  data () {
    return {
      pageNum: 0,
      pageSize: 5,
      total: 0,
      sourceType: dataList.sourceType,
      helpDetail: null,//民众互助详情
      commentList: [],//评论列表内容
      content: '',//评论内容,
      isShowEmoji: false,//是否显示表情选择框
      isConfirmation: false,//是否确认回复评论
      commentId: null,//评论id
      shieldId: null,//屏蔽id
      shieldUserId: null,//被屏蔽用户id
      commentIndex: null,//评论下标
      // 屏蔽弹窗参数
      shieldDialog: null,
      shieldChecked: false,
      loadingBtn: false,
      // 视频查看
      videoObj: {},
      showLarge: false,
      largeVideoPlay: false,
      showCut: false,
      demoImg: false,
      eventVideoTool: false,
      curVideoPlay: false
    }
  },
  mounted () {
    this.getMutualHelpDetail();
    this.getCommentInfoList();
  },
  methods: {
    // 根据id获取民众互助详情
    getMutualHelpDetail () {
      getEventDetail(this.helpId).then(res => {
        if (res && res.data) {
          this.helpDetail = res.data;
          // 生产可供预览的图片
          if (this.helpDetail.attachmentList.some(s => s.fileType === 2)) return false;
          if (this.helpDetail.attachmentList && this.helpDetail.attachmentList.length > 0) {
            this.previewPictures('imgsOne', this.helpDetail.attachmentList);
          }
        }
      })
    },
    // 预览图片
    previewPictures (id, data) {
      setTimeout(() => {
        let imgs = data.map(m => m.path);
        // 图片数组2
        let imgs2 = []
        // 获取图片列表容器
        let $el = document.getElementById(id);
        let html = '';
        // 创建img dom
        imgs.forEach(function (src) {
          // 拼接html结构
          html += '<div class="item" style="width: 33%;height: 137px;padding-right: 20px;padding-bottom: 20px;cursor: pointer;" data-angle="' + 0 + '"><img src="' + src + '" style="width: 100%;height: 100%;border-radius:4px;"></div>';
          // 生成imgs2数组
          imgs2.push({
            url: src,
            angle: 0
          })
        })
        // 将图片添加至图片容器中
        $el.innerHTML = html;
        // 使用方法
        let ziv = new ZxImageView(null, imgs2);
        // console.log(ziv);
        // 查看第几张
        let $images = $el.querySelectorAll('.item');
        for (let i = 0; i < $images.length; i++) {
          (function (index) {
            $images[i].addEventListener('click', function () {
              ziv.view(index);
            })
          }(i))
        }
      }, 50)
    },
    // 开始播放
    _playVideo () {
      this.curVideoPlay = true;
      document.getElementById('eventVideo').play();
    },
    // 停止播放
    _pauseVideo () {
      this.curVideoPlay = false;
      document.getElementById('eventVideo').pause();
    },
    // 显示大屏
    showLargeVideo () {
      this.videoObj.snapVideo = this.helpDetail.attachmentList.length > 0 && this.helpDetail.attachmentList[0].path;
      this.videoObj.curVideoPlay = false;
      this.showLarge = true;
      this.playLargeVideo();
    },
    // 关闭大屏
    closeLargeVideo () {
      this.showLarge = false;
      this.pauseLargeVideo();
    },
    // 大屏播放
    playLargeVideo () {
      this.largeVideoPlay = true;
      this.curVideoPlay = true;
      this.$nextTick(() => {
        document.getElementById('controlResultLarge').play();
      })
    },
    // 停止大屏播放
    pauseLargeVideo () {
      this.largeVideoPlay = false;
      this.curVideoPlay = false;
      document.getElementById('controlResultLarge').pause();
    },
    // 截屏
    cutScreen () {
      this.showCut = true;
      let _canvas = document.createElement('canvas');
      _canvas.setAttribute('width', document.documentElement.clientWidth);
      _canvas.setAttribute('height', document.documentElement.clientHeight);
      let cxt = _canvas.getContext('2d');
      cxt.drawImage(document.getElementById('controlResultLarge'), 0, 0, _canvas.width, _canvas.height);
      this.demoImg = _canvas.toDataURL();
      setTimeout(() => {
        document.getElementById('controlResultCutImg').click();
      }, 200)
    },
    // 获取评论列表数据
    getCommentInfoList () {
      this.pageNum += 1;
      if (this.pageNum > Math.ceil(this.total/5) && this.pageNum > 1) {
        this.$message.warning('没有更多数据了');
        return;
      }
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        'where.eventId': this.helpId
      }
      getCommentInfoList(params).then(res => {
        if (res && res.data) {
          this.total = res.data.total;
          this.commentList = this.commentList.concat(res.data.list);
          for (let item of res.data.list) {
            if (item.sysAppendixInfoList && item.sysAppendixInfoList.length === 0) continue;
            this.previewPictures('imgsTwo_' + item.uid, item.sysAppendixInfoList);
          }
        }
      })
    },
    // 回复评论
    replyComment () {
      const data = {
        replayContent: this.content,
        commentId: this.commentId
      }
      this.loadingBtn = true;
      replyComment(data).then(res => {
        if (res && res.data) {
          this.$message.success('评论成功');
          this.isConfirmation = !this.isConfirmation;
          this.isShowEmoji = false;
          this.commentList.forEach(f => {
            if (this.commentId === f.uid) {
              const obj = objDeepCopy(f.replayList[f.replayList.length - 1]);
              if (!obj.uid) obj.uid = 1;
              obj.uid++;
              obj.organ = this.$store.state.loginUser.organList.map( m => m.organName).join('');
              obj.replayContent = this.content;
              f.replayList.push(obj);
            }
          })
          console.log(this.commentList, 'this.commentList')
          this.content = null;
        }
      }).finally(() => {
        this.loadingBtn = false;
      })
    },
    // 弹出屏蔽弹窗
    popShield (item, index) {
      this.shieldUserId = item.commentUserId;
      this.isConfirmation = true;
      this.shieldId = item.uid;
      this.commentIndex = index;
      this.shieldDialog = true;
    },
    // 屏蔽评论
    shieldComment () {
      const data = {
        userId: this.$store.state.loginUser.uid,//操作的用户id
        shieldId: this.shieldChecked ? this.shieldUserId : this.shieldId,
        opType: this.shieldChecked ? 2 : 1,//屏蔽操作类型
        shieldType: 1
      }
      this.loadingBtn = true;
      shieldComment(data).then(res => {
        if (res && res.data) {
          this.$message.success('屏蔽成功');
          this.shieldDialog = false;
          // 未勾选加入黑名单
          if (!this.shieldChecked) {
          this.commentList.splice(this.commentIndex, 1);
          // 勾选加入黑名单
          } else {
            this.commentList = this.commentList.filter(f => f.commentUserId !== this.shieldUserId);
          }
        }
      }).finally(() => {
        this.loadingBtn = false;
      })
    },
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
      .help_det_img_list{
        width: 428px;
        padding-top: 10px;
        display: flex;
        flex-wrap: wrap;
        > div{
          width: 117px;
          height: 117px;
          position: relative;
          .result_tool{
            width: 50px;
            height: 50px;
            background: rgba(0,0,0,.4);
            border-radius: 50%;
            position: absolute;
            bottom: 50%;
            left: 50%;
            margin-left: -25px;
            margin-bottom: -25px;
            cursor: pointer;
            > div{
              width: 100%;
              height:100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
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
            width: 106px;
            height: 22px;
            padding: 0 3px;
            line-height: 20px;
            margin-bottom: 20px;
            text-align: center;
            background:rgba(245,245,245,1);
            border-radius:4px;
            border:1px solid rgba(211,211,211,1);
          }
          .con_five{
            width: 428px;
            padding: 20px 0;
            display: flex;
            flex-wrap: wrap;
            // > img{
            //   width:117px;
            //   height:117px;
            //   margin-right: 20px;
            //   border-radius:4px;
            //   border:1px solid rgba(211,211,211,1);
            // }
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
            margin: 10px 0;
            background:rgba(250,250,250,1);
            border-radius:2px;
            img{
              vertical-align: text-bottom;
            }
            > p:nth-child(1){
              font-weight: bold;
            }
          }
        }
      }
      .list_more{
        width: 100%;
        height: 72px;
        display: flex;
        justify-content: center;
        align-items: center;
        >button{
          width: 166px;
          height: 32px;
          line-height: 6px;
        }
      }
    }
  }
  // 视频样式
  .vl_j_fullscreen {
    position: fixed;
    width: 100%!important;
    height: 100%!important;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: #000000;
    z-index: 9999;
    -webkit-transition: all .4s;
    -moz-transition: all .4s;
    -ms-transition: all .4s;
    -o-transition: all .4s;
    transition: all .4s;
    > video {
      width: 100%;
      height: 100%;
    }
    > .control_bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 48px;
      background: rgba(0, 0, 0, .65);
      > div {
        float: left;
        width: 50%;
        height: 100%;
        line-height: 48px;
        text-align: right;
        padding-right: 20px;
        color: #FFFFFF;
        &:first-child {
          text-align: left;
          padding-left: 20px;
        }
        > span {
          display: inline-block;
          height: 22px;
          margin-left: 10px;
          vertical-align: middle;
          cursor: pointer;
          a {
            font-size: 25px;
            text-decoration: none;
            color: #ffffff;
            vertical-align: top;
          }
        }
      }
    }
  }
  .vl_j_cutscreen {
    position: fixed;
    width: 90%!important;
    height: 90%!important;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: #FFFFFF;
    z-index: 9999;
    -webkit-transition: all .4s;
    -moz-transition: all .4s;
    -ms-transition: all .4s;
    -o-transition: all .4s;
    transition: all .4s;
    padding: 20px;
    margin: auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .close_btn {
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: .3rem;
    cursor: pointer;
    &:hover {
      color: #409EFF;
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

