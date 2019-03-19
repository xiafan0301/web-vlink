<template>
  <div class="basic_info">
    <div class="basic_info_left">
      <el-select v-model="selectMethod" @change="handleChangePerosn" style="width: 220px;margin: 15px;" size="small" placeholder="请选择">
        <el-option
          v-for="item in selectType"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <div class="search_box">
        <el-input placeholder="搜索组" size="small"  v-model="searchGroupName" @change="changeGroupName">
          <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 16px;margin-right: 5px"></i>
          <i
            v-show="!closeShow"
            class="search_icon vl_icon vl_icon_manage_1"
            slot="suffix"
            @click="searchData">
          </i>
        </el-input>
      </div>
      <template v-if="selectMethod === 1">
        <div class="left_content_box">
          <div class="add_btn">
            <i class="vl_icon vl_icon_manage_4" @click="showAddGroupDialog"></i>
            <span>新增分组</span>
          </div>
          <vue-scroll>
            <ul class="group_ul">
              <li :class="[activeSelect === -1 ? 'active_select' : '']" @click="getPerDetailInfo(1)">全部人像({{allPerGroupNumber}})</li>
              <li :class="[activeSelect == item.id ? 'active_select' : '']" v-for="(item, index) in perGroupList" :key="'item' + index" @click="getPerDetailInfo(item, 1)">
                <span>{{item.name}}({{item.portraitNum}})</span>
                <i class="vl_icon vl_icon_manage_10" @click="skipAdminPersonPage(item.id, 1, $event)"></i>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </template>
      <template v-if="selectMethod === 2">
        <div class="left_content_box">
          <vue-scroll>
            <ul class="group_ul">
              <li :class="[activeSelect === -1 ? 'active_select' : '']" @click="getPerDetailInfo(2)">全部底库({{allPerBottomNameNumber}})</li>
              <li :class="[activeSelect == item.id ? 'active_select' : '']" v-for="(item, index) in perBottomBankList" :key="'item' + index" @click="getPerDetailInfo(item, 2)">
                <span>{{item.title}}({{item.portraitNum}})</span>
                <i class="vl_icon vl_icon_manage_10" @click="skipAdminPersonPage(item.id, 2, $event)"></i>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </template>
    </div>
    <div class="basic_info_right_group">
      <div class="search_right_box">
        <el-form :inline="true" :model="searchForm" class="event_form">
          <el-form-item style="width: 240px;">
            <el-input style="width: 240px;" type="text" placeholder="请输入姓名或证件号" v-model="searchForm.name" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.type" style="width: 240px;">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.sex" style="width: 240px;">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.bottomBank" style="width: 240px;">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="select_btn">查询</el-button>
            <el-button class="reset_btn">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="divide"></div>
      </div>
      <div class="table_box">
        <div class="add_btn_box">
          <div class="add_event_btn" @click="showGroup = !showGroup">
            <span>+</span>
            <span>加入组</span>
          </div>
          <div class="group_info" v-show="showGroup">
            <div class="group_info_list">
              <vue-scroll>
                <ul class="group_info_ul">
                  <li>分组命名文字限制十字</li>
                  <li>分组命名文字限制十字</li>
                  <li>分组命名文字限制十字</li>
                  <li>分组命名文字限制十字</li>
                </ul>
              </vue-scroll>
            </div>
            <div class="add_btn" @click="showAddGroupCopyDialog">
              <i class="vl_icon vl_icon_manage_4" ></i>
              <span>新增分组</span>
            </div>
          </div>
        </div>
        <el-table
          class="event_table"
          :data="personGroupList"
          >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
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
            label="证件类型"
            prop="idType"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="证件号码"
            prop="idCard"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="分组信息"
            prop="groupInfo"
            :show-overflow-tooltip='true'
          >
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <span class="operation_btn" @click="showLookDetailInfo(scope)">查看</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageNum"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <!--查看人员详细信息弹出框-->
    <el-dialog
      title="查看人员信息"
      :visible.sync="perosnDetailInfoDialog"
      width="722px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp_person"
      >
      <div class="content_body">
        <div class="content_left">
          <img src="../../../../assets/img/temp/vis-eg.png" alt="">
        </div>
        <ul class="content_right">
          <li>
            <span>姓名：</span>
            <span>邹洪华</span>
          </li>
          <li>
            <span>性别：</span>
            <span>男</span>
          </li>
          <li>
            <span>民族：</span>
            <span>汉</span>
          </li>
          <li>
            <span>证件类型：</span>
            <span>身份证</span>
          </li>
          <li>
            <span>证件号码：</span>
            <span>432501199111110011</span>
          </li>
          <li>
            <span>出生日期：</span>
            <span>1991.11.11</span>
          </li>
          <li>
            <span>底库信息：</span>
            <span>底库1、底库2</span>
          </li>
          <li>
            <span>分组信息：</span>
            <span>分组1、分组2</span>
          </li>
          <li>
            <span>备注：</span>
            <span>
              任务内容示意：调度指挥方案任务内容填写，段落文字多行显示，
              这段文字是样式参考。调度指挥方案任务内容填写，段落文字多行显示，
              这段文字是样式参考。调度指挥方案任务内容填写，段落文字多行显示，
              这段文字是样式参考。调度指挥方案任务内容填写，
              段落文字多行显示，这段文字是样式参考。调度指挥方案任务内容填写，段落文字多行显示。
            </span>
          </li>
        </ul>
      </div>
    </el-dialog>
    <!--新增组弹出框-->
    <el-dialog
      title="新增分组"
      :visible.sync="addGroupDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div>
        <el-input placeholder="请输入组名，名字限制在10个" v-model="userGroupName"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGroupDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="addGroupDialog = false">确认</el-button>
      </div>
    </el-dialog>
    <!--新增组弹出框-->
    <el-dialog
      title="新增分组"
      :visible.sync="addGroupCopyDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div class="content_body">
        <span>您已选择1个对象，输入组名后已选对象将自动加入。</span>
        <el-input placeholder="请输入组名，名字限制在10个" v-model="userGroupName"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGroupCopyDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="addGroupCopyDialog = false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getPerBottomBankList, getPerGroupList } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      userGroupName: null,
      searchGroupName: null, // 搜索组名
      closeShow: false,
      activeSelect: -1, // 默认选中的分组
      allPerBottomNameNumber: 0, // 所有人员底库数量
      allPerGroupNumber: 0, // 所有人员分组数量
      selectType: [
        {
          id: 1,
          name: '按分组查看'
        },
        {
          id: 2,
          name: '按底库查看'
        }
      ],
      selectMethod: 1, // 左侧查看方式  1--分组方式查看 2--底库查看
      searchForm: {
        name: null,
        type: null,
        sex: '男',
        bottomBank: null
      },
      personGroupList: [
        {
          userName: '张三',
          userSex: '男',
          idType: '身份证',
          idCard: '432501199912190029',
          groupInfo: '显示20字后省略号显示20字后省略号显示…'
        },
        {
          userName: '张三',
          userSex: '男',
          idType: '身份证',
          idCard: '432501199912190029',
          groupInfo: '显示20字后省略号显示20字后省略号显示…'
        },
        {
          userName: '张三',
          userSex: '男',
          idType: '身份证',
          idCard: '432501199912190029',
          groupInfo: '显示20字后省略号显示20字后省略号显示…'
        }
      ],
      showGroup: false,
      perosnDetailInfoDialog: false, // 查看人员信息弹出框
      addGroupDialog: false, // 新增分组弹出框
      addGroupCopyDialog: false, // 加入组-新增分组弹出框
      perGroupList: [], // 分组列表
      perBottomBankList: [], // 底库列表
    }
  },
  mounted () {
    this.getGroupList();
  },
  methods: {
    // 获取分组列表
    getGroupList () {
      const params = {
        type: 4, // 4---人像
        name: this.searchGroupName
      }
      getPerGroupList(params)
        .then(res => {
          if (res) {
            this.perGroupList = res.data;
            this.perGroupList.map(item => {
              this.allPerGroupNumber += item.portraitNum;
            })
          }
        })
        .catch(() => {})
    },
    // 获取底库列表
    getBottomBankList () {
      const params = {
        type: 1, // 1--人像库
        name: this.searchGroupName
      }
      getPerBottomBankList(params)
        .then(res => {
          if (res) {
            this.perBottomBankList = res.data;
             this.perBottomBankList.map(item => {
              this.allPerBottomNameNumber += item.portraitNum;
            })
          }
        })
        .catch(() => {})
    },
    // 搜索框组名change
    changeGroupName () {},
    // 清空搜索框
    onClear () {
      this.closeShow = false;
      this.searchGroupName = null;
      if (this.selectMethod === 1) {
        this.getGroupList();
      } else {
        this.getBottomBankList();
      }
    },
    // 搜索组名
    searchData () {
      this.closeShow = true;
      if (this.selectMethod === 1) {
        this.getGroupList();
      } else {
        this.getBottomBankList();
      }
    },
    // 点击左边分组获取右边人员列表
    getPerDetailInfo () {

    },
    // 选择方式的change
    handleChangePerson (val) {
      this.activeSelect = -1;
      this.searchGroupName = null;
      this.searchForm.groupId = null;
      this.searchForm.albumId = null;
      this.searchForm.keyWord = null;
      if (val === 1) {
        this.getGroupList();
      } else {
        this.getBottomBankList();
      }
    },
    handleIconClick () {},
    skipAddGroupPage () {},
    handleSizeChange () {
    },
    handleCurrentChange () {},
    // 显示新增分组弹出框
    showAddGroupDialog () {
      this.addGroupDialog = true;
    },
    // 显示加入组--新增分组弹出框
    showAddGroupCopyDialog () {
      this.addGroupCopyDialog = true;
    },
    // 显示查看详细信息弹出框
    showLookDetailInfo (obj) {
      console.log(obj);
      this.perosnDetailInfoDialog = true;
    },
    // 跳至管理人员组信息页面
    skipAdminPersonPage () {
      console.log('111')
      this.$router.push({name: 'admin_person_info'});
    }
  }
}
</script>
<style lang="scss" scoped>
.basic_info {
  background-color: #ffffff;
  height: 100%;
  display: flex;
  .basic_info_left {
    width: 260px;
    height: 100%;
    border-right: 1px solid #f2f2f2;
    .search_box {
      padding: 0 18px;
      /deep/ .el-input--small .el-input__inner {
        width: 220px;
        border-radius: 40px;
        background-color: #F2F2F2;
        color: #999999;
      }
      .search_icon{
        margin-top: 8px;
        cursor: pointer; 
      }
    }
    .left_content_box {
      .group_ul {
        >li {
          padding-left: 40px;
          height: 36px;
          line-height: 36px;
          display: flex;
          align-items: center;
          color: #333333;
          cursor: pointer;
          i {
            display: block;
            margin-left: 5px;
            &:hover {
              background-position: -412px -350px;
            }
          }
          &:hover {
            background-color: #E0F2FF;
            i {
              display: block;
            }
          }
        }
        .active_select {
          background-color: #E0F2FF;
          color: #0C70F8;
        }
      }
      .add_btn {
        padding: 15px;
        display: flex;
        color: #333333;
        align-items: center;
        i {
          cursor: pointer;
        }
        > span {
          margin-left: 5px;
        }
      }

    }
  }
  .basic_info_right_group {
    width: calc(100% - 260px);
    .search_right_box {
      width: 100%;
      padding: 20px;
      .event_form {
        width: 100%;
        .select_btn, .reset_btn {
          width: 80px;
        }
        .select_btn {
          background-color: #0C70F8;
          color: #ffffff;
        }
        .reset_btn {
          background-color: #ffffff;
          color: #666666;
          border-color: #DDDDDD;
        }
      }
      .divide {
        border: 1px dashed #fafafa;
      }
    }
    .table_box {
      padding: 0 20px;
      .add_btn_box {
        position: relative;
        .add_event_btn {
          width: 108px;
          height: 40px;
          background-color: #0C70F8;
          color: #ffffff;
          font-size: 14px;
          line-height: 40px;
          text-align: center;
          border-radius: 3px;
          cursor: pointer;
          span:nth-child(1) {
            font-size: 16px;
          }
          span:nth-child(2) {
            margin-left: 5px;
          }
        }
        .group_info {
          z-index: 1;
          position: absolute;
          top: 45px;
          background-color: #ffffff;
          color: #333333;
          border-radius: 4px;
          box-shadow:5px 5px 8px 5px #949494;
          .group_info_list {
            height: 150px;
            .group_info_ul {
              >li {
                padding: 8px 10px;
                cursor: pointer;
                &:hover {
                  background-color: #E0F2FF;
                }
              }
            }
          }
          .add_btn {
            cursor: pointer;
            height: 30px;
            line-height: 30px;
            display: flex;
            align-items: center;
            padding-left: 25%;
            border-top: 1px solid #F2F2F2;
          }
        }
      }
      .event_table {
        margin-top: 8px;
        /deep/ .el-checkbox__inner {
          z-index: 0;
        }
        .operation_btn {
          color: #0C70F8;
          cursor: pointer;
          padding: 0 10px;
          display: inline-block;
        }
      }
    }
  }
  .dialog_comp_person {
    .content_body {
      width: 100%;
      display: flex;
      .content_left {
        width: 240px;
        border-right: 1px solid #f2f2f2;
        img {
          width: 160px;
          height: 160px;
          border-radius: 10px;
          margin: 50% 15%;
        }
      }
      .content_right {
        width: calc(100% - 240px);
        >li {
          width: 100%;
          padding: 8px 0;
          display: flex;
          span:first-child {
            display: inline-block;
            width: 100px;
            color: #666666;
            text-align: right;
          }
          span:last-child {
            width: calc(100% - 100px);
            color: #333333;
          }
        }
      }
    }
  }
  .dialog_comp {
    .content_body {
      >span {
        color: #999999;
        margin-bottom: 20px;
        display: inline-block;
      }
    }
  }
}
</style>


