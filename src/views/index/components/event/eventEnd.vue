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
        <EventBasic :status="$route.query.status"></EventBasic>
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
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
export default {
  components: { EventBasic },
  data () {
    return {
      eventSummary: null, // 事件总结
      fileList: [], // 文件上传列表
    }
  },
  methods: {
    handleChange () {},
    // 返回
    back () {
      this.$router.back(-1);
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

