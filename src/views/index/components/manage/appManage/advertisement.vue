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
                <el-table-column label="广告标题" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="跳转链接" prop="path" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="150" align="center">
                  <template slot-scope="scope">
                    <span class="operation_btn" @click="editAdv(scope.row)">编辑</span>
                    <span class="operation_btn" v-if="dataList && dataList.length > 1" @click="delAdv(scope.row)">删除</span>
                    <span class="operation_btn gary_color" v-else disabled>删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <template v-if="pagination.total > 0">
              <el-pagination
                @current-change="onPageChange"
                :current-page.sync="pagination.pageNum"
                :page-size="pagination.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="pagination.total"
                class="cum_pagination"
              ></el-pagination>
            </template>
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
        <el-form-item label=" " prop="files" class="upload_file">
          <div class="main_content">
              <el-upload
                ref="deviceImport"
                accept=".jpg, .png, .jpeg, .gif, .ico, .tif, tiff"
                :auto-upload="false"
                :action="importUrl"
                :on-change="handleChange"
                :before-remove="beforeRemove"
                :on-remove="handleRemove"
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
        <el-form-item label=" " prop="desc">
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
        <el-button type="primary" :loading="isLoading" @click="delDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import { ajaxCtx } from '@/config/config.js';
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
        }
      ],
      timeList: [
        {
          value: "1",
          label: "5秒"
        },
        {
          value: "2",
          label: "10秒"
        },
        {
          value: "3",
          label: "15秒"
        },
        {
          value: "4",
          label: "20秒"
        },
        {
          value: "5",
          label: "25秒"
        }
      ],
      displaySetting: {
          num: '1',
          time: '1'
      },
      dataList: [
        {
          date: "2016-05-02",
          name: "王小虎",
          path: "http:www.baidu.com",
          fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          path: "http:www.baidu.com"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          path: "http:www.baidu.com"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          path: "http:www.baidu.com"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          path: "http:www.baidu.com"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          path: "http:www.baidu.com"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          path: "http:www.baidu.com"
        }
      ],
      pagination: { total: 20, pageSize: 10, pageNum: 1 },
      title: "添加",
      adDialog: false,
      adForm: {
        name: "",
        path: "",
        files: "1",
      },
      adRules: {
        name: [
          { required: true, message: "请输入20字以内的广告标题", trigger: "blur" },
          { min: 1, max: 20, message: "最长20字广告标题", trigger: "blur" }
        ],
        path: [
          { min: 0, max: 100, message: "有效长度为0-100", trigger: "blur" }
        ],
        files: [{ required: true, message: "请上传广告图片", trigger: "change" }],
      },
      isLoading: false,
      importUrl: ajaxCtx.base + '/device-service/import', // 导入请求地址
      fileList: [],
      isShow: false,
      delDialog: false,
      delItem: {},
    };
  },
  methods: {
    save() {
      /* this.$message({
          message: '警告哦，这是一条警告消息',
          type: 'info',
          duration: 0
        }); */
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
          name: val.name,
          id: val.id,
          path: val.path,
      }
      this.adForm = Object.assign({}, editForm);
      this.fileList = val.fileList
    },
    //新增
    addAdv() {
      this.adDialog = true;
      this.title = "添加";
      this.isShow = false
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
    beforeRemove(file, fileList) {
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
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("=============", this.adForm);
          this.isLoading = true;
          /* if (this.newAuth.permissionId) {
                //编辑平台权限
                let params = {
                    permissionName: this.newAuth.permissionName,
                    path: this.newAuth.uniPath,
                    permissionType: this.newAuth.permissionType,
                    description: this.newAuth.description,
                    permissionMethod: this.newAuth.permissionMethod
                };
                putPermissions(this.platformId, this.newAuth.permissionId, params)
                .then(res => {
                    if (res && res.data) {
                    this.$nextTick(() => {
                        this.$message.success("修改平台权限成功");
                        this.newAuthDialog = false;
                        this.getPermissionsDetail();
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
                //新增平台权限
                let params = {
                permissionName: this.newAuth.permissionName,
                path: this.newAuth.uniPath,
                permissionType: this.newAuth.permissionType,
                description: this.newAuth.description,
                permgroupId: this.authGroupItem.permgroupId,
                permissionMethod: this.newAuth.permissionMethod,
                groupPathNum: this.groupPathNum
                };
                postPermissions(this.platformId, params)
                .then(res => {
                    if (res && res.data) {
                    this.$nextTick(() => {
                        this.$message.success("创建平台权限成功");
                        this.newAuthDialog = false;
                        this.$refs[formName].resetFields();
                        this.isWrite = true;
                        this.getAuthList();
                    });
                    }
                    this.$nextTick(() => {
                    this.isLoading = false;
                    });
                })
                .catch(() => {
                    this.isLoading = false;
                });
            } */
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //分页
    onPageChange(page) {
      this.pagination.pageNum = page;
    }
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
    box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
    border-radius: 4px;
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