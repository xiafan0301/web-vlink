<template>
  <div class="ccrc">
    <div class="ccrc_breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/vehicle/menu' }"><span style="color: #999999">车辆侦查</span></el-breadcrumb-item>
          <el-breadcrumb-item>初次入城</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="ccrc_content">
      <div class="ccrc_content_left">
        <div class="kaishi">
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">开 始</span>
          <el-date-picker
              v-model="value1"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              style="width: 212px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="jiesu">
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">结 束</span>
          <el-date-picker
              v-model="value2"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions1"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 212px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="kakou">
          <el-select v-model="lll" placeholder="请选择卡口" style="width: 230px" multiple collapse-tags>
              <el-option
                  v-for="item in kakou"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.uid">
              </el-option>
          </el-select>
<!--          <div class="search_item" v-show="isShowSelectList">-->
<!--            <vue-scroll>-->
<!--              <el-checkbox-->
<!--                  :indeterminate="isIndeterminateBayonet"-->
<!--                  v-model="checkAllTreeBayonet"-->
<!--                  @change="handleCheckedAllBayonet"-->
<!--              >全选</el-checkbox>-->
<!--              <el-tree-->
<!--                  @check="listenCheckedBayonet"-->
<!--                  :data="bayonetTree"-->
<!--                  show-checkbox-->
<!--                  default-expand-all-->
<!--                  node-key="id"-->
<!--                  ref="bayonetTree"-->
<!--                  highlight-current-->
<!--                  :props="defaultProps">-->
<!--              </el-tree>-->
<!--            </vue-scroll>-->
<!--          </div>-->
        </div>
        <div class="cpai">
          <span style="display: inline-block; width: 42px;color: #999999">车牌：</span>
          <el-checkbox v-model="unvehicleFlag" style="float: right; margin-right: 3px"><span style="color: #999999;">排除</span></el-checkbox>
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
        <div style="padding-top: 10px">
          <el-checkbox v-model="onlySurveillance"><span style="color: #999999">只查看布控库内车辆</span></el-checkbox>
        </div>
        <div class="kakou">
          <el-button style="width: 110px" @click="reset">重置</el-button>
          <el-button type="primary" style="width: 110px" @click="tongji" :loading="searchLoading">查询</el-button>
        </div>
      </div>
      <div class="ccrc_content_right">
        <div class="ccrc_content_right_content">
          <div class="ccrc_content_right_table" v-loading = "searchLoading">
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
                  prop="bayonetName"
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
                  prop="isSurveillance"
                  label="布控库"
                  show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.isSurveillance">是</span>
                  <span v-else>否</span>
                </template>
              </el-table-column>
              <el-table-column
                  prop="vehicleClass"
                  label="车辆类型"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  label="操作">
                <template slot-scope="scope">
                  <span class="operation_btn" @click="see(scope.row)">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
              class="cum_pagination"
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.pageNum"
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
      pickerOptions: {
        disabledDate: time => {
          if (this.value2) {
            return (
              time.getTime() > new Date(this.value2).getTime() ||
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90
            );
          } else {
            return (
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90 ||
              time.getTime() > new Date().getTime()
            );
          }
        }
          // return  time.getTime() < new Date(new Date().getTime() - 90*86400000) || time.getTime() > new Date(new Date().getTime())
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.value1) {
            return (
              time.getTime() < new Date(this.value1).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return (
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 30 ||
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      searchLoading: false,
      kakou: [],
      v: '湘',
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
      onlySurveillance: false,
      isShowSelectList: false,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      tableData: [],
      tableDataAll: [],
      cities: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
    }
  },
  created () {
    this.setDTime();
    this.cityCode = cityCode
  },
  mounted() {
    this.getMonitorList()
    this.setDTime();
  },
  methods: {
    changval1 (val) {
      let time = val.replace(/-/g, '/');
      let time1 = new Date(time)
      let time2 = time1.getTime()
      this.value2 = formatDate(time2 + 24*60*60*1000)
    },
    setDTime () {
      let _s = formatDate(new Date(new Date().getTime() - 86400000));
      let _e = formatDate(Date.now())
      // let _e = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " 00:00:00";
      // let _e = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " 23:59:59";
      // this.ruleForm.data1 = [_s, _e];
      this.value1 = _s
      this.value2 = _e
    },
    /**
     * 获取摄像头卡口信息列表
     */
    getMonitorList() {
      let params = {
        areaUid: mapXupuxian.adcode
      };
      MapGETmonitorList(params).then(res => {
        if (res && res.data) {
          console.log('原始数据', res.data)
          let camera = objDeepCopy(res.data.areaTreeList);
          let bayonet = objDeepCopy(res.data.areaTreeList);
          this.kakou = this.getTreeList1(bayonet)
          this.lll = this.kakou.map((item)=> {
            return item.uid
          })
          this.videoTree = this.getTreeList(camera);
          this.getLeafCountTree(this.videoTree, 'camera');
          this.getLeafCountTree(this.bayonetTree, 'bayonet');
          this.JfoGETCity()

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
    getTreeList1(data) {
      let arr = []
      for(let item of data) {
        if(item.bayonetList && item.bayonetList.length > 0) {
          for(let key of item['bayonetList']) {
            arr.push({label: key.bayonetName, uid: key.uid})
          }
        }
      }
      return arr;
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
    },
    oo () {
      console.log(this.selectDeviceArr)
    },
    tongji () {
      this.JfoGETCity()
      console.log(1)
    },
    reset () {
      this.setDTime();
      this.unvehicleFlag = false
      this.v = '湘'
      this.vehicleNumber = ''
      this.lll = []
      this.onlySurveillance = false
      this.getMonitorList()
    },
    see (item) {
      this.$router.push({name: 'vehicle_search_clxx', query: {plateNo: item.plateNo}});
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
      /* this.pagination.pageNum = page;
      this.JfoGETCity() */
      this.pagination.pageNum = page;
      let ips = (this.pagination.pageNum - 1) * this.pagination.pageSize;
      let ipe = ips + this.pagination.pageSize;
      if (ipe > this.pagination.total) { ipe = this.pagination.total; }
      this.tableData = this.tableDataAll.slice(ips, ipe);
    },
    JfoGETCity () {
      this.searchLoading = true;
      const params = {
        startTime: this.value1,
        endTime: this.value2,
        unvehicleFlag: this.unvehicleFlag,
        onlySurveillance: this.onlySurveillance,
        vehicleNumber: this.v
      }
      if (this.lll&& this.lll.length > 0) {
        params['bayonetUid'] = this.lll.join(',')
      }
      if (this.vehicleNumber) {
        params.vehicleNumber = this.v + this.vehicleNumber
      }
      JfoGETCity(params).then(res => {
        if (res.data == null) {
          this.tableData = []
          this.pagination.total = 0
        }
        if (res && res.data) {
          // this.tableData = res.data;
          this.pagination.pageNum = 1;
          this.tableDataAll = res.data;
          this.pagination.total = this.tableDataAll.length;
          this.handleCurrentChange(1);
        }
        this.searchLoading = false;
      }).catch(error => {
        console.log(error );
        this.searchLoading = false;
      });
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
</style>