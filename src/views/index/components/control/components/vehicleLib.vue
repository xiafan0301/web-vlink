<template>
  <el-dialog
    custom-class="vehicle_lib"
    :visible.sync="vehicleLibDialog"
    :close-on-click-modal="false"
    width="1200px"
    title="车辆布控库">
    <el-form ref="libForm" :model="libForm">
      <el-form-item label="" prop="vehicleColor">
        <el-select value-key="enumField" v-model="libForm.vehicleColor" filterable placeholder="请选择">
          <el-option
            v-for="item in vehicleColorList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="vehicleType">
        <el-select value-key="enumField" v-model="libForm.vehicleType" filterable placeholder="请选择">
          <el-option
            v-for="item in vehicleTypeList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="plateType">
        <el-select value-key="enumField" v-model="libForm.plateType" filterable placeholder="请选择">
          <el-option
            v-for="item in plateTypeList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="plateNum" style="padding-right:10px!important;">
        <el-input v-model="libForm.plateNum" placeholder="请输入车牌号码搜索"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="list_box" v-loading="loading">
      <div class="list_info" v-for="item in memberList.list" :key="item.uid">
        <div class="list_img"><img :src="item.vehicleImagePath" alt="" style="width: 100%;height: 100%;"></div>
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
        :page-size="memberList.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="memberList.total">
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
export default {
  data () {
    return {
      libForm: {
        vehicleColor: null,
        vehicleType: null,
        plateType: null,
        plateNum: null
      },
      vehicleColorList: this.dicFormater(dataList.carColor)[0].dictList,
      vehicleTypeList: this.dicFormater(dataList.vehicleType)[0].dictList,
      plateTypeList: this.dicFormater(dataList.plateType)[0].dictList,
      vehicleLibDialog: false,
      loading: false,
      currentPage: 1,

      memberList: {"total":44,"list":[{"uid":"0X70KMaBa7AMQDr30sqfDx","vehicleNumber":"湘D912CM","vehicleType":"面包车","vehicleColor":"紫","numberType":"澳门入出境车","numberColor":"","desci":"日领叫常社保后油那引对步信道日给易半","origin":2,"vehicleImagePath":"http://file.aorise.org/vlink/image/47744ba3-32d2-4c3f-b767-471bee6c5232.jpg","groupNames":null},{"uid":"6SBIM5AVwa4ov4paO5PDZw","vehicleNumber":"湘D718CM","vehicleType":"电动车","vehicleColor":"黑","numberType":"","numberColor":"","desci":"应号当广还消完声百约专关型处圆阶明时很关","origin":1,"vehicleImagePath":"http://file.aorise.org/vlink/image/47744ba3-32d2-4c3f-b767-471bee6c5232.jpg","groupNames":"自动化准长"},{"uid":"5AvsszspOGDJuABlIKpCif","vehicleNumber":"湘D241CM","vehicleType":"自行车","vehicleColor":"蓝","numberType":"警用摩托","numberColor":"","desci":"起这完越科调色改况光过九参都构它般金得五场外队号收列离界越民我张热快调标快型术流应非工花在力带持一天产龙面且比用为身等进多说边复深","origin":2,"vehicleImagePath":"http://file.aorise.org/vlink/image/47744ba3-32d2-4c3f-b767-471bee6c5232.jpg","groupNames":"自动化准长"},{"uid":"1SeFIZztG2XY1IvvzT6KTL","vehicleNumber":"赣GN5075","vehicleType":"","vehicleColor":"","numberType":"小型汽车","numberColor":"蓝底白字","desci":"","origin":2,"vehicleImagePath":"http://file.aorise.org/vlink/image/0a28d5c7-8ff2-4f86-ae96-381d4c1d692d.jpg","groupNames":null},{"uid":"1CnSKaMby4hn7au7ZVcgWA","vehicleNumber":"湘GW8811","vehicleType":"","vehicleColor":"","numberType":"小型汽车","numberColor":"蓝底白字","desci":"","origin":2,"vehicleImagePath":"http://filevlink.aorise.org/root/image/2019/08/01/34020000001320000002022019080108193100001_m_1.jpeg","groupNames":null},{"uid":"0oGcWoXVKy6VofXtTO14Yq","vehicleNumber":"粤TQE512","vehicleType":"","vehicleColor":"","numberType":"小型汽车","numberColor":"蓝底白字","desci":"","origin":2,"vehicleImagePath":"http://file.aorise.org/vlink/image/b84c6854-2545-422b-ae47-206091780499.jpg","groupNames":null},{"uid":"69B1LsGCzy9gUrRAyUtN6H","vehicleNumber":"湘A1J10Q","vehicleType":"轿车","vehicleColor":"白","numberType":"小型汽车","numberColor":"蓝底白字","desci":"","origin":2,"vehicleImagePath":"http://file.aorise.org/vlink/image/403e5171-a30f-47fe-9896-66ca9ab099f0.jpg","groupNames":"失踪车辆"},{"uid":"2ooICVGUSM81OGlSyn8PVI","vehicleNumber":"湘A757BW","vehicleType":"","vehicleColor":"","numberType":"小型汽车","numberColor":"蓝底白字","desci":"","origin":2,"vehicleImagePath":"http://file.aorise.org/vlink/image/fcc338aa-b7a8-4351-b181-57347a37214c.jpg","groupNames":"失踪车辆"},{"uid":"4WFTqpZmaYUUFVp84KazPO","vehicleNumber":"湘A1J10J","vehicleType":"轿车","vehicleColor":"灰","numberType":"小型汽车","numberColor":"蓝底白字","desci":"","origin":2,"vehicleImagePath":"http://file.aorise.org/vlink/image/df7dba49-9540-4810-89b2-450fa5c46157.jpg","groupNames":null}],"pageNum":1,"pageSize":9,"size":9,"startRow":1,"endRow":9,"pages":5,"prePage":0,"nextPage":2,"isFirstPage":true,"isLastPage":false,"hasPreviousPage":false,"hasNextPage":true,"navigatePages":8,"navigatepageNums":[1,2,3,4,5],"navigateFirstPage":1,"navigateLastPage":5,"firstPage":1,"lastPage":5}
    }

  },
  methods: {
    handleCurrentChange (page) {

    },
    // 确认
    selControlLibMember () {
      this.vehicleLibDialog = false;
    },
    // 多选
    operateRadio () {

    },
    // 重置
    reset () {
      this.$nextTick(() => {
        this.$refs['libForm'].resetFields();
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
}
</style>