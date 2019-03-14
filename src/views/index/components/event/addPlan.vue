<template>
  <vue-scroll>
    <div class="add-plan">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/ctcplan' }">调度预案</el-breadcrumb-item>
          <el-breadcrumb-item>新增预案</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <el-form :model="addPlanForm" ref="addPlanForm" :rules="rules" class="add-plan-form" size="small">
          <el-form-item label="预案名称:" prop="planName" label-width="120px">
            <el-input v-model="addPlanForm.planName" placeholder="请输入预案名称" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item label="预案类型:" label-width="120px" prop="eventType">
          <el-select v-model="addPlanForm.eventType" filterable allow-create placeholder="请选择预案类型" style="width: 500px;">
            <el-option
              v-for="(item, index) in planTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.uid"
            >
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="适用事件等级:" label-width="120px" prop="levelList">
            <el-select v-model="addPlanForm.levelList" :multiple="true" placeholder="请选择适用事件等级" style="width: 500px;">
              <el-option
                v-for="(item, index) in eventLevelList"
                :key="index"
                :label="item.enumValue"
                :value="item.uid"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预案正文:" label-width="120px" prop="planDetail">
            <el-input type="textarea" rows="7" style="width: 500px;" v-model="addPlanForm.planDetail" placeholder="请输入预案正文"></el-input>
          </el-form-item>
          <el-form-item label="附件：" label-width="120px">
            <el-upload
              style="width: 500px;"
              action="https://jsonplaceholder.typicode.com/posts/"
              accept='.txt.pdf,.doc,.docx,.ppt,.pptx'
              :on-success="handSuccess"
              :before-upload="beforeUpload"
              :limit="1"
              >
              <el-button size="small" icon="el-icon-upload2">上传文件</el-button>
              <div slot="tip" class="el-upload__tip plan-upload-tip">（支持：PDF、word、txt文档）</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="响应处置:" label-width="120px">
            <div class="response_box" v-for="(item, index) in addPlanForm.taskList" :key="index">
              <div class="plan_form_box">
                <div class="title">
                  <i class="vl_icon vl_icon_event_7" @click="deletePlanBox(index)" v-if="addPlanForm.taskList.length > 1"></i>
                </div>
                <el-form class="plan_form" label-width="90px" :model="item"  size="middle" >
                  <el-form-item label="执行部门:" :prop="item.departmentId" :rules ="[{ required: true, message: '请选择执行部门', trigger: 'blur' }]">
                    <el-select v-model="item.departmentId" style="width: 100%;" placeholder="请选择执行部门">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="任务名称:" :prop="item.taskName" :rules ="[{ required: true, message: '请输入任务名称', trigger: 'blur' }]">
                    <el-input v-model="item.taskName"></el-input>
                  </el-form-item>
                  <el-form-item label="任务内容:" :prop="item.taskContent" :rules ="[{ required: true, message: '请输入任务内容', trigger: 'blur' }]">
                    <el-input type="textarea" rows="8" v-model="item.taskContent"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <template v-if="addPlanForm.taskList.length === (index + 1)">
                <div class="add_ctc" @click="addTask">
                  <i class="vl_icon vl_icon_event_8"></i>
                  <span>添加协同部门</span>
                </div>
              </template>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn" @click="submitData('addPlanForm')">确定</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import { dataList } from '@/utils/data.js';
import { addPlan, getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      addPlanForm: {
        planName: null, // 预案名称
        eventType: null, // 预案类型
        levelList: [], // 事件等级
        planDetail: null, // 预案正文
        taskList: [
          {
            departmentName: null,
            taskName: null,
            taskContent: null,
            departmentId: null
          }
        ],
        url: null, // 附件
      },
      rules: {
        planName: [
          { required: true, message: '请输入预案名称', trigger: 'blur' },
          { max: 50, message: '最多输入50字'}
        ],
        eventType: [
          { required: true, message: '请输入或选择预案类型', trigger: 'blur' },
          { max: 50, message: '最多输入50字'}
        ],
        levelList: [
          { required: true, message: '请选择事件等级', trigger: 'blur' }
        ],
        planDetail: [
          { max: 10000, message: '最多输入10000字' }
        ]
      },
      planTypeList: [], // 预案类型
      eventLevelList: [], // 事件等级
    }
  },
  created () {
    this.getPlanTypeList();
    this.getEventLevelList();
  },
  methods: {
    // 获取预案类型
    getPlanTypeList () {
      const type = dataList.eventType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.planTypeList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取事件等级
    getEventLevelList () {
      const level = dataList.eventLevel;
      getDiciData(level)
        .then(res => {
          if (res) {
            this.eventLevelList = res.data;
          }
        })
        .catch(() => {})
    },
    // 上传成功
    handSuccess () {},
    // 在上传之前
    beforeUpload (file) {
      const isLt = file.size / 1024 / 1024 < 10;
      if (!isLt) {
        this.$message({
          type: 'warning',
          message: '上传文件大小不能超过 10MB!',
          customClass: 'upload_file_tip'
        });
      }
      return isLt;
    },
    addTask () {
      const value = {
        departmentName: null,
        taskName: null,
        taskContent: null,
        departmentId: null
      }
      this.addPlanForm.taskList.push(value);
    },
    deletePlanBox (index) { // 删除调度方法输入框
      this.addPlanForm.taskList.splice(index, 1);
    },
    // 提交数据
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          console.log(this.addPlanForm);
          addPlan(this.addPlanForm)
            .then(res => {
              if (res) {
                  this.$message({
                    type: 'success',
                    message: '添加成功',
                    customClass: 'request_tip'
                  })
                  this.$router.push({name: 'ctc_plan'});
              } else {
                  this.$message({
                    type: 'error',
                    message: '添加失败',
                    customClass: 'request_tip'
                  })
              }
            })
            .catch(() => {})
        }
      })
    },
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
.add-plan {
  width: 100%;
  .content-box {
    width: 97%;
    margin: 0 20px;
    background: #ffffff;
    margin-bottom: 100px;
    .add-plan-form {
      width: 100%;
      padding: 10px 0;
      /deep/ .el-form-item__label {
        color: #666666;
      }
      .plan-upload-tip {
        color: #999999;
      }
      /deep/ .el-upload-list {
        width: 40%;
      }
      .response_box {
        width: 500px;
        .plan_form_box {
          background-color: #FAFAFA;
          border-radius:2px;
          margin-bottom: 10px;
          .title {
            padding: 10px 20px 0;
            height: 30px;
            text-align: right;
            i {
              cursor: pointer;
              display: inline-block;
            }
          }
          .plan_form {
            padding: 3px 20px 5px;
            /deep/ .el-form-item {
              margin-bottom: 15px;
            }
          }
        }
        .add_ctc {
          width: 100%;
          height: 50px;
          line-height: 50px;
          margin-top: 15px;
          text-align: center;
          background-color: #ffffff;
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          border-radius:4px;
          border:1px dashed rgba(211,211,211,1);
          cursor: pointer;
          i {
            vertical-align: middle;
            margin-right: 5px;
          }
          > span {
            color: #0C70F8;
            vertical-align: middle;
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


