<template>
  <div class="data_dictionary">
    <!-- <div class="reset_bread" is="vlBreadcrumb" :breadcrumbData="[{name: '系统管理'},{name: '数据字典'}]"></div> -->
    <div class="dic_content">
      <vue-scroll>
        <p class="dic_top">字典类别</p>
        <div class="dic_c_info">
          <div class="dic_c_i_left">
            <el-tree
              :data="dicList"
              ref="dicTree"
              node-key="id"
              :props="defaultProps"
              @node-click="handleNodeClick"
              highlight-current
              default-expand-all
              :expand-on-click-node="false"
            ></el-tree>
          </div>
          <div class="dic_c_i_right">
            <div class="dic_cir_message">
              <p class="header">类别信息</p>
              <div class="message_value">
                <div class="row">
                  <span class="row-left">编号：</span>
                  <span>{{selectData.no}}</span>
                </div>
                <div class="row">
                  <span class="row-left">名称：</span>
                  <span>{{selectData.label}}</span>
                </div>
                <div class="row">
                  <span class="row-left">上级类别：</span>
                  <span>{{selectData.parentTypeName || '—'}}</span>
                </div>
                <div class="row">
                  <span class="row-left">备注：</span>
                  <span>{{selectData.desci}}</span>
                </div>
              </div>
            </div>
            <div class="dic_cir_result">
              <p class="header">字典数据</p>
              <div class="add_btn">
                <el-button type="primary" @click="addDic">新 增</el-button>
              </div>
              <div class="table_box">
                <el-table :data="dataList">
                  <el-table-column label="编号" prop="no" show-overflow-tooltip></el-table-column>
                  <el-table-column label="名称" prop="enumValue" show-overflow-tooltip></el-table-column>
                  <el-table-column label="关联上级编号" prop="associateNo" show-overflow-tooltip></el-table-column>
                  <el-table-column label="备注" prop="desci" show-overflow-tooltip></el-table-column>
                  <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                      <span class="operation_btn" @click="editDic(scope.row)">编辑</span>
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
        </div>
      </vue-scroll>
    </div>
    <!--创建/编辑字典弹出框-->
    <el-dialog
      :title="title"
      :visible.sync="dicDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp dic_dialog"
    >
      <el-form
        :model="dicForm"
        ref="dicForm"
        :rules="dicRules"
        label-position="right"
        label-width="12px"
      >
        <el-form-item label=" " class="label_name">
            <span>所属类别：</span>
            <span>{{selectData.no}} {{selectData.label}}</span>
        </el-form-item>
        <el-form-item label=" " prop="num">
          <el-input v-model="dicForm.num" placeholder="请输入最长20位编号"></el-input>
        </el-form-item>
        <el-form-item label=" " prop="name">
          <el-input v-model="dicForm.name" placeholder="请输入最长20字名称"></el-input>
        </el-form-item>
        <el-form-item label=" " class="label_name">
            <span>上级类别：</span>
            <span v-if="selectData.typeKey">{{selectData.typeKey}} </span><span>{{selectData.parentTypeName || '无'}}</span>
        </el-form-item>
        <el-form-item label=" " prop="prevNum" v-if="selectData.typeKey && prevNumList && prevNumList.length > 0">
          <div class="prev_num">
            <ul class="prev_num_info">
              <li class="input_name">
                <el-input placeholder="关联上级编号" readonly v-model="dicForm.prevName"></el-input>
              </li>
              <li class="input_value">
                <el-select style="width: 100%" v-model="dicForm.prevNum" placeholder="请选择上级编号">
                  <el-option
                    v-for="(item, index) in prevNumList"
                    :key="index"
                    :label="item.no+ ' — '+item.enumValue"
                    :value="item.no"
                  ></el-option>
                </el-select>
              </li>
            </ul>
          </div>
        </el-form-item>
        <el-form-item label=" " prop="prevNum" v-else>
          <el-select style="width: 100%" v-model="dicForm.prevNum" placeholder="请选择上级编号" disabled>
                  <el-option
                    v-for="(item, index) in prevNumList"
                    :key="index"
                    :label="item.enumValue"
                    :value="item.no"
                  ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" " prop="desc">
          <el-input
            v-model="dicForm.desc"
            type="textarea"
            :rows="5"
            placeholder="请输入备注内容，有效长度为0-100"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer footer_btn">
        <el-button @click="resetForm('dicForm')">取 消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm('dicForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import { getDicMenu, getDicDatas, getPrev, postDicDatas, putDicDatas } from '@/views/index/api/api.manage.js';
export default {
  components: { vlBreadcrumb },
  data() {
    return {
      dicList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      dataList: [],
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      title: "添加",
      dicDialog: false,
      dicForm: {
        num: "",
        name: "",
        prevNum: "",
        prevName: "关联上级编号",
        desc: ""
      },
      dicRules: {
        num: [
          { required: true, message: "请输入最长20位编号", trigger: "blur" },
          { min: 1, max: 20, message: "最长20位编号", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入最长20字名称", trigger: "blur" },
          { min: 1, max: 20, message: "最长20字名称", trigger: "blur" }
        ],
        desc: [
          { min: 0, max: 100, message: "有效长度为0-100", trigger: "blur" }
        ]
      },
      prevNumList: [],
      selectData: {},
      isLoading: false
    };
  },
  mounted() {
    this.getDicMenuList()
  },
  methods: {
    //字典信息分类查询接口
    getPrevList() {
      let params = {
        pid: this.selectData.typeKey
      }
      getPrev(params).then(res => {
        if(res && res.data) {
          this.prevNumList = res.data
        }
      })
    },
    //字典数据分页查询接口（数据字典）
    getDicDatasList() {
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        "where.value": this.selectData.uid
      }
      getDicDatas(params).then(res => {
        console.log("0-00909-0-",res)
        if(res && res.data) {
          this.dataList = res.data.list
          this.pagination.total = res.data.total
        }
      })
    },
    //目录树查询接口（数据字典）
    getDicMenuList() {
      getDicMenu().then(res => {
        console.log(res)
        if(res && res.data) {
          this.dicList = this.getNormalList(...res.data)
          console.log("99999999",this.dicList)
          this.$nextTick(() => {
            this.$refs.dicTree.setCurrentKey(this.dicList[0].id);
            this.handleNodeClick(this.dicList[0])
          });
        }
      })
    },
    getNormalList(...data) {
      for(let item of data) {
        item['label'] = item.enumValue;
        item['id'] = item.enumField;
        if(item.childMenus && item.childMenus.length > 0 ) {
           item['children'] = item.childMenus;
           delete item.childMenus;
           this.getNormalList(...item.children)
        }
      }
      return data;
    },
    //新增
    addDic() {
      this.dicDialog = true;
      this.title = "添加";
      this.$refs.dicForm.resetFields();
      this.dicForm = {
        num: "",
        name: "",
        prevNum: "",
        prevName: "关联上级编号",
        desc: ""
      }
    },
    //编辑
    editDic(val) {
      console.log("val", val);
      this.dicDialog = true;
      this.title = "修改";
      let editForm = {
          num: val.no,
          name: val.enumValue,
          uid: val.uid,
          prevNum: val.associateNo,
          prevName: "关联上级编号",
          desc: val.desci,
      }
      this.dicForm = Object.assign({}, editForm);
    },
    handleNodeClick(data) {
      //每次选中前先清空勾选的节点
      this.$refs.dicTree.setCheckedKeys([]);
      // 1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 3. boolean 类型，是否设置子节点 ，默认为 false
      this.$refs.dicTree.setChecked(data.id,true)
      //获取到选择的数组，赋值给formData.lastDepart
      let sData = this.$refs.dicTree.getCheckedNodes(false,true)
      this.selectData = data
      console.log("0999999999999999",this.selectData)
      this.getDicDatasList()
      if(this.selectData.typeKey) {
        this.getPrevList()
      }
      if(sData && sData.length > 1) {
          this.$set(this.selectData, 'parentId', sData[sData.length -2].id)
          this.$set(this.selectData, 'parentName', sData[sData.length -2].label)
          /* this.$set(this.dicRules, 'prevNum', [{ required: true, message: "请选择关联上级编号", trigger: "change" }]) */
          this.$set(this.dicRules, 'prevNum', [])
      }else {
          this.$set(this.dicRules, 'prevNum', [])
      }
      console.log("000000000000",this.$refs.dicTree.getCheckedNodes(false,true),this.selectData)
    },
    //分页
    onPageChange(page) {
      this.pagination.pageNum = page;
      this.getDicDatasList()
    },
    //取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dicDialog = false;
    },
    //确定
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("=============", this.dicForm);
          this.isLoading = true;
          if (this.dicForm.uid) {
                //编辑平台权限
                let params = {
                  no: this.dicForm.num,
                  enumValue: this.dicForm.name,
                  desci: this.dicForm.desc,
                  typeKey: this.selectData.uid,
                  uid: this.dicForm.uid
                };
                if(this.selectData.typeKey) {
                  params['parentTypeKey'] = this.selectData.typeKey
                  params['associateNo'] = this.dicForm.prevNum
                }
                putDicDatas(params)
                .then(res => {
                    if (res && res.data) {
                    this.$nextTick(() => {
                        this.$message.success("修改数据字典成功");
                        this.dicDialog = false;
                        this.getDicDatasList();
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
                  no: this.dicForm.num,
                  enumValue: this.dicForm.name,
                  desci: this.dicForm.desc,
                  typeKey: this.selectData.uid,
                };
                if(this.selectData.typeKey) {
                  params['parentTypeKey'] = this.selectData.typeKey
                  params['associateNo'] = this.dicForm.prevNum
                }
                postDicDatas(params)
                .then(res => {
                    if (res && res.data) {
                    this.$nextTick(() => {
                        this.$message.success("创建数据字典成功");
                        this.dicDialog = false;
                        this.$refs[formName].resetFields();
                        this.getDicDatasList();
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
    }
  }
};
</script>

<style lang="scss" scoped>
.data_dictionary {
  height: 100%;
  .reset_bread {
    background-color: #fafafa;
    border-bottom: 0;
    height: 60px;
    line-height: 60px;
  }
  .dic_content {
    height: calc(100% - 80px);
    background-color: #fff;
    margin: 20px 20px 0;
    box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
    border-radius: 4px;
    .dic_top {
      height: 54px;
      line-height: 54px;
      border-bottom: 1px solid #f2f2f2;
      padding: 0 20px;
    }
    .dic_c_info {
      display: flex;
      height: calc(100% - 55px);
      @mixin pad3015 {
        padding: 30px 0 15px 0;
        border-bottom: 1px solid #f2f2f2;
      }
      //字典类别
      .dic_c_i_left {
        flex: none;
        width: 260px;
        padding-left: 14px;
        border-right: 1px solid #f2f2f2;
      }
      .dic_c_i_right {
        width: calc(100% - 260px);
        padding: 0 20px;
        //类别信息
        .dic_cir_message {
          .header {
            @include pad3015;
          }
          .message_value {
            display: flex;
            flex-wrap: wrap;
            .row {
              flex: none;
              width: 33.33%;
              padding-top: 16px;
              span {
                font-weight: 400px;
              }
              .row-left {
                color: #666;
              }
            }
          }
        }
        //字典数据
        .dic_cir_result {
          .header {
            @include pad3015;
          }
          .add_btn {
            padding: 20px 0 6px 0;
          }
        }
      }
    }
  }
  .label_name {
    color: #666;
  }
  .prev_num {
    display: flex;
    .prev_num_info {
      display: flex;
      border: 1px solid #dcdfe6;
      width: 100%;
      height: 40px;
      border-radius: 4px;
      &:hover,
      &:focus {
        border-color: #0c70f8;
      }
      .input_name {
        width: 114px;
      }
      .input_value {
          width: calc(100% - 114px);
      }
    }
  }
}
</style>
<style lang="scss">
.data_dictionary {
  .dic_c_info {
    //字典类别
    .dic_c_i_left {
      .el-tree-node__content {
        height: 40px;
      }
    }
    .dic_c_i_right {
      //字典数据
      .dic_cir_result {
        .add_btn {
          .el-button {
            width: 80px;
          }
        }
      }
    }
  }
  .dic_dialog {
    .el-dialog__body {
      margin-top: 20px;
      .el-form-item {
        margin-bottom: 20px;
      }
      .label_name {
        color: #666;
        .el-form-item__content {
            line-height: 20px;
        }
      }
      //关联上级编号
      .prev_num {
        .el-input__inner {
          border: none;
          height: 36px;
        }
        .input-name {
          .el-input__inner {
            padding: 0;
          }
        }
      }
    }
  }
}
</style>