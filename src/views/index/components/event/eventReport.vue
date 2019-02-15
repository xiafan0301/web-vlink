<template>
  <vue-scroll>
    <div class="event-report">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/untreatEventDetail' }">事件详情</el-breadcrumb-item>
          <el-breadcrumb-item>向上级呈报</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic></EventBasic>
        <div class="report-operation">
          <el-form :model="reportForm" class="report-form" size="middle">
            <el-form-item label="接收者:" label-width="100px">
              <el-input v-model="reportForm.reportUser"></el-input>
            </el-form-item>
            <el-form-item label="情况说明:" label-width="100px">
              <el-input type="textarea" rows="6" v-model="reportForm.explain"></el-input>
            </el-form-item>
            <div class="search-result">
              <vue-scroll>
                <ul>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                </ul>
              </vue-scroll>
            </div>
          </el-form>
        </div>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn" @click="submitData">确定提交</el-button>
        <el-button class="operation_btn back_btn">返回</el-button>
      </div>
      <!--提交弹出框-->
      <el-dialog
        :visible.sync="dialogVisible"
        :show-close="false"
        class="dialog_comp"
        width="482px"
        >
        <div class="content-body">
          <i class="el-icon-success"></i>
          <p class="submit-status">提交成功</p>
          <p class="submit-tip">上级有新的指示后，将会在页面顶部 “任务”栏中提示。</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">我知道了</el-button>
        </span>
      </el-dialog>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
export default {
  components: { EventBasic },
  data () {
    return {
      dialogVisible: false, // 提示弹出框
      reportForm: {
        reportUser: null, // 接收者
        explain: null // 情况说明
      }
    }
  },
  methods: {
    // 提交数据
    submitData () {
      this.dialogVisible = true;
    }
  }
}
</script>
<style lang="scss" scoped>
.event-report {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .report-operation {
      width: 100%;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .report-form {
        width: 50%;
        padding: 20px 0;
        position: relative;
        .search-result {
          width: calc(100% - 100px);
          height: 200px;
          position: absolute;
          top: 65px;
          left: 100px;
          box-shadow:0px 2px 8px 0px rgba(0,0,0,0.15);
          border-radius:4px;
          background-color: #ffffff;
          .__view {
            > ul {
              width: 100%;
              height: 100%;
              > li {
                width: 100%;
                height: 40px;
                color: #333333;
                padding-left: 20px;
                line-height: 40px;
                &:hover {
                  cursor: pointer;
                  background-color: #EDF9FF;
                  color: #333333;
                }
              }
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
  .dialog_comp {
    .content-body {
      width: 50%;
      text-align: center;
      margin-left: 25%;
      i {
        font-size: 100px;
        color: #4FCB61;
      }
      .submit-status {
        color: #333333;
        font-size: 16px;
        margin: 20px 0;
      }
      .submit-tip {
        color: #999999;
      }
    }
  }
}
</style>


