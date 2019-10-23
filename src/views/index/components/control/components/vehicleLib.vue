<template>
  <el-dialog
    custom-class="vehicle_lib"
    :visible.sync="vehicleLibDialog"
    :close-on-click-modal="false"
    width="1200px"
    title="车辆布控库">
    <el-form ref="libForm" :model="libForm">
      <el-form-item label="" prop="vehicleColor">
        <el-select value-key="enumField" v-model="libForm.vehicleColor" filterable placeholder="车身颜色不限">
          <el-option
            v-for="item in vehicleColorList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="vehicleType">
        <el-select value-key="enumField" v-model="libForm.vehicleType" filterable placeholder="车辆类型不限">
          <el-option
            v-for="item in vehicleTypeList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="plateType">
        <el-select value-key="enumField" v-model="libForm.plateType" filterable placeholder="号牌类型不限">
          <el-option
            v-for="item in plateTypeList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="vehicleNumber" style="padding-right:10px!important;">
        <el-input v-model="libForm.vehicleNumber" placeholder="请输入车牌号码搜索"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="list_box" v-loading="loading">
      <div class="list_info" v-for="item in carMemberList.list" :key="item.uid">
        <div class="list_img"><img :src="item.photoUrl" alt="" style="width: 100%;height: 100%;"></div>
        <div class="list_data">
          <div class="data_title">
            <span class="vl_f_999">详情资料</span>
            <el-checkbox v-model="item.isChecked" @change="operateRadio()"></el-checkbox>
          </div>
          <div class="data_list">
            <span :title="item.vehicleNumber">{{item.vehicleNumber}}</span>
            <span :title="item.numberType">{{item.numberType}}</span>
            <span :title="item.vehicleNumber">{{item.vehicleNumber}}</span>
            <span :title="item.numberType">{{item.numberType}}</span>
          </div>
          <div class="data_list">
            <span :title="item.vehicleType" v-if="item.vehicleType">{{item.vehicleType}}</span>
            <span :title="item.vehicleColor" v-if="item.vehicleColor">{{item.vehicleColor}}</span>
            <span :title="item.vehicleType" v-if="item.vehicleType">{{item.vehicleType}}</span>
            <span :title="item.vehicleColor" v-if="item.vehicleColor">{{item.vehicleColor}}</span>
          </div>
          <div class="data_list">
            <span :title="item.numberColor" v-if="item.numberColor">{{item.numberColor}}</span>
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
      <el-pagination
        class="cum_pagination"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="carMemberList.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="carMemberList.total">
      </el-pagination>
    </div>
    <div slot="footer">
      <el-button @click="vehicleLibDialog = false" class="btn_140">取消</el-button>
      <el-button :loading="loading" class="btn_140" type="primary" @click="selControlLibMember">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {dataList} from '@/utils/data.js';
import {getVehicleList} from '@/views/index/api/api.control.js';
export default {
  props: ['groupIds', 'fileList'],
  data () {
    return {
      libForm: {
        vehicleColor: null,
        vehicleType: null,
        plateType: null,
        vehicleNumber: null
      },
      vehicleColorList: this.dicFormater(dataList.carColor)[0].dictList,
      vehicleTypeList: this.dicFormater(dataList.vehicleType)[0].dictList,
      plateTypeList: this.dicFormater(dataList.plateType)[0].dictList,
      vehicleLibDialog: false,
      loading: false,
      currentPage: 1,
      pageNum: 1,
      pageSize: 6,
      carMemberList: {}
    }

  },
  methods: {
    // 查询
    search () {
      this.pageNum = 1;
      this.currentPage = 1;
      this.getVehicleList();
    },
    //  获取全部车像列表，或者根据组id获取车像列表
    getVehicleList () {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderBy: null,
        order: null,
        'where.vehicleColor': this.libForm.vehicleColor,
        'where.vehicleType': this.libForm.vehicleType,
        'where.numberType': this.libForm.numberType
      }
      this.groupIds && (params['where.groupId'] = this.groupIds);
      this.libForm.vehicleNumber && (params['where.vehicleNumber'] = this.libForm.vehicleNumber);
      this.loading = true;
      getVehicleList(params).then(res => {
        if (res && res.data) {
          this.carMemberList = res.data;
          this.carMemberList.list = this.carMemberList.list.map(f => {
            if (this.fileList && this.fileList.some(s => s.vehicleNumber === f.vehicleNumber)) {
              this.$set(f, 'isChecked', true);
            } else {
              this.$set(f, 'isChecked', false);
            }
            const {vehicleImagePath, ...other} = f;
            return {
              photoUrl: vehicleImagePath,
              ...other
            }
          })
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    handleCurrentChange (page) {
      this.pageNum = page;
      this.currentPage = page;
      this.getVehicleList();
    },
    // 确认
    selControlLibMember () {
      let selList = this.carMemberList.list.reduce((next, cur) => {
        if (cur.isChecked) {
          return [...next, {
            objId: cur.uid,
            objType: 2,
            photoUrl: cur.photoUrl,
            vehicleNumber: cur.vehicleNumber
          }]
        } else {
          return next;
        }
      }, []);
      this.$emit('getVehicleData', selList);
      this.vehicleLibDialog = false;
    },
    // 多选
    operateRadio () {

    },
    // 重置
    reset () {
      this.$nextTick(() => {
        this.$refs['libForm'].resetFields();
        this.search();
      })
    },
  }
}
</script>
<style lang="scss">
.vehicle_lib{
  height: 100vh;
  left: unset;
  right:0;
  transform: translateY( -50%);
  .el-form{
    display: flex;
    padding-left:10px;
    .el-form-item{
      width: 20%;
      padding-right: 10px!important;
    }
  }
  .el-dialog__header{
    padding-left: 30px;
  }
  .el-dialog__body{
    overflow-y: auto;
    max-height: calc(100% - 124px);
    padding-bottom: 0!important;
    .list_box{
      margin: 0 0.5%;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      .list_info{
        margin: 0 0.5%;
        width: 49%;
        max-width: 680px;
        height: 240px;
        padding: 20px;
        margin-bottom: 1%;
        background:rgba(255,255,255,1);
        border-radius:1px;
        border:1px solid rgba(211,211,211,1);
        display: flex;
        justify-content: space-between;
        .list_img{
          width: 50%;
          padding-right: 20px;
          > img{
            width: 100%;
            height: 100%;
          }
        }
        .list_data{
          width: 50%;
          .data_title{
            display: flex;
            justify-content: space-between;
            i.can_click{
              cursor: pointer;
              &:hover{
                background-position: -584px -347px!important;
              }
            }
          }
          .data_list{
            display: flex;
            margin-top: 9px;
            span{
              padding: 5px 10px;
              background:rgba(250,250,250,1);
              border:1px solid rgba(242,242,242,1);
              border-radius: 3px;
              white-space:nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            & > span:not(:last-child){
              margin-right: 2px;
            }
            .more{
              position: relative;
              padding-top: 6px;
              .more_hover{
                margin-bottom: 10px;
                cursor: pointer;
                color: #0C70F8;
                border: none;
                padding: 0;
              }
            }
          }
        }
      }
      .cum_pagination{
        width: 100%;
      }
    }
  }
  .el-dialog__wrapper .el-dialog__footer {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>