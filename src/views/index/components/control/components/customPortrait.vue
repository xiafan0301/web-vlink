<template>
<!-- 自定义人像列表 -->
  <div class="set_list">
    <div class="member_title">
      <div>
        <div><span class="vl_f_333">{{gName}}</span><i class="vl_icon vl_icon_control_25" @click="popGroupDialog('2')"></i><i class="vl_icon vl_icon_control_24" @click="delGroupDialog = true;"></i></div>
        <div><el-checkbox v-model="allChecked" @click.native="operateAllChecked()">全选</el-checkbox><span class="vl_f_333">已选择 <span>{{allIsChecked}}</span>张</span></div>
      </div>
      <div>
        <el-button @click="judgeIsSelectedCopy">复制到组</el-button>
        <el-button @click="judgeIsSelectedRemove">移出该组</el-button>
        <el-collapse-transition>
          <ul class="group_copy" v-show="isShowGroupCopy">
            <li @click="copyPortrait(item.uid)" v-for="item in groupListPortrait" :key="item.uid">{{item.groupName}}</li>
            <li class="group_copy_add" @click="popGroupDialog('1')"><i class="el-icon-circle-plus vl_f_999"></i><span class="vl_f_333">添加分组</span></li>
          </ul>
        </el-collapse-transition>
      </div>
    </div>
    <div class="list_box">
      <div class="list_info" v-for="item in memberList" :key="item.uid">
        <div class="list_img"><img :src="item.photoUrl" alt="" style="width: 100%;"></div>
        <div class="list_data">
          <div class="data_title">
            <span class="vl_f_999">详情资料</span>
            <el-checkbox v-model="item.isChecked" @click.native="operateRadio()"></el-checkbox>
          </div>
          <div class="data_list">
            <span>{{item.name}}</span>
            <span>{{item.sex}}</span>
            <span>{{item.nation}}</span>
          </div>
          <div class="data_list">
            <span>{{item.idNo}}<i class="vl_icon vl_icon_control_29"></i></span>
          </div>
          <div class="data_list">
            <span>失踪儿童</span>
            <span>分组2</span>
            <div class="more">
              <span @mouseenter="showMoreId = item.uid" @mouseleave="showMoreId = null">更多组</span>
              <template v-if="showMoreId === item.uid">
                <div>
                  <span>失踪儿童</span>
                  <span>拐卖儿童</span>
                  <span>拐卖儿童</span>
                </div>
                <i></i>
              </template>
            </div>
          </div>
          <div class="data_list">
            <span>{{item.remarks}}</span>
          </div>
        </div>
      </div>
      <div style="width: 100%;">
        <el-pagination
          style="text-align: center;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="protraitMemberList.pageSzie"
          layout="total, prev, pager, next, jumper"
          :total="protraitMemberList.total">
        </el-pagination>
      </div>
    </div>
    <!-- 删除自定义组 -->
    <div class="del_group_dialog">
      <el-dialog
        :visible.sync="delGroupDialog"
        :close-on-click-modal="false"
        width="482px"
        top="40vh">
        <h1 class="vl_f_16 vl_f_333" style="margin-bottom: 4px;">确定要删除该分组吗？</h1>
        <p class="vl_f_12 vl_f_999">删除后该分组人像将找不到。</p>
        <div slot="footer">
          <el-button @click="delGroupDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary" @click="delGroupById">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 移出组成员 -->
    <div class="remove_group_dialog">
      <el-dialog
        :visible.sync="removeGroupDialog"
        :close-on-click-modal="false"
        width="482px"
        top="40vh">
        <h1 class="vl_f_16 vl_f_333" style="margin-bottom: 4px;">确定要将这 <span>{{allIsChecked}}</span>条人像数据移出该组？</h1>
        <p class="vl_f_12 vl_f_999">移出该组后将在系统默认中。</p>
        <div slot="footer">
          <el-button @click="removeGroupDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary" @click="removePortrait">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 新增/修改组 -->
    <div is="groupDialog" :operateType="operateType" ref="groupDialog" :groupId="groupId" @sendChildren="getParentData"></div>
  </div>
</template>
<script>
import groupDialog from './groupDialog.vue';
import {copyPortrait, removePortrait, delGroupById} from '@/views/index/api/api.js';
export default {
  components: {groupDialog},
  props: ['protraitMemberList', 'groupId', 'groupName'],
  data () {
    return {
      // 翻页数据
      currentPage: 1,
      pageSzie: 10,
      pageNum: 1,
      allChecked: false,
      memberList: [],//成员列表数据
      isShowGroupCopy: false,//点击复制按钮是否显示组下拉列表
      track: null,
      showMoreId: null,//显示更多组的组id
      // 人像组列表数据
      groupListPortrait: [
        {groupName: '全部人像', memberNum: 200, uid: '0'},
        {groupName: '人像test1', memberNum: 200, uid: '1'},
        {groupName: '人像test2', memberNum: 201, uid: '2'},
        {groupName: '人像test3', memberNum: 202, uid: '3'}
      ],
      gName: null,//组名
      // 弹出框参数
      delGroupDialog: false,
      removeGroupDialog: false,
      loadingBtn: false,
      operateType: null,//1-新增，2-修改
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
    this.gName = this.groupName;
     console.log(this.gName)
  },
  methods: {
    // 删除分组
    delGroupById () {
      delGroupById(this.groupId).then(res => {
        this.delGroupDialog = false;
        this.$message.success('删除成功');
        this.$emit('changePage');
      })
    },
    getParentData (data) {
      this.gName = data;
    },
    popGroupDialog (type) {
      this.operateType = type;
      this.$refs['groupDialog'].reset();
    },
    // 单选
    operateRadio () {
      console.log(this.memberList)
      this.$nextTick(() => {
        this.allChecked = !this.memberList.some(s => s.isChecked === false);
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
          console.log(this.memberList)
        } else {
          this.memberList.map(m => {
            m.isChecked = true;
          })
        }
      })
    },
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
      // 判断是否选择了复制对象
    judgeIsSelectedCopy () {
      if (this.memberList.every(e => e.isChecked === false)) {
        this.$message.error('请选择复制对象!');
      } else {
        this.isShowGroupCopy = !this.isShowGroupCopy;
      }
    },
    // 判断是否选择了移出对象
    judgeIsSelectedRemove () {
      if (this.memberList.every(e => e.isChecked === false)) {
        this.$message.error('请选择移出对象!');
      } else {
        this.removeGroupDialog = true;
      }
    },
    // 批量复制人像到别的组
    copyPortrait (groupId) {
      const member = this.memberList.filter(f => f.isChecked === true).map(m => m.uid).join(',');
      const data = {
        groupId: groupId,
        ids: member
      }
      copyPortrait(data).then(() => {
        this.isShowGroupCopy = false;
        this.$message.success('复制成功');
        this.$emit('getPortraitList');//重新通知父组件获取人像列表
      })
    },
    // 批量移出人像到别的组
    removePortrait () {
      this.loadingBtn =  true;
      const member = this.memberList.filter(f => f.isChecked === true).map(m => m.uid).join(',');
      const data = {
        groupId: this.groupId,
        ids: member
      }
      removePortrait(data).then(() => {
        this.removeGroupDialog = false;
        this.$message.success('移出成功');
        this.$emit('getPortraitList');//重新通知父组件获取人像列表
      }).finally(() => {
        this.loadingBtn = false;
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>


