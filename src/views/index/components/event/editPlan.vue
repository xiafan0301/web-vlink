<template>
  <vue-scroll>
    <div class="edit-plan">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/ctcplan' }">调度预案</el-breadcrumb-item>
          <el-breadcrumb-item>修改预案</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <el-form :model="editPlanForm" ref="editPlanForm" :rules="rules" class="edit-plan-form" size="small">
          <el-form-item label="预案名称:" prop="planName" label-width="120px">
            <el-input v-model="editPlanForm.planName" placeholder="请输入预案名称" style="width: 500px;" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="预案类型:" label-width="120px" prop="editEventType">
          <el-select v-model="editPlanForm.editEventType" filterable allow-create placeholder="请选择预案类型" style="width: 500px;" maxlength="50">
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
            <el-select v-model="editPlanForm.levelList" :multiple="true" placeholder="请选择适用事件等级" style="width: 500px;">
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
            <el-input type="textarea" rows="7" style="width: 500px;" v-model="editPlanForm.planDetail" placeholder="请输入预案正文" maxlength="10000"></el-input>
          </el-form-item>
          <el-form-item label="附件：" label-width="120px">
            <el-upload
              style="width: 500px;"
              accept='.txt,.pdf,.doc,.docx'
              :action="uploadUrl"
              :on-success="handSuccess"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              :limit="1"
              :file-list="fileList">
              <el-button size="small" icon="el-icon-upload2">上传文件</el-button>
              <div slot="tip" class="el-upload__tip plan-upload-tip">（支持：PDF、word、txt文档）</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="响应处置:" label-width="120px" class="response_handle">
            <div class="response_box" v-for="(item, index) in editPlanForm.taskList" :key="index">
              <div class="plan_form_box">
                <div class="title">
                  <i class="vl_icon vl_icon_event_7" @click="deletePlanBox(index)" v-show="editPlanForm.taskList.length > 1"></i>
                </div>
                <el-form class="plan_form" label-width="90px" :model="item"  size="middle" >
                  <el-form-item label="执行部门:">
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
                    <el-input v-model="item.taskName" @change="changeTaskName(item.taskName, index)" placeholder="请输入任务名称" maxlength="140"></el-input>
                    <span v-show="item.isError && item.isError" style="color: #F56C6C;font-size:12px;">最多输入140个字</span>
                  </el-form-item>
                  <el-form-item label="任务内容:">
                    <el-input type="textarea" rows="8" @change="changeTaskContent(item.taskContent, index)" v-model="item.taskContent" placeholder="请输入任务内容" maxlength="1000"></el-input>
                    <span v-show="item.isContentError && item.isContentError" style="color: #F56C6C;font-size:12px;">最多输入1000个字</span>
                  </el-form-item>
                </el-form>
              </div>
              <template v-if="editPlanForm.taskList.length === (index + 1)">
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
        <el-button class="operation_btn function_btn" :loading="isEditLoading" @click="submitData('editPlanForm')">确定</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import { dataList } from '@/utils/data.js';
import { ajaxCtx } from '@/config/config.js';
import { getPlanDetail, updatePlan } from '@/views/index/api/api.event.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      uploadUrl: ajaxCtx.base + '/new', // 文件上传地址
      editPlanForm: {
        taskList: [],
        editEventType: null, // 预案类型
        levelList: [],
        eventType: null,
        eventTypeName: null,
        planName: null,
        planDetail: null,
        sysAppendixInfo: {},
        uid: null,
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
      fileList: [],
      departmentList: [],
      planTypeList: [], // 预案类型
      eventLevelList: [], // 事件等级
      userInfo: {},
      isEditLoading: false
    }
  },
  created () {
    this.userInfo =  this.$store.state.loginUser;
    this.getPlanTypeList();
    this.getEventLevelList();
  },
  mounted () {
    this.getDepartList();
    this.getPlanDetailInfo();
  },
  methods: {
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
    // 删除附件
    handleRemove (file) {
      if (file) {
        this.editPlanForm.sysAppendixInfo = null;
      }
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
          this.editPlanForm.sysAppendixInfo = JSON.parse(JSON.stringify(data));
        }
      }
    },
    // 在上传之前
    beforeUpload (file) {
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
      this.editPlanForm.taskList.push(value);
    },
    deletePlanBox (index) { // 删除调度方法输入框
      this.editPlanForm.taskList.splice(index, 1);
    },
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 获取预案详情
    getPlanDetailInfo () {
      const planId = this.$route.query.planId;
      getPlanDetail(planId)
        .then(res => {
          if (res) {
            this.editPlanForm.uid = res.data.uid;
            this.editPlanForm.planName = res.data.planName;
            this.editPlanForm.planDetail = res.data.planDetail;
            this.editPlanForm.sysAppendixInfo = JSON.parse(JSON.stringify(res.data.sysAppendixInfo));
            this.editPlanForm.editEventType =  res.data.eventTypeName;

            if (res.data.taskList) {
              res.data.taskList.map(item => {
                const params = {
                  departmentId: item.departmentId,
                  departmentName: item.departmentName,
                  taskName: item.taskName,
                  taskContent: item.taskContent
                };
                this.editPlanForm.taskList.push(params);
              })
            }
            if (res.data.sysAppendixInfo) {
              this.fileList.push({
                name: res.data.sysAppendixInfo.cname,
                url: res.data.sysAppendixInfo.path
              })
            }
            if (res.data.levelList) {
              res.data.levelList.map(item => {
                let planLevel = item.planLevel;
                this.editPlanForm.levelList.push(planLevel.toString());
              })
            }
          }
        })
        .catch(() => {})
    },
    // 判断taskList是否都填写完
    judgeData () {
      let _this = this;
      return new Promise((resolve) => {
        let arr = [];
        _this.editPlanForm.taskList.map((item, index) => {
          if (!item.departmentId || !item.taskName || !item.taskContent) {
            arr.push(index); // 将没有填写完的内容的item存到一个数组中
            this.$message({
              type:'warning',
              message: '请先填写完内容',
              customClass: 'request_tip'
            })
          }
        })
        if (arr.length > 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
    },
    // 提交数据----修改预案
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let filterArr = this.planTypeList.filter(val => {
            return val.enumValue == this.editPlanForm.editEventType;
          });
          if (filterArr.length === 0) {
            this.editPlanForm.eventTypeName = this.editPlanForm.editEventType;
          } else {
            this.editPlanForm.eventType = filterArr[0].enumField;
          }
          // this.editPlanForm.editEventType = null;
          if (this.editPlanForm.sysAppendixInfo) {
            this.editPlanForm.sysAppendixInfo.uid = null;
          }
          this.judgeData().then(result => {
            if (result === true) {
              this.editPlanForm.taskList.map((item, index) => {
                this.departmentList.map(itm => {
                  if (item.departmentId === itm.uid) {
                    this.editPlanForm.taskList[index].departmentName = itm.organName;
                  }
                });
              });
              let isResult = this.editPlanForm.taskList.filter(val => {
                return val.isError === true || val.isContentError === true;
              });
              if (isResult.length === 0) {
                this.isEditLoading = true;
                updatePlan(this.editPlanForm)
                  .then(res => {
                    if (res) {
                      this.$message({
                        type: 'success',
                        message: '修改成功',
                        customClass: 'request_tip'
                    });
                      this.$router.push({name: 'event_ctcplan'});
                      this.isEditLoading = false;
                    } else {
                      this.isEditLoading = false;
                    }
                  })
                  .catch(() => {this.isEditLoading = false;})
              }
            }
          })
        }
      })
    },
    // 任务名称change
    changeTaskName (val, index) {
      if (val) {
        if (val.length > 140) {
          this.editPlanForm.taskList[index].isError = true;
        } else {
          this.editPlanForm.taskList[index].isError = false;
        }
      } else {
        this.editPlanForm.taskList[index].isError = false;
      }
      this.editPlanForm.taskList = JSON.parse(JSON.stringify(this.editPlanForm.taskList));
    },
    // 任务内容change
    changeTaskContent (val, index) {
      if (val) {
        if (val.length > 1000) {
          this.editPlanForm.taskList[index].isContentError = true;
        } else {
          this.editPlanForm.taskList[index].isContentError = false;
        }
      } else {
        this.editPlanForm.taskList[index].isContentError = false;
      }
      this.editPlanForm.taskList = JSON.parse(JSON.stringify(this.editPlanForm.taskList));
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-plan {
  width: 100%;
  .content-box {
    width: 97%;
    margin: 0 20px;
    background: #ffffff;
    margin-bottom: 100px;
    .edit-plan-form {
      width: 100%;
      padding: 10px 0;
      .response_handle {
        /deep/ .el-form-item__label:before {
          content: '*';
          color: #F56C6C;
          margin-right: 4px;
        }
      }
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
            padding: 10px 20px;
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
