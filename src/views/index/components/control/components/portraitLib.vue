<template>
  <el-dialog
    custom-class="portrait_lib"
    :visible.sync="portraitLibDialog"
    :close-on-click-modal="false"
    width="1200px"
    title="人像布控库">
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
      <el-form-item label="" prop="idNo" style="padding-right:10px!important;">
        <el-input v-model="libForm.idNo" placeholder="请输入证件号码搜索"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="list_box" v-loading="loading">
      <div class="list_info" v-for="item in protraitMemberList.list" :key="item.uid">
        <div class="list_img"><img :src="item.photoUrl" alt="" style="width: 100%;height: 100%;"></div>
        <div class="list_data">
          <div class="data_title">
            <span class="vl_f_999">详情资料</span>
            <el-checkbox v-model="item.isChecked" :disabled="item.disabled" @change="operateRadio()"></el-checkbox>
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
      <el-pagination
        class="cum_pagination"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="protraitMemberList.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="protraitMemberList.total">
      </el-pagination>
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
import {getPortraitList} from '@/views/index/api/api.control.js';
export default {
  props: ['fileListOne', 'fileListTwo', 'imgNum'],
  data () {
    return {
      libForm: {
        sex: null,
        nation: null,
        idNo: null
      },
      sexList: [
        {label: '未知', value: 0},
        {label: '男', value: 1},
        {label: '女', value: 2}
      ],
      nationList: nationData,
      portraitLibDialog: false,
      loading: false,
      currentPage: 1,
      pageNum: 1,
      pageSize: 6,
      protraitMemberList: {}
    }

  },
  watch: {
    'protraitMemberList.list': {
      handler (val) {
        if (this.imgNum) {
          let uid = null;
          if (val.some(s => {if (s.isChecked) {uid = s.uid;return true;}})) {
            val.forEach(f => {
              if (f.uid !== uid) {
                f.disabled = true
              }
            })
          } else {
            val.forEach(f => {
              f.disabled = false
            })
          }
        }
      },
      deep: true
    }
  },
  mounted () {
    this.getPortraitList();
  },
  methods: {
    // 查询
    search () {
      this.pageNum = 1;
      this.currentPage = 1;
      this.getPortraitList();
    },
    // 获取全部人像列表，或者根据组id获取人像列表
    getPortraitList () {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderBy: null,
        order: null,
        'where.sex': this.libForm.sex,
        'where.nation': this.libForm.nation
      }
      this.libForm.idNo && (params['where.idNo'] = this.libForm.idNo);
      this.loading = true;
      getPortraitList(params).then(res => {
        if (res && res.data) {
          this.protraitMemberList = res.data;
           this.protraitMemberList.list = this.protraitMemberList.list.map(f => {
            if (this.fileListOne && this.fileListOne.some(s => s.objId === f.uid)) {
              this.$set(f, 'isChecked', true);
            } else if (this.fileListTwo && this.fileListTwo.some(s => s.objId === f.uid)) {
              this.$set(f, 'isChecked', true);
            } else {
              this.$set(f, 'isChecked', false);
            }
            if (this.imgNum) {
              this.$set(f, 'disabled', false);
            }
            const {photoUrl, ...other} = f;
            return {
              photoUrl: photoUrl,
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
      this.getPortraitList();
    },
    // 确认
    selControlLibMember () {
      let selList = this.protraitMemberList.list.reduce((next, cur) => {
        if (cur.isChecked) {
          return [...next, {
            objId: cur.uid,
            objType: 1,
            photoUrl: cur.photoUrl,
            name: cur.name 
          }]
        } else {
          return next;
        }
      }, []);
      this.$emit('getPortraitData', selList);
      this.portraitLibDialog = false;
      this.$parent.portraitLibDialog = false;
    },
    // 多选
    operateRadio () {
      console.log(this.protraitMemberList, 'this.protraitMemberList')
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
  .el-dialog__wrapper .el-dialog__footer {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>