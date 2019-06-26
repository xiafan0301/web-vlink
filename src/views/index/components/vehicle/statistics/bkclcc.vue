<template>
  <div class="bkclcc_container">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>布控车辆出城统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="con_box">
      <div class="con_left">
        <div class="left_start">
          <span>开始</span>
          <el-date-picker
            v-model="queryForm.startTime"
            type="datetime"
            placeholder="请选择开始时间">
          </el-date-picker>
        </div>
        <div class="left_end">
          <span>结束</span>
          <el-date-picker
            v-model="queryForm.endTime"
            type="datetime"
            placeholder="请选择结束时间">
          </el-date-picker>
        </div>
        <el-select
          style="width: 100%;"
          v-model="queryForm.devIdData"
          multiple
          popper-class="statistics_select_list"
          @remove-tag="removeSeletedDev"
          @click.native="showChange"
          collapse-tags
          placeholder="请选择卡口">
          <el-option value="0" label=" "></el-option>
        </el-select>
        <div class="search_item" v-show="isShowSelectList">
          <div class="tab_box">
            <div @click="changeTab(1)">摄像头</div>
            <div @click="changeTab(2)">卡口</div>
          </div>
          <vue-scroll>
            <el-tree
              v-show="tabIndex === 1"
              :data="data1"
              class="select_tree"
              ref="selectTree1"
              @check-change="changeSeletedStatus"
              show-checkbox
              node-key="label">
            </el-tree>
            <el-tree
              v-show="tabIndex === 2" 
              :data="data2"
              class="select_tree"
              ref="selectTree2"
              @check-change="changeSeletedStatus"
              show-checkbox
              node-key="label">
            </el-tree>
          </vue-scroll>
        </div>
        <div class="left_radio"><span>车牌：</span><el-radio v-model="queryForm.radio" label="1">非</el-radio></div>
        <div class="left_province">
          <el-select v-model="queryForm.provinceId" placeholder="请选择">
            <el-option
              v-for="item in provinceList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="queryForm.provinceName"></el-input>
        </div>
        <div class="left_btn">
          <el-button class="reset_btn">重置</el-button>
          <el-button class="select_btn">统计</el-button>
        </div>
      </div>
      <div class="con_right">
        <div class="right_box table_box">
          <el-table
            v-loading="loading"
            :data="bkclccList"
            >
            <el-table-column
              type="index"
              label="序号">
            </el-table-column>
            <el-table-column
              label="车牌号码"
              prop="area"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="卡口名称"
              prop="摄像头"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="抓拍时间"
              prop="监控箱"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span class="sta_clickable" @click="$refs.devListDialog.showDialog()">{{scope.row['超时工单比率']}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="车道"
              prop="监控箱"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车牌颜色"
              prop="监控箱"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="布控库"
              prop="监控箱"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车辆类型"
              prop="监控箱"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车速"
              prop="监控箱"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="操作"
              show-overflow-tooltip
              >
              <template>
                <span class="operation_btn">查看</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="cum_pagination"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="30">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryForm: {
        startTime: null,
        endTime: null,
        devIdData: [],
        provinceId: null,
        provinceName: null,
        radio: null
      },
      isShowSelectList: false,
      tabIndex: 1, // select 下拉 tab 切换下标
      data1: [{
        id: 1,
        label: '一级 1',
        children: [{
            id: 4,
            label: '二级 1-1'
        }]
        }, {
        id: 2,
        label: '一级 2',
        children: [{
            id: 5,
            label: '二级 2-1'
        }, {
            id: 6,
            label: '二级 2-2'
        }]
        }, {
        id: 3,
        label: '一级 3',
        children: [{
            id: 7,
            label: '二级 3-1'
        }, {
            id: 8,
            label: '二级 3-2'
        }]
      }],
      data2: [{
        id: 1,
        label: '一级 3',
        children: [{
            id: 4,
            label: '二级 1-1'
        }]
        }, {
        id: 2,
        label: '一级 4',
        children: [{
            id: 5,
            label: '二级 2-1'
        }, {
            id: 6,
            label: '二级 2-2'
        }]
        }, {
        id: 3,
        label: '一级 5',
        children: [{
            id: 7,
            label: '二级 3-1'
        }, {
            id: 8,
            label: '二级 3-2'
        }]
      }],
      provinceList: [],
      loading: false,
      bkclccList: [{name: 'xxxxxxx'}],
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
    }
  },
  methods: {
    showChange () {
      this.isShowSelectList = !this.isShowSelectList;
    },
    changeTab (tabIndex) {
      this.tabIndex = tabIndex;
      // this.cameraData = this.tabIndex === 1 ? this.data1 : this.data2;
    },
    removeSeletedDev (data) {
      console.log(data, 'removeSeletedDev')
      this.$refs.selectTree1.setChecked(data, false);
    },
    changeSeletedStatus (data, isSelNode1, isSelNode2) {
      console.log(data, isSelNode1, isSelNode2, 'changeSeletedStatus');
      setTimeout(() => {
        if (!isSelNode1) {
          if (data.children) {
            for (let item of data.children) {
              this.devIdData = this.devIdData.filter(f => f !== item.label);
            }
          } else {
            this.devIdData = this.devIdData.filter(f => f !== data.label);
          }
          return;
        };
      })
      if (!data.children) return;
      const labelList = data.children.map(m => m.label);
      setTimeout(() => {
        for (let f of labelList) {
          this.devIdData.push(f);
        }
        console.log(this.devIdData, 'this.devIdData')
      })
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    handleCurrentChange (page) {
      
    },
  }
}
</script>
<style lang="scss" scoped>
.bkclcc_container{
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  .breadcrumb_heaer{
    border-bottom: 1px solid #D3D3D3;
  }
  .con_box{
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: calc(100% - 55px);
    .con_left{
      width: 272px;
      height: 100%;
      padding: 20px;
      > .left_start, .left_end{
        display: flex;
        padding-bottom: 10px; 
        > span{
          color: #999999;
        }
      }
      .search_item {
        height: 120px;
        width: 232px;
        .tab_box{
          width: 100%;
          display: flex;
          > div{
            width: 50%;
            text-align: center;
            border: 1px solid #e6e6e6;
          }
        }
        .select_tree {
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          background-color: #fff;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
      }
      .left_radio{
        padding: 40px 0 10px 0;
        > span{
          color: #999999;
        }
      }
      .left_province{
        display: flex;
        .el-select{
          width: 82px;
        }
      }
      .left_btn{
        padding-top: 10px;
        .select_btn, .reset_btn {
          width: 110px;
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
    }
    .con_right{
      width: calc(100% - 272px);
      height: 100%;
      background: #F7F9F9;
      .right_box{
        height: calc(100% - 40px);
        margin: 20px;
        padding: 20px;
        background: #fff;
      }
    }
  }
}
</style>
<style lang="scss">
.bkclcc_container{
  .left_radio .el-radio__label{
    color: #999999;
  }
  .left_province{
    .el-input .el-input__inner{
      border-radius: 0 4px 4px 0!important;
    }
    .el-select .el-input--suffix .el-input__inner{
      border-radius: 4px 0 0 4px!important;
      border-right: none;
    }
  }
}
.statistics_select_list {
  display: none!important;
}
</style>