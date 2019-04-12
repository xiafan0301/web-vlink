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
        <EventBasic :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
        <div class="report-operation">
          <el-form :model="reportForm" class="report-form" size="middle" :rules="rules" ref="reportForm">
            <el-form-item label="接收者:" label-width="100px" prop="reportUser" class="report_user">
              <el-select
                style="width: 100%;"
                v-model="reportForm.reportUser"
                multiple
                filterable
                remote
                allow-create
                reserve-keyword
                :multiple-limit="50"
                placeholder="请输入或选择接收者"
                :remote-method="remoteMethod"
                :loading="loading">
                <el-option
                  v-for="item in options4"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="情况说明:" label-width="100px" prop="explain">
              <el-input type="textarea" rows="6" v-model="reportForm.explain"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn" @click="submitData">确定提交</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
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
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail } from '@/views/index/api/api.event.js';
import BigImg from './components/bigImg.vue';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      options4: [],
      list: [],
      loading: false,
      states: ["Alabama", "Alaska", "Arizona",
        "Arkansas", "California", "Colorado",
        "Connecticut", "Delaware", "Florida",
        "Georgia", "Hawaii", "Idaho", "Illinois",
        "Indiana", "Iowa", "Kansas", "Kentucky",
        "Louisiana", "Maine", "Maryland",
        "Massachusetts", "Michigan", "Minnesota",
        "Mississippi", "Missouri", "Montana",
        "Nebraska", "Nevada", "New Hampshire",
        "New Jersey", "New Mexico", "New York",
        "North Carolina", "North Dakota", "Ohio",
        "Oklahoma", "Oregon", "Pennsylvania",
        "Rhode Island", "South Carolina",
        "South Dakota", "Tennessee", "Texas",
        "Utah", "Vermont", "Virginia",
        "Washington", "West Virginia", "Wisconsin",
        "Wyoming"
      ],
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [],
      isMatchUser: false, // 输入接收者是否有匹配
      dialogVisible: false, // 提示弹出框
      reportForm: {
        reportUser: [], // 接收者
        explain: null // 情况说明
      },
      rules: {
        reportUser: [
          { required: true, message: '请选择或输入接收者', trigger: 'blur' }
        ],
        explain: [
          { required: true, message: '请输入情况说明', trigger: 'blur' },
          { max: 1000, message: '最多输入1000字' }
        ]
      },
      userList: [
        { userName: '张三' },
        { userName: '里斯' },
        { userName: '李四李四李四李四' },
        { userName: '王李四五' },
        { userName: '王李四五' },
        { userName: '李四' },
        { userName: '李敏' },
      ],
      reportUserList: [], // 所有的接收者
      basicInfo: {}, // 事件详情
    }
  },
  mounted () {
    this.list = this.states.map(item => {
      return { value: item, label: item };
    });
    this.getDetail();
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options4 = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options4 = [];
      }
    },
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.eventId;
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            this.basicInfo = res.data;
          }
        })
        .catch(() => {})
    },
    // 提交数据
    submitData () {
      this.dialogVisible = true;
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
        .report_user {
          width: 100%;
          .report_user_box {
            border: 1px solid #dcdfe6;
            min-height: 40px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            position: relative;
            padding: 3px;
            .add_text {
              max-width: 100%;
              width: 13px;
              white-space: nowrap;
              overflow: hidden;
              .input_user {
                width: 100%;
              }
              /deep/ .el-input__inner {
                border: 0;
                padding: 0;
              }
              .hidden_box {
                width: auto;
                display: none;
              }
            }
            .report_user_list {
              width: auto;
              white-space: nowrap;
              height: 32px;
              line-height: 32px;
              padding: 0 5px;
              margin: 0 3px;
              border-radius: 2px;
              background-color: #F2F2F2;
              color: #000000;
              >span {
                  padding: 0 5px;
                }
                i {
                  font-size: 20px;
                  vertical-align: middle;
                  cursor: pointer;
                }
            }
             .search-result {
              width: calc(100% - 100px);
              height: 200px;
              position: absolute;
              bottom: -203px;
              left: 0;
              box-shadow:0px 2px 8px 0px rgba(0,0,0,0.15);
              border-radius:4px;
              z-index: 1;
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


