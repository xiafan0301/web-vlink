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
        <EventBasic :basicInfo="basicInfo"></EventBasic>
        <div class="report-operation">
          <el-form :model="reportForm" class="report-form" size="middle" :rules="rules" ref="reportForm">
            <el-form-item label="接收者:" label-width="100px" prop="reportUser" class="report_user">
              <div class="report_user_box">
                <div
                  class="report_user_list"
                  v-for="(item, index) in reportUserList"
                  :key="index"
                >
                  <span>{{item}}</span>
                  <i class="el-icon-close" @click="closeUser(index)"></i>
                </div>
                <div class="add_text">
                  <el-input :autofocus="true" class="input_user" v-model="reportForm.reportUser" @input="selectUser"></el-input>
                  <div class="hidden_box"></div>
                </div>
                <template v-if="isMatchUser">
                  <div class="search-result">
                    <vue-scroll>
                      <ul>
                        <li
                          v-for="(item, index) in userList"
                          :key="index"
                          @click="getUserName(item.userName)"
                        >
                          {{item.userName}}
                        </li>
                      </ul>
                    </vue-scroll>
                  </div>
                </template>
              </div>
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
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail } from '@/views/index/api/api.js';
export default {
  components: { EventBasic },
  data () {
    return {
      isMatchUser: false, // 输入接收者是否有匹配
      dialogVisible: false, // 提示弹出框
      reportForm: {
        reportUser: null, // 接收者
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
      basicInfo: {
        eventCode: 'XD111111111111111',
        eventTypeName: '自然灾害',
        eventLevelName: 'V级',
        reportTime: '2019-03-12',
        reporterPhone: '18076543210',
        eventAddress: '湖南省长沙市天心区创谷产业工业园',
        casualties: -1,
        eventDetail: '爱丽丝的煎熬了就爱上邓丽君爱上了的就爱上了大家看ask啦撒赖扩大就阿斯顿卢卡斯爱上了卡盎司伦敦快乐打卡是卡拉卡斯底库；啊撒扩大；扩大卡的可撒赖打开撒爱上了打开奥昇卡是；啊撒扩大；爱上了底库；案例的伤口看了',
      }, // 事件详情
    }
  },
  // watch: {
  //   'reportForm.reportUser': function () {
  //     if (this.reportForm.reportUser) {
  //       let reportUser = this.reportForm.reportUser;
  //       $('.hidden_box').text(reportUser);
  //       let width = $('.hidden_box').width();
  //       $('.add_text').css('width', width + 'px');
  //     }
  //   }
  // },
  mounted () {
    
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
    // 提交数据
    submitData () {
      this.dialogVisible = true;
    },
    // 获取选中的用户姓名, 并添加到输入框中
    getUserName (name) {
      if (name) {
        this.reportUserList.push(name);
        this.reportForm.reportUser = null;
        this.isMatchUser = false;
      }
    },
    // 删除已选的接收者
    closeUser (index) {
      this.reportUserList.splice(index, 1);
    },
    // 输入框选择change
    selectUser (val) {
      if (this.reportForm.reportUser) {
        let reportUser = this.reportForm.reportUser;
        $('.hidden_box').text(reportUser); // 
        let width = $('.hidden_box').width();
        $('.add_text').css('width', width + 'px'); // 设置输入框的宽度
        this.isMatchUser = true;
      }
    },
    // 返回
    back () {
      this.$router.back(-1);
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


