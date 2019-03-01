<template>
<!-- 全部车像列表 -->
  <div class="set_list">
    <div class="member_title">
      <div>
        <div><span class="vl_f_333">全部车辆</span></div>
        <div><el-checkbox v-model="allChecked" @click.native="operateAllChecked()">全选</el-checkbox><span class="vl_f_333">已选择 <span>{{allIsChecked}}</span>张</span></div>
      </div>
      <div>
        <el-button @click="judgeIsSelectedCopy">复制到组</el-button>
        <el-button @click="judgeIsSelectedRemove">删除车像</el-button>
        <el-collapse-transition>
          <ul class="group_copy" v-show="isShowGroupCopy">
            <li @click="copyVehicle(item.uid)" v-for="item in groupListCar" :key="item.uid">{{item.groupName}}</li>
            <li class="group_copy_add" @click="popGroupDialog"><i class="el-icon-circle-plus vl_f_999"></i><span class="vl_f_333">添加分组</span></li>
          </ul>
        </el-collapse-transition>
      </div>
    </div>
    <div class="list_box">
      <div class="list_info" v-for="item in memberList" :key="item.uid">
        <div class="list_img"><img :src="item.vehicleImagePath" alt="" style="width: 100%;"></div>
        <div class="list_data">
          <div class="data_title">
            <span class="vl_f_999">详情资料</span>
            <el-checkbox v-model="item.isChecked" @click.native="operateRadio()"></el-checkbox>
          </div>
          <div class="data_list">
            <span>{{item.vehicleNumber}}</span><span>{{item.numberType}}</span>
          </div>
          <div class="data_list">
            <span>{{item.vehicleType}}</span><span>{{item.vehicleColor}}</span>
          </div>
          <div class="data_list">
            <span>{{item.numberColor}}</span>
            <span>{{item.groupNames}}</span>
            <div class="more">
              <span @mouseenter="showMoreId = item.uid" @mouseleave="showMoreId = null">更多组</span>
              <template v-if="showMoreId === item.uid">
                <div>
                  <span>失踪儿童</span>
                  <span>拐卖儿童</span>
                </div>
                <i></i>
              </template>
            </div>
          </div>
          <div class="data_list">
            <span>{{item.desci}}</span>
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
          :page-size="carMemberList.pageSzie"
          layout="total, prev, pager, next, jumper"
          :total="carMemberList.total">
        </el-pagination>
      </div>
    </div>
    <!-- 新增组 -->
    <div is="groupDialog" operateType="1" ref="groupDialog"></div>
    <!-- 删除车像 -->
    <div class="del_car_dialog">
      <el-dialog
        :visible.sync="delCarDialog"
        :close-on-click-modal="false"
        width="482px"
        top="40vh"
        title="删除提示">
        <h1 class="vl_f_16 vl_f_333" style="margin-bottom: 4px;">是否删除布控库中已选的{{allIsChecked}}条对象数据？</h1>
        <div slot="footer">
          <el-button @click="delCarDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary" @click="delVehicle">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import groupDialog from './groupDialog.vue';
import {delVehicle, copyVehicle} from '@/views/index/api/api.js';
export default {
  components: {groupDialog},
  props: ['carMemberList'],
  data () {
    return {
      // 翻页数据
      currentPage: 1,
      allChecked: false,
      memberList: [],//成员列表数据
      isShowGroupCopy: false,//点击复制按钮是否显示组下拉列表
      track: null,
      showMoreId: null,//显示更多组的组id
      // 车像组列表数据
      groupListCar: [
        {groupName: '全部车像', memberNum: 200, uid: '0'},
        {groupName: '车像test1', memberNum: 200, uid: '4'},
        {groupName: '车像test2', memberNum: 201, uid: '5'},
        {groupName: '车像test3', memberNum: 201, uid: '6'}
      ],
      // 弹出框参数
      delCarDialog: false,
      loadingBtn: false,
    }
  },
  watch: {
    carMemberList (val) {
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
      this.memberList = this.carMemberList && this.carMemberList.list;
      this.memberList.forEach(f => {
        this.$set(f, 'isChecked', false);
      })
    },
  methods: {
    popGroupDialog () {
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
        this.$message.error('请选择删除对象!');
      } else {
        this.delCarDialog = true;
      }
    },
    // 复制到自定义组
    copyIsGroup () {
      this.isShowGroupCopy = !this.isShowGroupCopy;
    },
    // 批量删除车像
    delVehicle () {
      this.loadingBtn = true;
      const member = this.memberList.filter(f => f.isChecked === true).map(m => m.uid).join(',')
      const params = {ids: member};
      delVehicle(params).then(() => {
        this.delCarDialog = false;
        this.$message.success('删除成功！');
        this.$emit('getVehicleList');//重新通知父组件获取车像列表
      }).finally(() => {
        this.loadingBtn = false;
      })
    },
    // 批量复制车像到别的组
    copyVehicle (groupId) {
      const member = this.memberList.filter(f => f.isChecked === true).map(m => m.uid).join(',');
      const data = {
        groupId: groupId,
        ids: member
      }
      copyVehicle(data).then(() => {
        this.isShowGroupCopy = false;
        this.$message.success('复制成功');
        this.$emit('getVehicleList');//重新通知父组件获取车像列表
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>


