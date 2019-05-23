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
          <el-form-item label="预案类型:" label-width="120px" prop="editEventType">
          <el-select v-model="addPlanForm.editEventType" filterable allow-create placeholder="请选择预案类型" style="width: 500px;">
            <el-option
              v-for="(item, index) in planTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumValue"
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
                :value="item.enumField"
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
              :action="uploadUrl"
              accept='.txt,.pdf,.doc,.docx'
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
                <el-form class="plan_form" label-width="90px" :model="item" size="middle" >
                  <el-form-item label="执行部门:"  label-position="left">
                    <el-select v-model="item.departmentId" style="width: 100%;" placeholder="请选择执行部门">
                      <el-option
                        v-for="(item, index) in departmentList"
                        :key="'item' + index"
                        :label="item.organName"
                        :value="item.uid">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="任务名称:">
                    <el-input v-model="item.taskName"  placeholder="请输入任务名称" @change="changeTaskName(item.taskName, index)"></el-input>
                    <span v-show="item.isError && item.isError" style="color: #F56C6C;font-size:12px;">最多输入140个字</span>
                  </el-form-item>
                  <el-form-item label="任务内容:">
                    <el-input type="textarea" rows="8"  placeholder="请输入任务内容" @change="changeTaskContent(item.taskContent, index)" v-model="item.taskContent"></el-input>
                    <span v-show="item.isContentError && item.isContentError" style="color: #F56C6C;font-size:12px;">最多输入1000个字</span>
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
        <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="submitData('addPlanForm')">确定</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import { dataList } from '@/utils/data.js';
import { ajaxCtx } from '@/config/config.js';
import { addPlan } from '@/views/index/api/api.event.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      uploadUrl: ajaxCtx.base + '/new', // 文件上传地址
      addPlanForm: {
        planName: null, // 预案名称
        editEventType: null, // 预案类型
        eventType: null, // 预案类型
        eventTypeName: null, // 新添加的预案类型名称
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
        sysAppendixInfo: null
      },
      rules: {
        planName: [
          { required: true, message: '请输入预案名称', trigger: 'blur' },
          { max: 50, message: '最多输入50字'}
        ],
        editEventType: [
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
      userInfo: {}, // 存储的用户信息
      departmentList: [], // 部门列表
      isAddLoading: false,
      isShowName: false, // 是否显示任务名称的错误提示
      isShowContent: false, // 是否显示任务内容的错误提示
    }
  },
  created () {
    this.userInfo =  this.$store.state.loginUser;
    this.getPlanTypeList();
    this.getEventLevelList();
    this.getDepartList();
  },
  methods: {
    // 获取预案类型
    getPlanTypeList () {
      const type = dataList.planType;
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
    // 获取部门列表
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res) {
            this.departmentList = res.data.list;
          }
        })
        .catch(() => {})
    },
    // 上传成功
    handSuccess (res) {
      if (res && res.data) {
        const fileName = res.data.fileName;
        let data;
        if (fileName) {
          data = {
            contentUid: 0,
            fileType: dataList.fileId,
            path: res.data.fileFullPath,
            filePathName: res.data.filePath,
            cname: res.data.fileName,
            imgSize: res.data.fileSize,
            imgWidth: res.data.fileWidth,
            imgHeight: res.data.fileHeight,
            thumbnailPath: res.data.thumbnailFileFullPath,
          }
          this.addPlanForm.sysAppendixInfo = JSON.parse(JSON.stringify(data));
        }
      }
    },
    // 在上传之前
    beforeUpload (file) {
      console.log(file)
      const isLt = file.size / 1024 / 1024 < 10;
      const isWord = file.type === 'text/plain' || file.type === 'application/msword' 
        || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        || file.type === 'application/pdf';
      if (!isWord) {
        this.$message({
          type: 'warning',
          message: '上传文件只能是txt、pdf、word格式!',
          customClass: 'upload_file_tip'
        });
      }
      if (!isLt) {
        this.$message({
          type: 'warning',
          message: '上传文件大小不能超过 10MB!',
          customClass: 'upload_file_tip'
        });
      }
      return isLt && isWord;
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
    // 判断taskList是否都填写完
    judgeData () {
      let _this = this;
      return new Promise((resolve) => {
        let arr = [];
        _this.addPlanForm.taskList.map((item, index) => {
          if (!item.departmentId || !item.taskName || !item.taskContent) {
            arr.push(index); // 将没有填写完的内容的item存到一个数组中
            this.$message({
              type:'warning',
              message: '请先填写完内容',
              customClass: 'request_tip'
            });
          }
        })
        if (arr.length > 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
    },
    // 提交数据
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let filterArr = this.planTypeList.filter(val => {
            return val.enumValue === this.addPlanForm.editEventType;
          });
          if (filterArr.length === 0) {
            this.addPlanForm.eventTypeName = this.addPlanForm.editEventType;
          } else {
            this.addPlanForm.eventType = filterArr[0].enumField;
          }
          this.judgeData().then(result => {
            if (result) {
              this.addPlanForm.taskList.map((item, index) => {
                this.departmentList.map(itm => {
                  if (item.departmentId === itm.uid) {
                    this.addPlanForm.taskList[index].departmentName = itm.organName;
                  }
                });
              });
              let isResult = this.addPlanForm.taskList.filter(val => {
                return val.isError === true || val.isContentError === true;
              });
              if (isResult.length === 0) {
                this.isAddLoading = true;
                addPlan(this.addPlanForm)
                  .then(res => {
                    if (res) {
                      this.$message({
                        type: 'success',
                        message: '添加成功',
                        customClass: 'request_tip'
                      })
                      this.$router.push({name: 'event_ctcplan'});
                      this.isAddLoading = false;
                    } else {
                      this.isAddLoading = false;
                    }
                  })
                  .catch(() => {this.isAddLoading = false;})
              }
            }
          }) 
        }
      })
    },
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 任务名称change
    changeTaskName (val, index) {
      if (val) {
        if (val.length > 140) {
          this.addPlanForm.taskList[index].isError = true;
        } else {
          this.addPlanForm.taskList[index].isError = false;
        }
      } else {
        this.addPlanForm.taskList[index].isError = false;
      }
      this.addPlanForm.taskList = JSON.parse(JSON.stringify(this.addPlanForm.taskList));
    },
    // 任务内容change
    changeTaskContent (val, index) {
      if (val) {
        if (val.length > 1000) {
          this.addPlanForm.taskList[index].isContentError = true;
        } else {
          this.addPlanForm.taskList[index].isContentError = false;
        }
      } else {
        this.addPlanForm.taskList[index].isContentError = false;
      }
      this.addPlanForm.taskList = JSON.parse(JSON.stringify(this.addPlanForm.taskList));
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


