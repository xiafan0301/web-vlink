<template>
  <div class="gcsj_container">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">侦查</el-breadcrumb-item>
        <el-breadcrumb-item>过车数据统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="con_box">
      <div class="con_left">
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
        <div class="left_btn">
          <el-button class="reset_btn">重置</el-button>
          <el-button class="select_btn">查询</el-button>
        </div>
      </div>
      <div class="con_right">
        <div class="chart_top">
          <div>
            <div>
              <i class="el-icon-camera-solid"></i>
              <span>设备数</span>
            </div>
            <span>19个</span>
          </div>
          <div>
            <div>
              <i class="el-icon-camera-solid"></i>
              <span>过车总数</span>
            </div>
            <span>19万次</span>
          </div>
          <div>
            <div>
              <i class="el-icon-camera-solid"></i>
              <span>车辆总数</span>
            </div>
            <span>19辆</span>
          </div>
          <div>
            <div>
              <i class="el-icon-camera-solid"></i>
              <span>外地车数</span>
            </div>
            <span>19辆</span>
          </div>
        </div>
        <div class="chart_bottom">
          <div class="chart_item" v-for="item in '1234'" :key="item.id">

          </div>
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
.gcsj_container{
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
    height: calc(100% - .55rem);
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
      > .left_start{
        padding-top: 10px; 
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
      width: calc(100% - 2.72rem);
      height: 100%;
      padding: 20px 20px 20px 0;
      background: #F7F9F9;
      .chart_top{
        width: 100%;
        height: 1.3rem;
        padding-bottom: .2rem;
        display: flex;
        > div{
          width: 25%;
          height: 1.1rem;
          margin-left: .2rem;
          box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
          line-height: 1.1rem!important;
          display: flex;
          justify-content: space-between;
          padding: 0 35px;
          > div{
            display: flex;
            > i{
              line-height: 1.1rem!important;
              font-size: 68px;
            }
            > span{
              margin-left: 10px;
              color: #fff;
            }
          }
          > span:nth-child(2){
            font-size: 34px;
            font-family:Adobe Heiti Std R;
            font-weight:normal;
            color: #fff;
          }
        }
        > div:nth-child(1){
          background: #0C70F8;
        }
        > div:nth-child(2){
          background: #00C4FC;
        }
        > div:nth-child(3){
          background: #8E62FF;
        }
        > div:nth-child(4){
          background: #00C888;
        }
      }
      .chart_bottom{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        flex-flow: row wrap;
        .chart_item{
          width: 50%;
          height: 3.78rem;
          margin: 0 0 .2rem .2rem;
          background: #fff;
          box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.statistics_select_list {
  display: none!important;
}
html {
  font-size: 100px;
}
@media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
@media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
@media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
@media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
@media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
</style>