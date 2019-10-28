<template>
<!-- 全部人像列表 -->
  <div class="set_list">
    <div class="bread_crumbs">
      <span @click="skipIsList">布控库</span><i class="el-icon-arrow-right"></i><span @click="skipIsList">人像库</span><i class="el-icon-arrow-right"></i><span>组设置</span>
    </div>
    <div class="member_title">
      <div>
        <div><span class="vl_f_333">全部人像</span></div>
        <div><el-checkbox v-model="allChecked" @change="operateAllChecked()">全选</el-checkbox><span class="vl_f_333">已选择 <span>{{allIsChecked}}</span>张</span></div>
      </div>
      <div>
        <el-button @click="judgeIsSelectedCopy" class="btn_100">复制到组</el-button>
        <el-button @click="judgeIsSelectedRemove" class="btn_100">删除人像</el-button>
        <el-collapse-transition>
          <ul class="group_copy" v-show="isShowGroupCopy">
            <vue-scroll>
              <li @click="copyPortrait(item.uid)" v-for="item in groupListPortrait" :key="item.uid">{{item.groupName}}</li>
              <li class="group_copy_add" @click="popGroupDialog"><i class="el-icon-circle-plus vl_f_999"></i><span class="vl_f_333">添加分组</span></li>
            </vue-scroll>
          </ul>
        </el-collapse-transition>
      </div>
    </div>
    <div class="list_box" v-loading="loading">
      <div class="list_info" v-for="item in memberList" :key="item.uid">
        <div class="list_img"><img :src="item.photoUrl" alt="" style="width: 100%;height: 100%;"></div>
        <div class="list_data">
          <div class="data_title">
            <span class="vl_f_999">详情资料</span>
            <el-checkbox v-model="item.isChecked" @change="operateRadio()"></el-checkbox>
          </div>
          <div class="data_list">
            <span :title="item.name">{{item.name}}</span>
            <span :title="item.sex">{{item.sex}}</span>
            <span :title="item.nation">{{item.nation}}</span>
          </div>
          <div class="data_list">
            <span>{{item.idNo}}<i class="vl_icon vl_icon_control_29"></i></span>
          </div>
          <div class="data_list" v-if="item.groupNames">
            <template v-for="(gN, index) in item.groupNames.split(',')">
              <span v-if="index <= 1" :title="gN" :key="index + gN">{{gN}}</span>
            </template>
            <div class="more" v-if="item.groupNames.split(',').length >= 3">
              <el-popover
                placement="top-start"
                width="220"
                popper-class="more_popover_box"
                trigger="hover">
                <vue-scroll>
                  <template>
                    <div class="more_popover">
                      <span :title="gN" v-for="(gN, index) in item.groupNames.split(',')" :key="index + gN">{{gN}}</span>
                    </div>
                  </template>
                </vue-scroll>
                <span slot="reference" class="more_hover">更多组</span>
              </el-popover>
            </div>
          </div>
          <div class="data_list" v-if="item.remarks">
            <span>{{item.remarks}}</span>
          </div>
        </div>
      </div>
      <div style="width: 100%;">
        <el-pagination
          style="text-align: center;"
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="protraitMemberList.pageSize"
          layout="prev, pager, next"
          :total="protraitMemberList.total">
        </el-pagination>
      </div>
    </div>
    <!-- 新增组 -->
    <div is="groupDialog" :tabType="tabType" operateType="1" ref="groupDialog" @getGroupList="getGroupListIsPortrait"></div>
    <!-- 删除人像 -->
    <div class="del_portrait_dialog">
      <el-dialog
        :visible.sync="delPortraitDialog"
        :close-on-click-modal="false"
        width="482px"
        top="40vh"
        title="删除提示">
        <h1 class="vl_f_16 vl_f_333" style="margin-bottom: 4px;">是否删除布控库中已选的{{allIsChecked}}条对象数据？</h1>
        <div slot="footer">
          <el-button @click="delPortraitDialog = false" class="btn_140">取消</el-button>
          <el-button :loading="loadingBtn" class="btn_140" type="primary" @click="delPortrait">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import groupDialog from './groupDialog.vue';
import {delPortrait, copyPortrait, getGroupListIsPortrait} from '@/views/index/api/api.control.js';
export default {
  components: {groupDialog},
  props: ['protraitMemberList', 'tabType', 'currentPage', 'loading'],
  data () {
    return {
      allChecked: false,
      memberList: [],//成员列表数据
      isShowGroupCopy: false,//点击复制按钮是否显示组下拉列表
      track: null,
      showMoreId: null,//显示更多组的组id
      // 人像组列表数据
      groupListPortrait: [],
      // 弹出框参数
      delPortraitDialog: false,
      loadingBtn: false,
    }
  },
  watch: {
    protraitMemberList (val) {
      this.memberList = val && val.list;
      this.memberList.forEach(f => {
        this.$set(f, 'isChecked', false);
      })
      this.allChecked = false;
    }
  },
  computed: {
    allIsChecked () {
      return this.memberList.filter(f => f.isChecked).length;
    }
  },
  created () {
    this.memberList = this.protraitMemberList && this.protraitMemberList.list;
    this.memberList.forEach(f => {
      this.$set(f, 'isChecked', false);
    })
  },
  mounted () {
    this.getGroupListIsPortrait();
  },
  methods: {
    skipIsList () {
      this.$emit('changePage');
    },
    popGroupDialog () {
      this.$refs['groupDialog'].reset();
    },
    // 单选
    operateRadio () {
      console.log(this.memberList)
      this.$nextTick(() => {
        this.allChecked = !this.memberList.some(s => s.isChecked === false);
        if (!this.allChecked) {
          this.isShowGroupCopy = false;
        }
      })
    },
    // 全选
    operateAllChecked () {
      this.$nextTick(() => {
        if (!this.allChecked) {
          console.log(1111111)
          this.memberList.map(m => {
            m.isChecked = false;
          })
          this.isShowGroupCopy = false;
          console.log(this.memberList)
        } else {
          this.memberList.map(m => {
            m.isChecked = true;
          })
        }
      })
    },
    handleCurrentChange (page) {
      this.$emit('getPortraitList', page);//重新通知父组件获取人像列表
    },
    // 判断是否选择了复制对象
    judgeIsSelectedCopy () {
      if (this.memberList.every(e => e.isChecked === false)) {
        this.$message.info('请先勾选复制对象!');
      } else {
        this.isShowGroupCopy = !this.isShowGroupCopy;
      }
    },
    // 判断是否选择了删除对象
    judgeIsSelectedRemove () {
      if (this.memberList.every(e => e.isChecked === false)) {
        this.$message.info('请先勾选删除对象!');
      } else {
        this.delPortraitDialog = true;
      }
    },
    // 获取人像组列表
    getGroupListIsPortrait (data) {
      getGroupListIsPortrait().then(res => {
        if (res && res.data) {
          this.groupListPortrait = res.data.filter(f => f.uid !== null);
        }
      })
      if (data) {
        setTimeout(() => {
          this.copyPortrait(data);
        }, 2000)
      }
    },
    // 批量删除人像
    delPortrait () {
      this.loadingBtn = true;
      const member = this.memberList.filter(f => f.isChecked === true).map(m => m.uid).join(',');
      const params = {ids: member};
      delPortrait(params).then((res) => {
        if (res) {
          this.delPortraitDialog = false;
          this.$message.success('删除成功！');
          this.$emit('getPortraitList', this.currentPage);//重新通知父组件获取人像列表
        }
      }).finally(() => {
        this.loadingBtn = false;
      })
    },
    // 批量复制人像到别的组
    copyPortrait (groupId) {
      const member = this.memberList.filter(f => f.isChecked === true).map(m => m.uid).join(',');
      const data = {
        groupId: groupId,
        ids: member
      }
      copyPortrait(data).then((res) => {
        if (res) {
          this.isShowGroupCopy = false;
          this.$message.success('复制成功');
          this.$emit('getPortraitList', this.currentPage);//重新通知父组件获取人像列表
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>


