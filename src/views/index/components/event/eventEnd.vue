<template>
  <vue-scroll>
    <div class="event-end">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/untreatEventDetail' }">事件详情</el-breadcrumb-item>
          <el-breadcrumb-item>结束事件</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
        <div class="end-body">
          <div class="end-content">
            <span>事件总结:</span>
            <el-input type="textarea" rows="7" v-model="eventSummary" size="small" placeholder="请填写或者上传事件总结"></el-input>
          </div>
          <div class="end-upload">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange"
              :file-list="fileList">
              <el-button size="small" class="upload-btn" icon="el-icon-upload2">上传文件</el-button>
              <div slot="tip" class="el-upload__tip end-upload-tip">（支持扩展名：.doc .docx .pdf .jpg…）</div>
            </el-upload>
          </div>
        </div>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn" @click="submitData">确定</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail } from '@/views/index/api/api.js';
import BigImg from './components/bigImg.vue';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      eventSummary: null, // 事件总结
      fileList: [], // 文件上传列表
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [],
      basicInfo: {
        eventCode: 'XD111111111111111',
        eventTypeName: '自然灾害',
        eventLevelName: 'V级',
        reportTime: '2019-03-12',
        reporterPhone: '18076543210',
        eventAddress: '湖南省长沙市天心区创谷产业工业园',
        casualties: -1,
        imgList: [
          {
            uid: '001',
            src: require('./img/1.jpg')
          },
          {
            uid: '002',
            src: require('./img/2.jpg')
          },
          {
            uid: '003',
            src: require('./img/3.jpg')
          },
          {
            uid: '004',
            src: require('./img/4.jpg')
          }
        ],
        eventDetail: '爱丽丝的煎熬了就爱上邓丽君爱上了的就爱上了大家看ask啦撒赖扩大就阿斯顿卢卡斯爱上了卡盎司伦敦快乐打卡是卡拉卡斯底库；啊撒扩大；扩大卡的可撒赖打开撒爱上了打开奥昇卡是；啊撒扩大；爱上了底库；案例的伤口看了',
      }, // 事件详情
    }
  },
  methods: {
    // 获取事件详情
    getDetail () {
      const eventId = '';
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            this.basicInfo = res.data;
          }
        })
        .catch(() => {})
    },
    handleChange () {},
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 图片放大传参
    emitHandleImg (isShow, index) {
      console.log(isShow);
      console.log(index);
      this.openBigImg(index, this.basicInfo.imgList);
    },
    // 关闭图片放大
    emitCloseImgDialog(data){
      this.imgList1 = [];
      this.isShowImg = data;
    },
    // 放大图片
    openBigImg (index, data) {
      this.isShowImg = true;
      this.imgIndex = index;
      this.imgList1 = JSON.parse(JSON.stringify(data));
    },
    // 结束事件
    submitData () {

    }
  }
}
</script>

<style lang="scss" scoped>
.event-end {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .end-body {
      width: 100%;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .end-content {
        width: 60%;
        display:flex;
        padding: 20px;
        > span {
          color: #666666;
          width: 90px;
          margin-right: 10px;
          text-align: right;
        }
        > div {
          width: 100%;
          margin-top: -10px;
        }
      }
      .end-upload {
        margin-left: 90px;
        width: 60%;
        padding-bottom: 20px;
        .upload-btn {
          border: 1px solid #D3D3D3;
          background-color: #ffffff;
          color: #333333;
        }
        .end-upload-tip {
          color: #999999;
          margin: 10px 0;
          font-size: 14px;
        }
        /deep/ .el-upload-list__item {
          width: 40%;
        }
      }
    }
  }
  .operation-footer {
    border-left: 1px solid #F2F2F2;
    width: 100%;
    height: 65px;
    line-height: 65px;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    padding-left: 20px;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
}
</style>

