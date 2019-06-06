<template>
  <div class="archives_manage">
    <div class="archives_left">
      <vue-scroll>
        <div class="search_box">
          <el-input placeholder="请输入部门单位名称搜索" size="small" style="width: 220px;" v-model="keyWord">
            <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 16px;margin-right: 5px"></i>
            <i
              v-show="!closeShow"
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchData">
            </i>
          </el-input>
        </div>
        <div class="content"></div>
      </vue-scroll>
    </div>
    <div class="archives_right">
      <div class="ar-tab-nav">
        <div><router-link :to="{ name: 'member_file'}" @click.native = "state = 1">一员一档</router-link></div>
        <div><router-link :to="{ name: 'car_gear'}" @click.native = "state = 2">一车一档</router-link></div>
        <div><router-link :to="{ name: 'room_stall'}" @click.native = "state = 3">一室一档</router-link></div>
        <div><router-link :to="{ name: 'machine_gear'}" @click.native = "state = 4">一机一档</router-link></div>
      </div>
      <div>
        <router-view></router-view>
      </div>
    </div>
    <!--删除部门弹出框-->
    <el-dialog
      title="是否确认删除部门？"
      :visible.sync="delDepartmentDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delDepartmentDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteDepartment">确认</el-button>
      </div>
    </el-dialog>
    <!--删除下级部门弹出框-->
    <el-dialog
      title="删除时将删除部门及其下级部门，是否确认删除？"
      :visible.sync="delChildDepartmentDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delChildDepartmentDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteChildLoading" @click="delChildDepart">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      keyWord: null, // 根据部门名称搜索部门
      closeShow: false, // 显示清除输入框图标
      state: 1,
      delDepartmentDialog: false, // 删除部门弹出框
      delChildDepartmentDialog: false, // 删除下级部门弹出框
      isDeleteLoading: false, // 删除部门加载中
      isDeleteChildLoading: false, // 删除子级部门加载中
    }
  },
  methods: {
    searchData () {

    },
    onClear () {

    },
    //删除部门
    deleteDepartment () {},
    // 删除部门及子级部门
    delChildDepart () {}
  }
}
</script>

<style lang="scss" scoped>
.archives_manage {
  padding: 20px;
  height: 100%;
  width: 100%;
  display: flex;
  .archives_left {
    width: 260px;
    height: 100%;
    background-color: #ffffff;
    border-right: 1px solid #F2F2F2;
    .search_box {
      padding: 15px 15px 10px;
      /deep/ .el-input--small .el-input__inner {
        border-radius: 40px;
        background-color: #F2F2F2;
        color: #999999;
      }
      .search_icon {
        margin-top: 8px;
        cursor: pointer; 
      }
    }
  }
  .archives_right {
    width: calc(100% - 260px);
    height: 100%;
    background-color: #ffffff;
    overflow-y: scroll;
    .ar-tab-nav {
      background-color: #ffffff;
      padding-top: 8px;
      overflow: hidden;
      border-bottom: 1px solid #F2F2F2;
      > div {
          float: left;
          width: auto;
          font-size: 16px;
          margin: 0 20px;
        > a {
          display: block;
          height: 44px;
          line-height: 44px;
          text-align: center;
          cursor: pointer;
          color: #333333;
          text-decoration: none !important;
          &.router-link-exact-active {
            color: #0C70F8;
            cursor: default;
            border-bottom: 2px solid #0C70F8;
          }
        }
      }
    }
  }
  .dialog_comp {
    .organ_name {
      position: relative;
      .organ_error_tip {
        position: absolute;
        height: 10px;
        line-height: 10px;
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
      }
    }
  }
}
</style>

