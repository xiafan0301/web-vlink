<template>
  <el-dialog
    custom-class="portrait_lib"
    :visible.sync="portraitLibDialog"
    :close-on-click-modal="false"
    width="1200px"
    title="人辆布控库">
    <el-form ref="libForm" :model="libForm">
      <el-form-item label="" prop="sex">
        <el-select value-key="value" v-model="libForm.sex" filterable placeholder="请选择">
          <el-option
            v-for="item in sexList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="nation">
        <el-select value-key="value" v-model="libForm.nation" filterable placeholder="请选择">
          <el-option
            v-for="item in nationList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="idNum" style="padding-right:10px!important;">
        <el-input v-model="libForm.idNum" placeholder="请输入证件号码搜索"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="list_box" v-loading="loading">
      <div class="list_info" v-for="item in memberList.list" :key="item.uid">
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
          :page-size="memberList.pageSize"
          layout="prev, pager, next"
          :total="memberList.total">
        </el-pagination>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="portraitLibDialog = false" class="btn_140">取消</el-button>
      <el-button :loading="loading" class="btn_140" type="primary" @click="selControlLibMember">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {dataList} from '@/utils/data.js';
import {nationData} from '../testData.js';
export default {
  data () {
    return {
      libForm: {
        sex: null,
        nation: null,
        idNum: null
      },
      sexList: [
        {value: 1, label: '男'},
        {value: 2, label: '女'},
        {value: 3, label: '性别不限'}
      ],
      nationList: nationData,
      portraitLibDialog: false,
      loading: false,
      currentPage: 1,

      memberList: {"total":68,"list":[{"uid":"6o0FXxfhszDHzOjujxT2sT","sex":"女","nation":"汉族","idNo":"430481199011235729","name":"自动化许号联必","photoUrl":"https://apirel.aorise.org/medical-his/image/a24f4ecb-9252-4067-8c97-fa33e66ae056.jpg","remarks":"采中量数给本会术京党图厂传没进查增半千格有设议式车处单行十进真处需厂深角正革领路完部争称细列半想江利","origin":2,"groupNames":null},{"uid":"6TD3VnKe19f9z0EzU9907R","sex":"男","nation":"汉族","idNo":"440232196309230017","name":"邓喜潮","photoUrl":"http://newfile.aorise.org:80/group1/default/20190903/16/20/1/451b41c9-b8fc-4452-b103-d0e40cc4310d.jpg","remarks":"","origin":2,"groupNames":"在逃人员"},{"uid":"1jnaWLGzztr3d9fAkcZorg","sex":"未知","nation":"汉族","idNo":"432822197502078293","name":"廖相俭","photoUrl":"http://newfile.aorise.org:80/group1/default/20190903/16/20/1/50243007-894d-4837-aea7-2364c44b9615.jpg","remarks":"","origin":2,"groupNames":"在逃人员"},{"uid":"5hj5q9TfgRzWFmESMblSOo","sex":"男","nation":"汉族","idNo":"432923198002183616","name":"蒋结万","photoUrl":"http://newfile.aorise.org:80/group1/default/20190903/16/20/2/71728104-b4ef-4a96-a3fc-6fae4e8d1c44.jpg","remarks":"","origin":2,"groupNames":"在逃人员"},{"uid":"2Yi470rxBcap4t45t7fsdG","sex":"男","nation":"汉族","idNo":"432524198805160033","name":"刘志斌","photoUrl":"http://newfile.aorise.org:80/group1/default/20190903/16/19/1/fc6a7c43-0544-49e2-a729-6a96ae314986.jpg","remarks":"","origin":2,"groupNames":"在逃人员"},{"uid":"3c2bgfQqlkhGOt0DXqzcoM","sex":"男","nation":"汉族","idNo":"342128196203036214","name":"陈新华","photoUrl":"http://newfile.aorise.org:80/group1/default/20190903/16/19/2/548790ad-af47-4a4a-8407-ff54d5bfe0a2.jpg","remarks":"","origin":2,"groupNames":"在逃人员"},{"uid":"3PmdKgN6ATAh9kv7BGwbzh","sex":"男","nation":"汉族","idNo":"632122198501102814","name":"赵存福","photoUrl":"http://newfile.aorise.org:80/group1/default/20190903/16/18/1/b9c20394-60ef-4487-848f-73acd8f2dd80.jpg","remarks":"","origin":2,"groupNames":null},{"uid":"47nzZOa8Chx0XvNG7AawD3","sex":"男","nation":"回族","idNo":"371422196603104039","name":"卢洪河","photoUrl":"http://newfile.aorise.org:80/group1/default/20190903/16/18/1/09f4563a-0403-4573-98d5-018a3c0cd60e.jpg","remarks":"涉嫌故意杀人犯罪","origin":2,"groupNames":"在逃人员"},{"uid":"41IoQdXtarcRM2AoOuPW6q","sex":"男","nation":"汉族","idNo":"352228197210152514","name":"陈孝朵","photoUrl":"http://newfile.aorise.org:80/group1/default/20190903/16/09/1/c52c032e-8031-440a-8250-ce993514f675.jpg","remarks":"","origin":2,"groupNames":"在逃人员"}],"pageNum":1,"pageSize":9,"size":9,"startRow":1,"endRow":9,"pages":8,"prePage":0,"nextPage":2,"isFirstPage":true,"isLastPage":false,"hasPreviousPage":false,"hasNextPage":true,"navigatePages":8,"navigatepageNums":[1,2,3,4,5,6,7,8],"navigateFirstPage":1,"navigateLastPage":8,"firstPage":1,"lastPage":8},
    }

  },
  methods: {
    handleCurrentChange (page) {

    },
    // 确认
    selControlLibMember () {
      this.portraitLibDialog = false;
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
.portrait_lib{
  height: 100vh;
  left: unset;
  right:0;
  transform: translateY(-50%);
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