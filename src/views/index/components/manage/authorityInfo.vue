<template>
  <div class="authority_info">
    <p class="title">权限组</p>
    <div class="content_box">
      <div class="content_box_left">
        <div class="search_box">
          <el-input  placeholder="快速添加组名" size="small">
            <i
              class="search_icon vl_icon vl_icon_manage_4"
              slot="suffix"
              @click="submitData">
            </i>
          </el-input>
        </div>
        <ul class="group_ul">
          <li>系统默认(112)</li>
          <li class="active_li">
            <span>分组民方面奥昇阿萨大(123)</span>
            <div>
              <i class="vl_icon vl_icon_manage_7" @click="showEditGroupDialog"></i>
              <i class="vl_icon vl_icon_manage_8" @click="showDelGroupDialog"></i>
            </div>
          </li>
          <li>
            <span>分组民方面奥昇(123)</span>
            <div>
              <i class="edit_btn vl_icon vl_icon_manage_7"></i>
              <i class="del_btn vl_icon vl_icon_manage_8"></i>
            </div>
          </li>
        </ul>
      </div>
      <div class="content_box_right">
        <vue-scroll>
          <el-tree
            :data="data"
            node-key="uid"
            default-expand-all
            draggable
            icon-class="el-icon-arrow-right"
            :props="defaultProps"
            @node-drag-start="handleDragStart"
            @node-drop="handleDrop"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <!-- <span>菜单已阿萨大</span> -->
              <span>{{ data.label }}</span>
              <span class="operation">
                <i class="drag_btn vl_icon_manage_11 vl_icon" title="拖动变换顺序"></i>
                <i class="add_btn vl_icon_manage_13 vl_icon" @click="showAddDialog" title="添加"></i>
                <i class="edit_btn vl_icon_manage_7 vl_icon" @click="showEditDialog" title="编辑"></i>
                <i class="del_btn vl_icon_manage_8 vl_icon" @click="showDeleteDialog" title="删除"></i>
              </span>
            </span>
          </el-tree>
        </vue-scroll>
      </div>
    </div>
    <!--删除权限弹出框-->
    <el-dialog
      title="是否确定删除该权限?"
      :visible.sync="delAuthorityDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delAuthorityDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="delAuthorityDialog = false">确认</el-button>
      </div>
    </el-dialog>
    <!--删除权限组弹出框-->
    <el-dialog
      title="是否确定删除该权限组?"
      :visible.sync="delAuthorityGroupDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后该组信息可在系统默认中查找。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delAuthorityGroupDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="delAuthorityGroupDialog = false">确认</el-button>
      </div>
    </el-dialog>
    <!--编辑权限组弹出框-->
    <el-dialog
      title="编辑权限组"
      :visible.sync="editAuthorityGroupDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div>
        <el-input placeholder="请输入权限组名" v-model="userGroupName"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAuthorityGroupDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="editAuthorityGroupDialog = false">确认</el-button>
      </div>
    </el-dialog>
     <!--新增权限弹出框-->
    <el-dialog
      title="新增权限"
      :visible.sync="addAuthorityDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div style="margin-top: 15px;">
        <el-form :model="addForm">
          <el-form-item label="">
            <el-input v-model="addForm.userName" placeholder="请输权限名称2-20字，中英文皆可，但不可重复"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select style="width: 100%" v-model="addForm.type" placeholder="请选择权限类型">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select style="width: 100%" v-model="addForm.group" placeholder="请选择权限组">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAuthorityDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="addAuthorityDialog = false">保存</el-button>
      </div>
    </el-dialog>
    <!--编辑权限弹出框-->
    <el-dialog
      title="编辑权限"
      :visible.sync="editAuthorityDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div style="margin-top: 15px;">
        <el-form :model="editForm">
          <el-form-item label="">
            <el-input v-model="editForm.userName" placeholder="请输权限名称2-20字，中英文皆可，但不可重复"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select style="width: 100%" v-model="editForm.type" placeholder="请选择权限类型">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select style="width: 100%" v-model="editForm.group" placeholder="请选择权限组">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAuthorityDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="editAuthorityDialog = false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1',
            children: [{
              label: '五级阿萨达萨达啊实打',
              children: [{
                label: '五级阿萨达萨达啊实打'
              }]
            }]
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      addForm: {
        userName: null,
        type: null,
        group: null
      },
      editForm: {
        userName: null,
        type: null,
        group: null
      },
      delAuthorityDialog: false, // 删除权限弹出框
      addAuthorityDialog: false, // 新增权限弹出框
      editAuthorityDialog: false, // 编辑权限弹出框
      delAuthorityGroupDialog: false, // 删除权限组弹出框
      editAuthorityGroupDialog: false, // 编辑权限组弹出框
    }
  },
  methods: {
    // 快速添加组名
    submitData () {

    },
    handleDragStart () {},
    handleDrop () {},
    // 显示删除权限弹出框
    showDeleteDialog () {
      this.delAuthorityDialog = true;
    },
    // 显示新增权限弹出框
    showAddDialog () {
      this.addAuthorityDialog = true;
    },
    // 显示编辑权限弹出框
    showEditDialog () {
      this.editAuthorityDialog = true;
    },
    // 显示编辑权限组弹出框
    showEditGroupDialog () {
      this.editAuthorityGroupDialog = true;
    },
    // 显示删除权限组弹出框
    showDelGroupDialog () {
      this.delAuthorityGroupDialog = true;
    }
  }
}
</script>
<style lang="scss" scoped>
.authority_info {
  height: 100%;
  padding: 20px 20px 0;
  .title {
    background-color: #ffffff;
    color: #333333;
    font-size: 16px;
    padding: 20px;
    border-bottom: 1px solid #f2f2f2;
  }
  .content_box {
    background-color: #ffffff;
    height: calc(100% - 100px);
    display: flex;
    .content_box_left {
      width: 260px;
      border-right: 1px solid #f2f2f2;
      .search_box {
        padding: 10px;
        margin: 10px 5px;
        /deep/ .el-input__inner {
          background-color: #F2F2F2;
          color: #999999;
          font-size: 12px;
          width: 220px;
          border-radius: 30px;
        }
        .search_icon {
          margin-top: 4px;
          margin-right: 20px;
          cursor: pointer;
        }
      }
      .group_ul {
        >li {
          height: 36px;
          line-height: 36px;
          padding-left: 20px;
          cursor: pointer;
          color: #333333;
          display: flex;
          >div {
            display: none;
            height: 100%;
            line-height: 36px;
            margin-left: 15px;
            i {
              display: inline-block;
              vertical-align: middle;
              cursor: pointer;
              margin-right: 5px;
            }
            .edit_btn {
              &:hover {
                background-position: -584px -350px;
              }
            }
            .del_btn {
              &:hover {
                background-position: -694px -350px;
              }
            }
          }
          &:hover {
            background-color: #E0F2FF;
            >div {
              display: block;
            }
          }
          &.active_li {
            background-color: #E0F2FF;
            color: #0C70F8;
          }
        }
      }
    }
    .content_box_right {
      width: auto;
      height: 100%;
      /deep/ .custom-tree-node {
        margin-left: 8px;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        >span {
          color: #333333;
          font-size: 14px;
        }
      }
      /deep/ .el-tree-node__content {
        width: auto;
        height: 32px;
        line-height: 32px;
      }
      /deep/ .el-tree-node__content>.el-tree-node__expand-icon {
        margin-left: 6px;
      }
      /deep/ .el-tree-node__content:hover {
        background: #E0F2FF;
        .operation {
          display: block;
        }
      }
      .operation {
        padding: 0 15px;
        display: none;
        i {
          vertical-align: middle;
          margin: 0 2px;
        }
        .drag_btn {
          &:hover {
            background-position: -802px -553px;
          }
        }
        .add_btn {
          &:hover {
            background-position: -831px -553px;
          }
        }
        .edit_btn {
          &:hover {
            background-position: -584px -350px;
          }
        }
        .del_btn {
          &:hover {
            background-position: -694px -350px;
          }
        }
      }
    }
  }
}
</style>


