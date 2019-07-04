<template>
  <div class="ccrc">
    <div class="ccrc_breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>车辆侦查</el-breadcrumb-item>
          <el-breadcrumb-item>初次入城</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="ccrc_content">
      <div class="ccrc_content_left">
        <div class="kaishi">
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">开 始</span>
          <el-date-picker
              v-model="value1"
              value-format="timestamp"
              @change="hhh"
              style="width: 212px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="jiesu">
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">结 束</span>
          <el-date-picker
              v-model="value2"
              value-format="timestamp"
              style="width: 212px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="kakou">
          <el-select v-model="lll" placeholder="请选择" style="width: 230px"  popper-class="statistics_select_list" @click.native="showChange" multiple collapse-tags>
              <el-option
                  v-for="item in selectDeviceArr"
                  :key="item.uid"
                  :label="item.bayonetName"
                  :value="item.uid">
              </el-option>
          </el-select>
          <div class="search_item" v-show="isShowSelectList">
            <vue-scroll>
              <el-checkbox
                  :indeterminate="isIndeterminateBayonet"
                  v-model="checkAllTreeBayonet"
                  @change="handleCheckedAllBayonet"
              >全选</el-checkbox>
              <el-tree
                  @check="listenCheckedBayonet"
                  :data="bayonetTree"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  ref="bayonetTree"
                  highlight-current
                  :props="defaultProps">
              </el-tree>
            </vue-scroll>
          </div>
        </div>
        <div class="cpai">
          <span style="display: inline-block; width: 42px;color: #999999">车牌：</span>
          <el-checkbox v-model="unvehicleFlag"><span style="color: #999999">非</span></el-checkbox>
        </div>
        <div class="kakou">
          <el-input placeholder="请输入内容" v-model="vehicleNumber" class="input-with-select">
            <el-select v-model="v" slot="prepend" style="width: 62px;" class="selectet" :placeholder="null">
              <el-option
                  v-for="item in cityCode"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-input>
        </div>
        <div class="kakou">
          <el-button style="width: 110px" @click="reset">重置</el-button>
          <el-button type="primary" style="width: 110px" @click="tongji">统计</el-button>
        </div>
      </div>
      <div class="ccrc_content_right">
        <div class="ccrc_content_right_content">
          <div class="ccrc_content_right_table">
            <el-table
                :data="tableData"
                style="width: 100%">
              <el-table-column
                  type="index"
                  prop="date"
                  width="80px"
                  label="序号">
              </el-table-column>
              <el-table-column
                  prop="plateNo"
                  label="车牌号码">
              </el-table-column>
              <el-table-column
                  prop="deviceName"
                  label="卡口名称"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  prop="shotTime"
                  width="240"
                  label="抓拍时间">
              </el-table-column>
              <el-table-column
                  prop="vehicleColor"
                  label="车牌颜色"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  prop="address"
                  label="布控库"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  prop="vehicleClass"
                  label="车辆类型"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  label="操作">
                <template slot-scope="scope">
                  <span class="operation_btn">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
              class="cum_pagination"
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.pageNum"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="pagination.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapXupuxian } from "@/config/config";
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import { objDeepCopy, formatDate } from "@/utils/util.js";
import { JfoGETCity } from '../../../api/api.judge.js';
import { cityCode } from "@/utils/data.js";
export default {
  data () {
    return {
      v: '',
      lll: [],
      value1: '',
      value2: '',
      cityCode: [],
      bayonetTree: [],
      vehicleNumber: '',
      isIndeterminateBayonet: false,
      checkAllTreeBayonet: false,
      selectBayonetArr: [], // 选中的卡口数组
      selectVedioArr: [], // 选中的摄像头数组
      bayonetTreeNodeCount: 0, // 卡口节点数量
      selectDeviceArr: [], // 选中的设备数组
      unvehicleFlag: false,
      isShowSelectList: false,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      tableData: [],
      cities: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
    }
  },
  created () {
    this.JfoGETCity()
    this.cityCode = cityCode
    this.getMonitorList()
  },
  methods: {
    /**
     * 获取摄像头卡口信息列表
     */
    getMonitorList() {
      let params = {
        areaUid: mapXupuxian.adcode
      };
      MapGETmonitorList(params).then(res => {
        if (res && res.data) {
          let camera = objDeepCopy(res.data.areaTreeList);
          let bayonet = objDeepCopy(res.data.areaTreeList);
          this.videoTree = this.getTreeList(camera);
          this.bayonetTree = this.getBayTreeList(bayonet);
          this.getLeafCountTree(this.videoTree, 'camera');
          this.getLeafCountTree(this.bayonetTree, 'bayonet');
          // this.$refs.bayonetTree.setCheckedNodes(this.bayonetTree);
          // this.$refs.videotree.setCheckedNodes(this.videoTree);
        }
      });
    },
    /**
     * 获取摄像头数据
     */
    getTreeList(data) {
      for(let item of data) {
        item['id'] = item.areaId
        item['label'] = item.areaName
        if(item.deviceBasicList && item.deviceBasicList.length > 0) {
          item['children'] = item.deviceBasicList
          delete(item.deviceBasicList)
          for(let key of item['children']) {
            key['label'] = key.deviceName
            key['id'] = key.uid
            key['treeType'] = 1
          }
        }
      }
      return data;
    },
    /**
     * 获取卡口数据
     */
    getBayTreeList(data) {
      for(let item of data) {
        item['id'] = item.areaId
        item['label'] = item.areaName
        if(item.bayonetList && item.bayonetList.length > 0) {
          item['children'] = item.bayonetList
          delete(item.bayonetList)
          for(let key of item['children']) {
            key['label'] = key.bayonetName
            key['id'] = key.uid
            key['treeType'] = 2
          }
        }
      }
      return data;
    },
    /**
     * 摄像头树全选按钮点击
     */
    handleCheckedAllVideo(val) {
      this.isIndeterminate = false;
      if (val) {
        this.$refs.videotree.setCheckedNodes(this.videoTree);
      } else {
        this.$refs.videotree.setCheckedNodes([]);
      }
      this.selectVedioArr = this.$refs.videotree.getCheckedNodes(true);
      this.handleData();
    },
    /**
     * 处理摄像头树全选按钮
     */
    listenCheckedVideo(val, val1) {
      console.log(val)
      // console.log(val1)
      this.selectVedioArr = this.$refs.videotree.getCheckedNodes(true);
      this.handleData();
      if (val1.checkedNodes.length === this.videoTreeNodeCount) {
        this.isIndeterminate = false;
        this.checkAllTree = true;
      } else if (val1.checkedNodes.length < this.videoTreeNodeCount && val1.checkedNodes.length > 0) {
        this.checkAllTree = false;
        this.isIndeterminate = true;
      } else if (val1.checkedNodes.length === 0) {
        this.checkAllTree = false;
        this.isIndeterminate = false;
      }
    },
    /**
     * 卡口树全选按钮点击
     */
    handleCheckedAllBayonet(val) {
      this.isIndeterminateBayonet = false;
      if (val) {
        this.$refs.bayonetTree.setCheckedNodes(this.bayonetTree);
      } else {
        this.$refs.bayonetTree.setCheckedNodes([]);
      }
      this.selectBayonetArr = this.$refs.bayonetTree.getCheckedNodes(true);
      this.handleData();
    },
    /**
     * 处理卡口树全选按钮
     */
    listenCheckedBayonet(val, val1) {
      this.selectBayonetArr = this.$refs.bayonetTree.getCheckedNodes(true);
      this.handleData();
      if (val1.checkedNodes.length === this.bayonetTreeNodeCount) {
        this.isIndeterminateBayonet = false;
        this.checkAllTreeBayonet = true;
      } else if (val1.checkedNodes.length < this.bayonetTreeNodeCount && val1.checkedNodes.length > 0) {
        this.checkAllTreeBayonet = false;
        this.isIndeterminateBayonet = true;
      } else if (val1.checkedNodes.length === 0) {
        this.checkAllTreeBayonet = false;
        this.isIndeterminateBayonet = false;
      }
    },
    /**
     * 获取摄像头树节点的数量
     */
    getLeafCountTree(json, type) {
      // 获取树节点的数量
      for (let i = 0; i < json.length; i++) {
        if (json[i].hasOwnProperty("id")) {
          if (type === "camera") {
            this.videoTreeNodeCount++;
          } else {
            this.bayonetTreeNodeCount++;
          }
        }
        if (json[i].hasOwnProperty("children")) {
          this.getLeafCountTree(json[i].children, type);
        } else {
          continue;
        }
      }
    },
    /**
     * 获取卡口树节点的数量
     */
    getLeafCountTreeBayonet(json) {
      for (let i = 0; i < json.length; i++) {
        if (json[i].hasOwnProperty("id")) {
          this.bayonetTreeNodeCount++;
        }
        if (json[i].hasOwnProperty("children")) {
          this.getLeafCountTreeBayonet(json[i].children);
        } else {
          continue;
        }
      }
    },
    // 选中的设备数量处理
    handleData() {
      this.selectDeviceArr = [...this.selectVedioArr, ...this.selectBayonetArr].filter(key => key.treeType);
      this.lll = this.selectDeviceArr
      // console.log('选中的数据', this.selectDeviceArr);
    },
    oo () {
      console.log(this.selectDeviceArr)
    },
    tongji () {
      this.JfoGETCity()
      console.log(1)
    },
    reset () {
      this.value1 = '';
      this.value2 = '';
      this.unvehicleFlag = false
      this.v = ''
      this.vehicleNumber = ''
      this.lll = []
      this.selectDeviceArr = []
    },
    hhh (val) {
      console.log(val)
    },
    changeSeletedStatus (data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    showChange () {
      this.isShowSelectList = !this.isShowSelectList;
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.JfoGETCity()
    },
    JfoGETCity () {
      const params = {
        'where.startTime': this.value1,
        'where.endTime': this.value2,
        'where.unvehicleFlag': this.unvehicleFlag,
        'where.vehicleNumber': this.v + this.vehicleNumber,
        // 'where.eventType': eventType,
        // 'where.reporterUserRole': userName,
        // 'where.keyword': this.auditForm.phoneOrNumber,
        // 'where.eventSource': this.auditForm.eventSource,
        pageNum: this.pagination.pageNum,
        // orderBy: 'report_time',
        // order: 'asc'
      }
      let str = '';
      if (this.selectDeviceArr.length > 0) {
        for (let i = 0; i< this.selectDeviceArr.length; i++) {
          str = this.selectDeviceArr[i].uid + ',' +  str
        }
        params['where.bayonetUid'] = str.substr(0,str.length - 1)
      }
      JfoGETCity(params).then(res => {
        if (res) {
          this.tableData = res.data.list;
          this.pagination.total = res.data.total;
          console.log('llllllllllllllllllll', res)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .ccrc{
    height: 100%;
    .ccrc_breadcrumb{
      background-color: white;
      padding: 23px 20px;
      border-bottom: 2px solid #F7F9F9;
    }
    .ccrc_content{
      display: flex;
      height: calc(100% - 62px);
      .ccrc_content_left{
        height: 100%;
        background-color: white;
        width: 272px;
        padding: 20px;
        box-shadow: 5px 0 10px #E5E7E7;
        .jiesu{
          padding-top: 10px;
        }
        .kakou{
          padding-top: 10px;
          .search_item {
            height: 120px;
            width: 230px;
            padding-top: 10px;
            .select_tree {
              border: 1px solid #e4e7ed;
              border-radius: 4px;
              background-color: #fff;
              box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
              padding: 10px 0;
            }
          }
        }
        .cpai{
          padding-top: 20px;
        }
        .selectet{
          /deep/ .el-input__inner{
            background-color: white;
            border: 1px solid #DCDFE6;
            border-left: 0;
            border-right: 0;
          }
        }
      }
      .ccrc_content_right{
        height: 100%;
        background-color: #F7F9F9;
        width: calc(100% - 282px);
        margin-left: 10px;
        padding: 20px;
        overflow: auto;
        .ccrc_content_right_content{
          min-height: 100%;
          background-color: white;
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          padding: 20px;
          .cum_pagination{
            padding-right: 0;
          }
        }
      }
    }
    .operation_btn {
      color: #0C70F8;
      cursor: pointer;
    }
    .statistics_select_list{
      display: none !important;
    }
  }
</style>
<style lang="scss">
.statistics_select_list {
  display: none!important;
}
</style>