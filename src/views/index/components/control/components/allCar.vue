<template>
<!-- 全部车像列表 -->
  <div class="set_list">
    <div class="bread_crumbs">
      <span @click="skipIsList">布控库</span><i class="el-icon-arrow-right"></i><span @click="skipIsList">车像库</span><i class="el-icon-arrow-right"></i><span>组设置</span>
    </div>
    <div class="member_title">
      <div>
        <div><span class="vl_f_333">全部车辆</span></div>
        <div><el-checkbox v-model="allChecked" @change="operateAllChecked()">全选</el-checkbox><span class="vl_f_333">已选择 <span>{{allIsChecked}}</span>张</span></div>
      </div>
      <div>
        <el-button @click="judgeIsSelectedCopy" class="reset_btn btn_100">复制到组</el-button>
        <el-button @click="judgeIsSelectedRemove" class="reset_btn btn_100">删除车像</el-button>
        <el-collapse-transition>
          <ul class="group_copy" v-show="isShowGroupCopy">
            <vue-scroll>
              <li @click="copyVehicle(item.uid)" v-for="item in groupListCar" :key="item.uid">{{item.groupName}}</li>
              <li class="group_copy_add" @click="popGroupDialog"><i class="el-icon-circle-plus vl_f_999"></i><span class="vl_f_333">添加分组</span></li>
            </vue-scroll>
          </ul>
        </el-collapse-transition>
      </div>
    </div>
    <div class="list_box">
      <div class="list_info" v-for="item in memberList" :key="item.uid">
        <div class="list_img"><img :src="item.vehicleImagePath" alt="" style="width: 100%;height: 100%;"></div>
        <div class="list_data">
          <div class="data_title">
            <span class="vl_f_999">详情资料</span>
            <el-checkbox v-model="item.isChecked" @change="operateRadio()"></el-checkbox>
          </div>
          <div class="data_list">
            <span :title="item.vehicleNumber">{{item.vehicleNumber}}</span><span :title="item.numberType">{{item.numberType}}</span>
          </div>
          <div class="data_list">
            <span :title="item.vehicleType">{{item.vehicleType}}</span><span :title="item.vehicleColor">{{item.vehicleColor}}</span>
          </div>
          <div class="data_list">
            <span :title="item.numberColor">{{item.numberColor}}</span>
            <template v-if="item.groupNames">
              <template v-for="(gN, index) in item.groupNames.split(',')">
                <span v-if="index === 0" :title="gN" :key="index + gN">{{gN}}</span>
              </template>
              <div class="more" v-if="item.groupNames.split(',').length > 1">
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
            </template>
          </div>
          <div class="data_list" v-if="item.desci">
            <span>{{item.desci}}</span>
          </div>
        </div>
      </div>
      <div style="width: 100%;">
        <el-pagination
          style="text-align: center;"
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="carMemberList.pageSize"
          layout="prev, pager, next"
          :total="carMemberList.total">
        </el-pagination>
      </div>
    </div>
    <!-- 新增组 -->
    <div is="groupDialog" :tabType="tabType" operateType="1" ref="groupDialog" @getGroupList="getGroupListIsVehicle"></div>
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
          <el-button @click="delCarDialog = false" class="   btn_140">取消</el-button>
          <el-button :loading="loadingBtn" class="select_btn btn_140" @click="delVehicle">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import groupDialog from './groupDialog.vue';
import {delVehicle, copyVehicle, getGroupListIsVehicle} from '@/views/index/api/api.control.js';
export default {
  components: {groupDialog},
  props: ['carMemberList', 'tabType', 'currentPage'],
  data () {
    return {
      allChecked: false,
      memberList: [],//成员列表数据
      isShowGroupCopy: false,//点击复制按钮是否显示组下拉列表
      track: null,
      showMoreId: null,//显示更多组的组id
      // 车像组列表数据
      groupListCar: [],
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
  mounted () {
    this.getGroupListIsVehicle();
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
      this.$emit('getVehicleList', page);//重新通知父组件获取车像列表
    },
    // 判断是否选择了复制对象
    judgeIsSelectedCopy () {
      if (this.memberList.every(e => e.isChecked === false)) {
        this.$message.error('请先勾选复制对象!');
      } else {
        this.isShowGroupCopy = !this.isShowGroupCopy;
      }
    },
    // 判断是否选择了移出对象
    judgeIsSelectedRemove () {
      if (this.memberList.every(e => e.isChecked === false)) {
        this.$message.error('请先勾选删除对象!');
      } else {
        this.delCarDialog = true;
      }
    },
    // 复制到自定义组
    copyIsGroup () {
      this.isShowGroupCopy = !this.isShowGroupCopy;
    },
    // 获取车像组列表
    getGroupListIsVehicle (data) {
      getGroupListIsVehicle().then(res => {
        if (res && res.data) {
          this.groupListCar = res.data.filter(f => f.uid !== null);
        }
      })
      if (data) {
        setTimeout(() => {
          this.copyVehicle(data);
        }, 2000)
      }
    },
    // 批量删除车像
    delVehicle () {
      this.loadingBtn = true;
      const member = this.memberList.filter(f => f.isChecked === true).map(m => m.uid).join(',')
      const params = {ids: member};
      delVehicle(params).then((res) => {
        if (res) {
          this.delCarDialog = false;
          this.$message.success('删除成功！');
          this.$emit('getVehicleList', this.currentPage);//重新通知父组件获取车像列表
        }
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
      copyVehicle(data).then((res) => {
        if (res) {
          this.isShowGroupCopy = false;
          this.$message.success('复制成功');
          this.$emit('getVehicleList', this.currentPage);//重新通知父组件获取车像列表
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>


