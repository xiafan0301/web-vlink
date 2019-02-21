<template>
<vue-scroll>
  <div class="department-detail">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/department' }">部门架构</el-breadcrumb-item>
        <el-breadcrumb-item>溆浦县政法委</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="all_content">
      <ul class="header_tab">
        <li :class="{active: tabState === 1}" @click="tabState = 1">部门</li>
        <li :class="{active: tabState === 2}" @click="tabState = 2">成员</li>
      </ul>
      <template v-if="tabState === 1">
        <div class="basic_info">
          <p>
            <i class="vl_icon vl_icon_event_4"></i>
            <span>溆浦县政法委</span>
          </p>
          <ul class="basic_list">
            <li>
              <span>上级部门:</span>
              <span>溆浦县政法委</span>
            </li>
            <li>
              <span>负责人:</span>
              <span>禁止康</span>
            </li>
            <li>
              <span>联系方式:</span>
              <span>13908398989</span>
            </li>
            <li>
              <span>创建时间:</span>
              <span>2018-6-25 10:00:00</span>
            </li>
            <li>
              <span>更新时间:</span>
              <span>2018-6-25 10:00:00</span>
            </li>
          </ul>
        </div>
        <div class="junior_depart">
          <p>下级部门</p>
          <div class="depart_btn_box">
            <el-button class="add_btn" icon="el-icon-plus">新增部门</el-button>
            <el-button class="del_btn">删除部门</el-button>
          </div>
          <div class="depart_tree">
            <el-checkbox>全选</el-checkbox>
            <div class="depart_tree_list">
              <vue-scroll>
                <el-tree icon-class="el-icon-arrow-right" show-checkbox :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
              </vue-scroll>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="member_box">
          <div class="header">
            <el-button class="admin-btn" icon="vl_icon vl_icon_manage_2" @click="showAdminMember">成员管理</el-button>
            <el-input  placeholder="请输入账户名/姓名查找" style="width: 240px;">
              <i
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="handleIconClick">
            </i>
            </el-input>
          </div>
          <div class="table_box">
            <el-table
              class="member_table"
              :data="memberListData"
              >
              <el-table-column
                fixed
                label="序号"
                type="index"
                :show-overflow-tooltip='true'
                >
              </el-table-column>
              <el-table-column
                label="账户名"
                prop="userMobile"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="姓名"
                prop="userName"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="性别"
                prop="userSex"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="邮箱"
                prop="userEmail"
                >
              </el-table-column>
              <el-table-column
                label="最后登录时间"
                prop="lastLoginTime"
                >
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </div>
      </template>
    </div>
    <!--管理成员弹出框-->
    <el-dialog
      title="管理成员"
      :visible.sync="adminMemberDialog"
      width="521px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp_group"
      >
      <div class="userGroup_body">
        <div class="group_left clearfix">
          <p class="group_number">当前成员 (50个)</p>
          <div class="checkbox_box_left">
            <vue-scroll>
              <el-checkbox-group v-model="checkedCities">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <div class="group_btn group_btn_left">移除所选组</div>
        </div>
        <div class="group_right">
          <p class="group_number">可选成员 (已选1个/共51个)</p>
          <el-input placeholder="请输入成员姓名搜索" size="small" style="width: 220px;">
            <i
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchData">
            </i>
          </el-input>
           <div class="checkbox_box_right">
            <vue-scroll>
              <el-checkbox-group v-model="checkedCities">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <div class="group_btn group_btn_right">加入所选组</div>
        </div>
      </div>
    </el-dialog>
  </div>
</vue-scroll>
</template>
<script>
export default {
  data () {
    return {
      currentPage4: 1,
      tabState: 2,
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1',
            children: [{
              label: '四级 1-1-1',
              children: [{
                label: '五级 1-1-1'
              }]
            }]
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
            label: '三级 2-2-1'
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
      checkedCities: ['上海', '北京'],
      cities: ['上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳'],
      memberListData: [
        {
          userMobile: '17822222222',
          userName: '张三',
          userSex: '女',
          userEmail: '1136386227@qq.com',
          lastLoginTime: '2018-12-12 12:12:12'
        },
        {
          userMobile: '17822222222',
          userName: '张三',
          userSex: '女',
          userEmail: '1136386227@qq.com',
          lastLoginTime: '2018-12-12 12:12:12'
        },
        {
          userMobile: '17822222222',
          userName: '张三',
          userSex: '女',
          userEmail: '1136386227@qq.com',
          lastLoginTime: '2018-12-12 12:12:12'
        },{
          userMobile: '17822222222',
          userName: '张三',
          userSex: '女',
          userEmail: '1136386227@qq.com',
          lastLoginTime: '2018-12-12 12:12:12'
        },
        {
          userMobile: '17822222222',
          userName: '张三',
          userSex: '女',
          userEmail: '1136386227@qq.com',
          lastLoginTime: '2018-12-12 12:12:12'
        }
      ],
      adminMemberDialog: false, // 成员管理弹出框
    }
  },
  methods: {
    handleSizeChange () {
    },
    handleCurrentChange () {},
    handleNodeClick () {},
    handleIconClick () {},
    // 显示成员管理弹出框
    showAdminMember () {
      this.adminMemberDialog = true;
    },
    searchData () {}
  }
}
</script>
<style lang="scss" scoped>
.department-detail {
  .all_content {
    padding: 0 20px;
    .header_tab {
      width: 100%;
      height: 44px;
      background-color: #ffffff;
      border-bottom: 1px solid #F2F2F2;
      >li {
        display: inline-block;
        height: 44px;
        line-height: 44px;
        color: #333333;
        font-size: 16px;
        margin: 0 15px;
        cursor: pointer;
        &.active {
          border-bottom: 1px solid #0C70F8;
          color: #0C70F8;
        }
      }
    }
    .basic_info {
      background-color: #ffffff;
      width: 100%;
      // margin: 0 20px;
      padding: 15px;
      // box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      > p {
        display: flex;
        width: 100%;
        >span {
          margin-left: 10px;
          color: #333333;
          font-size: 20px;
          font-weight: 600;
        }
      }
      .basic_list {
        padding-top: 10px;
        padding-left: 30px;
        >li {
          height: 30px;
          line-height: 30px;
          display: inline-block;
          width: 30%;
          span:first-child {
            color: #666666;
            margin-right: 10px;
          }
          span:last-child {
            color: #333333;
          }
        }
      }
    }
    .junior_depart {
      width: 100%;
      margin: 20px 0;
      background-color: #ffffff;
      > p {
        padding: 15px;
        color: #333333;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 1px solid #F2F2F2;
      }
      .depart_btn_box {
        padding: 15px;
        .add_btn {
          background-color: #0C70F8;
          color: #ffffff;
        }
        .del_btn {
          color: #666666;
          border-color: #D3D3D3;
        }
      }
      .depart_tree {
        padding-left: 15px;
        padding-bottom: 15px;
        .depart_tree_list {
          width: 50%;
          height: 400px;
          margin-top: 15px;
          /deep/ .el-tree-node__content {
            display: inherit;
          }
          /deep/ .el-checkbox {
            margin-right: 0;
            float: left;
          }
          /deep/ .el-tree-node:focus>.el-tree-node__content {
            background-color: #ffffff;
            color: #0C70F8;
            >span {
              color: #0C70F8;
            }
          }
          /deep/ .el-tree-node:hover>.el-tree-node__content {
            background-color: #ffffff;
          }
          /deep/.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: #0C70F8;
            border-color: #0C70F8;
          }
        }
      }
    }
    // 成员
    .member_box {
      background-color: #ffffff;
      width: 100%;
      .header {
        padding: 20px 10px 10px;
        display: flex;
        justify-content: space-between;
        .admin-btn {
          background-color: #0C70F8;
          color: #fff;
        }
        .search_icon{
          margin-top: 10px;
          cursor: pointer;
        }
      }
      .table_box {
        padding: 0 10px;
        .department_table {
          margin-top: 8px;
          .operation_btn {
            color: #0C70F8;
            cursor: pointer;
            padding: 0 10px;
            display: inline-block;
          }
        }
      }
    }
  }
  .dialog_comp_group {
    /deep/ .el-dialog__body {
      padding: 0 0 30px 0;
      .userGroup_body {
        width: 100%;
        clear: both;
        height: 577px;
        border-top: 1px solid #F2F2F2;
        .group_left {
          padding-top: 8px;
          width: 50%;
          height: 100%;
          border-right: 1px solid #F2F2F2;
          float: left;
          padding-left: 20px;
          .checkbox_box_left {
            height: calc(577px - 25px - 40px - 20px);
            margin-bottom: 20px;
            margin-top: 15px;
          }
          .group_btn_left {
            border: 1px solid #D3D3D3;
            color: #666666;
          }
        }
        .group_right {
          padding-top: 8px;
          width: 50%;
          height: 100%;
          padding-left: 20px;
          float: left;
          .checkbox_box_right {
            height: calc(577px - 25px - 40px - 20px - 42px);
            margin-bottom: 20px;
            margin-top: 15px;
          }
          /deep/ .el-input__inner {
            border-radius: 30px;
            background-color: #F2F2F2;
            color: #999999;
            border-color: #F2F2F2;
            margin-top: 10px;
          }
          .search_icon{
            margin-top: 17px;
            cursor: pointer;
          }
          .group_btn_right {
            background-color: #0C70F8;
            color: #ffffff;
          }
        }
        .group_btn {
          text-align: center;
          line-height: 40px;
          width: 220px;
          height: 40px;
          border-radius: 4px;
          cursor: pointer;
        }
        .group_number {
          color: #999999;
          font-size: 12px;
        }
        /deep/ .el-checkbox-group {
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;
        }
        /deep/ .el-checkbox {
          padding-right: 20px;
          height: 25px;
        }
        /deep/ .el-checkbox+.el-checkbox {
          margin-left: 0;
        }
        /deep/ .el-checkbox__label {
          float: left;
        }
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #0C70F8;
          border-color: #0C70F8;
        }
        /deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
          color: #666666;
        }
        /deep/ .el-checkbox__input {
          float: right;
        }
      }
    }
  }

}
</style>


