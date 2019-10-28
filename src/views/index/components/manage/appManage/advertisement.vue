<template>
  <div class="advertisement_manage">
    <div class="reset_bread" is="vlBreadcrumb" :breadcrumbData="[{name: '系统管理'},{name: '广告管理'}]"></div>
    <div class="ad_content">
      <div class="display_settings">
        <p class="ad_top">展示设置</p>
        <!-- 展示设置 -->
        <div class="display_s_content">
            <!-- 展示数量 -->
          <div class="num_info">
            <label>展示数量：</label>
            <el-select v-model="displaySetting.num" placeholder="请选择">
              <el-option
                v-for="item in numList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <!-- 轮换时间 -->
          <div class="time_info">
            <label>轮换时间：</label>
            <el-select v-model="displaySetting.time" placeholder="请选择">
              <el-option
                v-for="item in timeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="opt_btn">
            <el-button type="primary" @click="save">保 存</el-button>
        </div>
        </div>
      </div>
      <div class="none_box"></div>
      <div class="ad_list">
        <p class="ad_top">广告列表</p>
        <div class="opt_btn">
            <el-button type="primary" v-if="dataList && dataList.length > 9" disabled>新 增</el-button>
            <el-button type="primary" v-else @click="addAdv">新 增</el-button>
        </div>
        <div class="table_box">
              <el-table :data="dataList">
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column label="广告标题" prop="adTitle" show-overflow-tooltip></el-table-column>
                <el-table-column label="跳转链接" prop="jumpUrl" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="150" align="center">
                  <template slot-scope="scope">
                    <span class="operation_btn" @click="editAdv(scope.row)">编辑</span>
                    <span class="operation_btn" v-if="dataList && dataList.length > 1" @click="delAdv(scope.row)">删除</span>
                    <span class="operation_btn gary_color" v-else disabled>删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
      </div>
    </div>
    <!--创建/编辑广告弹出框-->
    <el-dialog
      :title="title"
      :visible.sync="adDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp ad_dialog"
    >
      <el-form
        :model="adForm"
        ref="adForm"
        :rules="adRules"
        label-position="right"
        label-width="12px"
      >
        <el-form-item label=" " prop="name">
          <el-input v-model="adForm.name" placeholder="请输入20字以内的广告标题"></el-input>
        </el-form-item>
        <el-form-item label=" " class="upload_file">
          <div class="main_content">
              <el-upload
                ref="deviceImport"
                :action="uploadUrl"
                accept=".jpg, .png, .jpeg, .gif, .ico, .tif, tiff"
                :on-change="handleChange"
                :before-remove="beforeRemove"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
                :on-success='handleSuccess'
                :file-list="fileList"
                :limit="1"
              >
                <el-button size="small" class="upload-btn" icon="vl_icon el-icon-upload2">上传广告图片</el-button>
                <div slot="tip" class="el-upload__tip">
                    <p>（只能上传图片格式文件）</p>
                    <p v-if="!isShow"></p>
                    <p v-else class="error_tip">请上传广告图片</p>
                </div>
              </el-upload>
            </div>
        </el-form-item>
        <el-form-item label=" " prop="path">
          <el-input v-model="adForm.path" placeholder="请输入跳转路径"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer footer_btn">
        <el-button @click="resetForm('adForm')">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm('adForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--单个删除广告弹出框-->
    <el-dialog
      title="删除提示"
      :visible.sync="delDialog"
      width="430px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp del_dialog"
    >
      <p>删除后不可恢复，确认要删除该数据吗？</p>
      <div slot="footer" class="dialog-footer footer_btn">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="deleteItem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import { ajaxCtx } from '@/config/config.js';
import { getAllAd, getCountSpeed, postAd, putAd, putCountSpeed, deleteAd } from '@/views/index/api/api.manage.js';
export default {
  components: { vlBreadcrumb },
  data() {
    return {
      numList: [
        {
          value: "1",
          label: "1"
        },
        {
          value: "2",
          label: "2"
        },
        {
          value: "3",
          label: "3"
        },
        {
          value: "4",
          label: "4"
        },
        {
          value: "5",
          label: "5"
        },
        {
          value: "6",
          label: "6"
        },
        {
          value: "7",
          label: "7"
        },
        {
          value: "8",
          label: "8"
        },
        {
          value: "9",
          label: "9"
        },
        {
          value: "10",
          label: "10"
        }
      ],
      timeList: [
        {
          value: "5",
          label: "5秒"
        },
        {
          value: "10",
          label: "10秒"
        },
        {
          value: "15",
          label: "15秒"
        },
        {
          value: "20",
          label: "20秒"
        },
        {
          value: "25",
          label: "25秒"
        },
        {
          value: "30",
          label: "30秒"
        }
      ],
      displaySetting: {
          num: '1',
          time: '5'
      },
      dataList: [],
      title: "添加",
      adDialog: false,
      adForm: {
        name: "",
        path: "",
      },
      adRules: {
        name: [
          { required: true, message: "请输入20字以内的广告标题", trigger: "blur" },
          { min: 1, max: 20, message: "最长20字广告标题", trigger: "blur" }
        ],
        path: [
          { min: 0, max: 100, message: "有效长度为0-100", trigger: "blur" }
        ],
      },
      isLoading: false,
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      fileList: [],
      isShow: false,
      delDialog: false,
      delItem: {},
      adLogoUrl: '',
    };
  },
  mounted() {
    this.getAllAdList()
    this.getDisplaySetting()
  },
  methods: {
    // 删除
    deleteItem() {
      let params = {
        uid: this.delItem.uid
      }
      this.isLoading = true
      deleteAd(params).then(res => {
        if(res) {
          this.delDialog = false
          this.$MyMessage("删除广告成功！", 'success');
          this.getAllAdList()
        }
        this.$nextTick(() => {
          this.isLoading = false
        })
      }).catch(() => {
        this.isLoading = false
      })
    },
    // 广告位【查询所有】接口
    getAllAdList() {
      getAllAd().then(res => {
        if(res && res.data) {
          this.dataList = res.data
        }
      })
    },
    // 展示数量和轮换速度【查询】接口
    getDisplaySetting() {
      getCountSpeed().then(res => {
        if(res && res.data) {
          this.$set(this.displaySetting, 'num', res.data.showCount)
          this.$set(this.displaySetting, 'time', res.data.rollSpeed)
        }
      })
    },
    save() {
      let params = {
        showCount: this.displaySetting.num,
        rollSpeed: this.displaySetting.time
      }
      putCountSpeed(params).then(res => {
        if(res) {
          this.$MyMessage("保存成功！", 'success');
        }
      })
    },
    //删除
    delAdv(val) {
        this.delItem = val
        this.delDialog = true
    },
    //编辑
    editAdv(val) {
      console.log("val", val);
      this.adDialog = true;
      this.title = "修改";
      let editForm = {
          name: val.adTitle,
          uid: val.uid,
          path: val.jumpUrl,
      }
      this.adForm = Object.assign({}, editForm);
      this.fileList = [{name: val.adTitle, url: val.adLogoUrl}]
      this.adLogoUrl = val.adLogoUrl
    },
    //新增
    addAdv() {
      this.adDialog = true;
      this.title = "添加";
      this.isShow = false
      this.$refs.adForm.resetFields();
      this.fileList = [];
      this.adLogoUrl = '';
    },
    // 文件上传成功
    handleSuccess (res) {
      if (res && res.data) {
        this.adLogoUrl = res.data.fileFullPath
      }
    },
    handleRemove(file, fileList) {
       console.log(file, fileList);
       this.fileList = fileList;
       if(this.fileList && this.fileList.length > 0) {
           this.isShow = false
       }else {
           this.isShow = true
       }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
       return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleChange (file, fileList) {
      if (file && fileList) {
        this.fileList = fileList;
        this.isShow = false
      }else {
        this.isShow = true
      }
    },
    //取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.adDialog = false;
    },
    //确定
    submitForm(formName) {
      if(this.fileList && this.fileList.length > 0) {
         this.isShow = false
      }else {
         this.isShow = true
         return false;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("=============", this.adForm,this.fileList);
          this.isLoading = true;
          if (this.adForm.uid) {
                //编辑广告
                let params = {
                  "adTitle": this.adForm.name,
                  "jumpUrl": this.adForm.path,
                  "adLogoUrl": this.adLogoUrl,
                  "uid": this.adForm.uid,
                };
                putAd(params)
                .then(res => {
                    if (res && res.data) {
                    this.$nextTick(() => {
                        this.$MyMessage("修改广告成功", 'success');
                        this.adDialog = false;
                        this.$refs[formName].resetFields();
                        this.fileList = [];
                        this.adLogoUrl = '';
                        this.getAllAdList();
                    });
                    }
                    this.$nextTick(() => {
                      this.isLoading = false;
                    });
                })
                .catch(() => {
                    this.isLoading = false;
                });
            } else {
                //新增广告
                let params = {
                  "adTitle": this.adForm.name,
                  "jumpUrl": this.adForm.path,
                  "adLogoUrl": this.adLogoUrl,
                };
                postAd(params)
                .then(res => {
                    if (res && res.data) {
                    this.$nextTick(() => {
                        this.$MyMessage("广告添加成功", 'success');
                        this.adDialog = false;
                        this.$refs[formName].resetFields();
                        this.fileList = [];
                        this.adLogoUrl = '';
                        this.getAllAdList();
                    });
                    }
                    this.$nextTick(() => {
                      this.isLoading = false;
                    });
                })
                .catch(() => {
                    this.isLoading = false;
                });
            }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.advertisement_manage {
  height: 100%;
  overflow-y: auto;
  .reset_bread {
    background-color: #fafafa;
    border-bottom: 0;
    height: 60px;
    line-height: 60px;
  }
  .ad_content {
    @mixin h54 {
      height: 54px;
      line-height: 54px;
      border-bottom: 1px solid #f2f2f2;
      padding: 0 20px;
    }
    @mixin setting {
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      background-color: #fff;
      margin: 0 20px;
    }
    //展示设置
    .display_settings {
        @include setting;
            .ad_top {
                @include h54;
            }
            .display_s_content {
                padding: 20px;
                display: flex;
                .num_info, .time_info {
                    margin-right: 40px;
                }
            }  
    }
    .none_box {
        height: 20px;
    }
    //广告列表
    .ad_list {
         @include setting;
         padding-bottom: 20px;
        .ad_top {
            @include h54;
        }
        .opt_btn {
            padding: 20px 20px 6px 20px;
        }
        .table_box {
            padding: 0 20px;
            .operation_btn {
                display: inline-block;
                padding: 0 10px;
                border-right: 1px solid #f2f2f2;
                &:first-child {
                    padding: 0 10px 0 0;
                }
                &:last-child {
                    border-right: none;
                }
            }
            .gary_color {
                color: #999;
            }
        }
    }
  }
  .error_tip {
      color: #ef5555;
      font-size: 12px;
      line-height: 16px;
      margin-top: 10px;
  }
}
</style>
<style lang="scss">
.advertisement_manage {
    .opt_btn {
        .el-button {
            width: 80px;
        }
    }
    .ad_dialog {
    .el-dialog__body {
      margin-top: 20px;
      .el-form-item {
        margin-bottom: 20px;
      }
      .el-upload__tip {
          line-height: 20px;
      }
      .upload_file {
          .el-form-item__content {
              line-height: 1;
          }
      }
    }
  }
}
</style>