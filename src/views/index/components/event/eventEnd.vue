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
          <div class="error_tip">请填写事件总结</div>
          <div class="end-upload">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              accept='.png,.jpg,.bmp,.pdf,.doc,.docx,.ppt,.pptx'
              :before-upload='handleBeforeUpload'
              :on-success="handleSuccess"
              :disabled="isImgDisabled"
              :title="[isImgDisabled === true ? '禁用' : '']"
              :show-file-list='false'
              >
              <el-button size="small" class="upload-btn" icon="el-icon-upload2">上传文件</el-button>
              <div slot="tip" class="el-upload__tip end-upload-tip">（支持扩展名：.doc .docx .pdf .jpg…）</div>
            </el-upload>
            <div class="img_list">
              <div v-for="(item, index) in imgList2" :key="'item' + index">
                <img
                  :src="item.src"
                  @click="openBigImg(index, imgList2)"
                >
                <i class="vl_icon vl_icon_event_24 close_btn" @click="closeImgList(index, item)"></i>
              </div>
            </div>
            <div class="file_list">
              <div class='show-file-div-list' v-for="(item, index) in fileList" :key="'item'+index">
                <i class="vl_icon vl_icon_event_5"></i>
                <span>{{item.fileName}}</span>
                <i class='el-icon-close' @click="deleteFile(item, index)"></i>
              </div>
            </div>
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
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      isImgDisabled: false,
      imgList1: [], // 要放大的图片数据
      basicInfo: {}, // 事件详情
      fileList: [
        {
          fileName: '公共文档.docx'
        },
        {
          fileName: '公共文档.docx'
        },
        {
          fileName: '公共文档.docx'
        }
      ], // 要上传的文件列表
      imgList2: [
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
      imgList: [] // 图片列表
    }
  },
  mounted () {
    this.getDetail();
  },
  methods: {
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.id;
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            this.basicInfo = res.data;
          }
        })
        .catch(() => {})
    },
    handleSuccess (res, file) {
      if (res && res.data) {
        const fileName = res.data.fileName;
        let type;
        if (fileName) {
          type = fileName.substring(fileName.lastIndexOf('.'));
          console.log(type);
          let data;
          res.fileName = file.name;
          // if (type === '.png' || type === '.jpg' || type === '.bmp') {
          //   data = {
          //     attachmentType: dictType.imgId,
          //     url: res.data.newFileName,
          //     attachmentName: res.data.fileName,
          //     attachmentSize: res.data.fileSize,
          //     attachmentWidth: res.data.imageWidth,
          //     attachmentHeight: res.data.imageHeight,
          //     thumbnailUrl: res.data.thumbnailUrl,
          //     thumbnailWidth: res.data.thumbImageWidth,
          //     thumbnailHeight: res.data.thumbImageHeight
          //   }
          //   this.imgList2.push(res.data);
          // } else {
          //   data = {
          //     attachmentType: dictType.fileId,
          //     url: res.data.newFileName,
          //     attachmentName: res.data.fileName,
          //     attachmentSize: res.data.fileSize
          //   }
          //   this.fileList.push(res.data);
          // }
          this.endForm.attachmentList.push(data);
          this.isImgDisabled = false;
        }
      }
    },
    handleBeforeUpload (file) { // 附件上传之前
      this.isImgDisabled = true;
      const isLtTenM = file.size / 1024 / 1024 < 10;
      if (!isLtTenM) {
        this.$message.error('上传的附件大小不能超过10M');
        this.isImgDisabled = false;
      }
      return isLtTenM;
    },
    // 删除图片
    closeImgList (index) {
      this.imgList2.splice(index, 1);
      // this.endForm.attachmentList && this.endForm.attachmentList.map((item, idx) => {
      //   if (item.url === obj.newFileName) {
      //     this.endForm.attachmentList.splice(idx, 1);
      //   }
      // });
    },
    deleteFile (obj, index) { // 删除文件
      this.fileList.splice(index, 1);
      // this.endForm.attachmentList && this.endForm.attachmentList.map((item, idx) => {
      //   if (item.url === obj.newFileName) {
      //     this.endForm.attachmentList.splice(idx, 1);
      //   }
      // });
    },
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 图片放大传参
    emitHandleImg (isShow, index) {
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
        padding: 20px 20px 10px;
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
      .error_tip {
        margin-left: 110px;
        margin-bottom: 10px;
        color: #F94539;
      }
      .end-upload {
        margin-left: 110px;
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
        .img_list {
          display: flex;
          >div {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 5px 5px 0;
            cursor: pointer;
            img {
              border-radius: 4px;
              margin-right: 5px;
              width: 100%;
              height:100%;
            }
            .close_btn {
              position: absolute;
              right: 0;
              top: 0;
              cursor: pointer;
            }
          }
        }
        .file_list {
          .show-file-div-list {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            margin-top: 10px;
            span {
              // color: #0785FD;
              font-size: 14px;
              margin: 0 5px;
            }
            i {
              font-size: 18px;
              color: #5D5D5D;
              cursor: pointer;
            }
          }
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

