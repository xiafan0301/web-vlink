<template>
  <div class="custom_group">
    <div class="custom_group_left">
      <div class="search_box">
        <el-input placeholder="搜索组" size="small" style="width: 220px;" v-model="keyWord">
          <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 16px;margin-right: 5px"></i>
          <i
            v-show="!closeShow"
            class="search_icon vl_icon vl_icon_manage_1"
            slot="suffix"
            @click="searchData">
          </i>
        </el-input>
      </div>
      <div class="add_btn" @click="skipAddGroupPage">
        <i class="vl_icon vl_icon_manage_4"></i>
        <span>新增分组</span>
      </div>
      <div class="content_box">
        <vue-scroll>
          <ul class="temp_detail_info">
            <li
              :class="[activeGroupId === item.uid ? 'temp_active' : '']"
              v-for="(item, index) in groupList"
              :key="'item' + index"
              @click="showGroupDeviceInfo(item.uid)"
            >
              <span>{{item.groupName}}  ({{item.deviceList.length + item.bayonetList.length}})</span>
              <i class="operation_btn del_btn vl_icon vl_icon_manage_8" @click="showDeleteDialog(item.uid)"></i>
              <i class="operation_btn edit_btn vl_icon vl_icon_manage_7" @click="skipEditGroupPage(item.uid, item.groupName)"></i>
            </li>
          </ul>
        </vue-scroll>
      </div>
    </div>
    <div class="custom_group_right">
      <div class="no_data">
        <i class="vl_icon_manage_9 vl_icon"></i>
      </div>
      <div class="detail_info_right">
        <ul class="tab_ul clearfix">
          <li class="tab_ul_li" :class="[arrowActive === 1 ? 'active_tab_li' : '']" @click="changeTab(1)">摄像头({{deviceList.length}})</li>
          <li class="tab_ul_li" :class="[arrowActive === 2 ? 'active_tab_li' : '']" @click="changeTab(2)">卡口({{bayonetList.length}})</li>
        </ul>
        <div class="data_list" v-show="arrowActive === 1">
          <vue-scroll>
            <p v-for="(item, index) in deviceList" :key="index" v-show="deviceList.length > 0">{{item.deviceName}}</p>
            <p style="color: #999;" v-show="deviceList.length === 0">暂无数据</p>
          </vue-scroll>
        </div>
        <div class="data_list" v-show="arrowActive === 2">
          <vue-scroll>
            <p v-for="(item, index) in bayonetList" :key="index" v-show="bayonetList.length > 0">{{item.bayonetName}}</p>
            <p style="color: #999;" v-show="bayonetList.length === 0">暂无数据</p>
          </vue-scroll>
        </div>
      </div>
    </div>
    <!--删除分组设备弹出框-->
    <el-dialog
      title="是否删除该组?"
      :visible.sync="delGroupDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">解散时，将移出组内设备，并删除该组。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="deleteGroup">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCusGroup, delGroupDevice } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      delGroupDialog: false, // 删除分组弹出框
      arrowActive: 1, // tab选中
      activeGroupId: null, // 选中的分组行
      keyWord: null, // 搜索组名
      closeShow: false,
      groupList: [], // 所有的分组
      deviceList: [], // 设备列表
      bayonetList: [], // 卡口列表
      deleteId: null, // 要删除的分组设备id
    }
  },
  watch: {
    keyWord (val) {
      if (val) {
        this.closeShow = false;
      } else {
        this.getGroupList();
      }
    }
  },
  mounted () {
    this.getGroupList();
  },
  methods: {
    // 获取所有的分组
    getGroupList () {
      const params = {
        keyword: this.keyWord
      };
      getCusGroup(params)
        .then(res => {
          if (res) {
            this.groupList = res.data;
            // this.activeGroupId = this.groupList[0].uid;
            this.showGroupDeviceInfo(this.groupList[0].uid)
          }
        })
        .catch(() => {})
    },
    // 清空搜索框
    onClear () {
      this.closeShow = false;
      this.keyWord = null;
      this.getGroupList();
    },
    // 搜索
    searchData () {
      if (this.keyWord) {
        this.closeShow = true;
      }
      this.getGroupList();
    },
    // 点击左边分组获取右边设备信息
    showGroupDeviceInfo (id) {
      this.activeGroupId = id;
      this.groupList.map(item => {
        if (item.uid === id) {
          this.deviceList = JSON.parse(JSON.stringify(item.deviceList));
          this.bayonetList = JSON.parse(JSON.stringify(item.bayonetList));
        }
      })
    },
    // 跳至新增分组页面
    skipAddGroupPage () {
      this.$router.push({name: 'add_group'});
    },
    // 编辑分组
    skipEditGroupPage (id, name) {
      this.$router.push({name: 'add_group', query: {groupId: id, name: name}});
    },
    // change  tab
    changeTab (val) {
      this.arrowActive = val;
    },
    // 显示删除分组设备弹出框
    showDeleteDialog (id) {
      this.deleteId = id;
      this.delGroupDialog = true;
    },
    // 删除分组设备
    deleteGroup () {
      if (this.deleteId) {
        delGroupDevice (this.deleteId)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              })
              this.delGroupDialog = false;
              this.getGroupList();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败',
                customClass: 'request_tip'
              })
            }
          })
          .catch(() => {})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.custom_group {
  box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
  border-radius:4px;
  background-color: #ffffff;
  height: 100%;
  display: flex;
  .custom_group_left {
    height: 100%;
    width: 260px;
    border-right: 1px solid #F2F2F2;
    .search_box {
      padding: 15px 15px 10px;
      /deep/ .el-input--small .el-input__inner {
        border-radius: 40px;
        background-color: #F2F2F2;
        color: #999999;
      }
      .search_icon{
        margin-top: 8px;
        cursor: pointer; 
      }
    }
    .add_btn {
      padding: 0 15px 10px;
      display: flex;
      color: #333333;
      align-items: center;
      width: 120px;
      cursor: pointer;
      > span {
        margin-left: 5px;
      }
    }
    .content_box {
      height: calc(100% - 120px);
      .temp_detail_info {
        height: 100%;
        border-right: 1px solid #f2f2f2;
        > li {
          width: auto;
          cursor: pointer;
          font-size: 14px;
          line-height: 26px;
          color: #333333;
          padding: 0 30px 0;
            >span {
              margin-left: 5px;
            }
            .operation_btn {
              display: none;
              float: right;
              margin: 5px 2px 0;
            }
            .del_btn {
              &:hover {
                background-position: -694px -350px !important;
              }
            }
            .edit_btn {
              &:hover {
                background-position: -584px -350px !important;
              }
            }
            &:hover {
              background-color: #E0F2FF;
              .operation_btn {
                display: block;
              }
            }
            &.temp_active {
              background-color: #E0F2FF;
              i, span {
                color: #0C70F8;
              }
            }
        }
      }
    }
  }
  .custom_group_right {
    width: calc(100% - 260px);
    height: 100%;
    .no_data {
      display: none;
      width: 186px;
      height: 196px;
      margin-left: 40%;
      margin-top: 15%;
    }
    .detail_info_right {
      width: 100%;
      height: 100%;
      .tab_ul {
        clear: both;
        padding: 10px 10px 0;
        border-bottom: 1px solid #f2f2f2;
        .tab_ul_li {
          width: auto;
          float: left;
          padding: 0 15px 10px;
          cursor: pointer;
          &.active_tab_li {
            color: #0C70F8;
            border-bottom: 2px solid #0C70F8;
          }
        }
      }
      .data_list {
        height: calc(100% - 50px);
        p {
          padding: 10px 20px 0;
          color: #666666;
        }
      }
    }
  }
}
</style>

