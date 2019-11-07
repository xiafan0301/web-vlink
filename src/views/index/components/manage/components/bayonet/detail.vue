<template>
  <div class="bayonet_manage_detail">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ name: 'manage' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'bayonet_manage' }">卡口管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="bayonet_info">
        <div><i class="vl_icon vl_icon_manage_19"></i><span>{{bayonetDetail.bayonetName}}</span><span>{{bayonetDetail.onlineState ? '在线' : '离线'}}</span></div>
        <p>创建于{{bayonetDetail.createTime}}，最近更新于{{bayonetDetail.updateTime}}</p>
      </div>
      <div class="basic_info">
        <h1>基本信息</h1>
        <ul>
          <li>
            <div><span>卡口编码</span><span>{{bayonetDetail.bayonetCode || '无'}}</span></div>
            <div><span>卡口IP</span><span>{{bayonetDetail.ipAddress || '无'}}</span></div>
            <div><span>管理车道数</span><span>{{bayonetDetail.laneNum || '无'}}</span></div>
          </li>
          <li>
            <div><span>卡口编号</span><span>{{bayonetDetail.bayonetNo || '无'}}</span></div>
            <div><span>卡口用途</span><span :title="transcodingUse(bayonetDetail.use, 1)">{{transcodingUse(bayonetDetail.use)}}</span></div>
            <div><span>是否启用</span><span>{{bayonetDetail.isEnabled ? '启用' : '停用'}}</span></div>
          </li>
          <li>
            <div><span>所属机构</span><span>{{bayonetDetail.dutyUnitName || '无'}}</span></div>
            <div><span>经纬度</span><span>{{bayonetDetail.longitude}}，{{bayonetDetail.latitude}}</span></div>
          </li>
          <li>
            <div><span>出入城卡口</span><span>{{bayonetDetail.isEnterPoint === 1 ? '入城卡口' : bayonetDetail.isEnterPoint === 2 ? '出城卡口' : bayonetDetail.isEnterPoint === 3 ? '其他' : ''}}</span></div>
            <div><span>卡口地址</span><span :title="bayonetDetail.bayonetAddress">{{bayonetDetail.bayonetAddress | strCutWithLen(30)}}</span></div>
          </li> 
        </ul>
        <div><span>描述</span><span>{{bayonetDetail.desci || '无'}}</span></div>
      </div>
      <div class="camera_info">
        <h1>卡口设备</h1>
        <el-table
          v-loading="loading"
          :data="bayonetDetail.bayonetDevInfoDtoList"
          >
          <el-table-column
            label="序号"
            type="index"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="摄像头名称"
            prop="deviceName"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="类型"
            prop="type"
            :show-overflow-tooltip="true"
            >
            <template slot-scope="scope">
              {{dicFormater(datalist.cameraType, String(scope.row.type))}}
            </template>
          </el-table-column>
          <el-table-column
            label="智能特性"
            prop="intelligentCharacs"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              {{scope.row.intelligentCharacs && scope.row.intelligentCharacs.split(',').map(m => dicFormater(datalist.intelCharac, String(m))).join(',')}}
            </template>
          </el-table-column>
          <el-table-column
            label="厂家"
            prop="manufacturer"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              {{dicFormater(datalist.manufacturer, String(scope.row.manufacturer))}}
            </template>
          </el-table-column>
          <el-table-column
            label="拍摄方向"
            prop="filmDirection"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="管理车道"
            prop="lanes"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="operation_btn" @click="toViewMonitor(scope.row)">查看</span>
            </template>
          </el-table-column>
          <div class="not_content" slot="empty">
            <img src="../../../../../../assets/img/not-content.png" alt="">
            <p>暂无相关数据</p>
          </div>
        </el-table>
      </div>
      <div class="operate_btn">
        <el-button class="reset_btn" @click="skipIsList">返回</el-button>
        <el-button class="reset_btn" @click="deleteBayonet">删除</el-button>
        <el-button class="btn_100" type="primary" @click="skipIsAdd()">编辑资料</el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="delBayonetDialog"
      :close-on-click-modal="false"
      width="482px"
      top="40vh">
      <h4>是否确定删除该卡口及相关信息？</h4>
      <div slot="footer">
        <el-button @click="delBayonetDialog = false" class="btn_140">取消</el-button>
        <el-button :loading="loadingBtn" class="btn_140" type="primary" @click="submitDelBayonet">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="devDetailDialog"
      :visible.sync="devDetailDialog"
      class="dev_detail_dialog"
      :close-on-click-modal="false"
      width="800px"
      height="430px"
      top="40vh"
      title="设备详情">
      <ul>
        <li>
          <div><span>摄像头名称</span><span>{{devDetail.deviceName || '无'}}</span></div>
          <div><span>最大像素</span><span>{{dicFormater(datalist.maxPixel, String(devDetail.maxPixel)) || '无'}}</span></div>
          <div><span>SIP编码</span><span>{{devDetail.deviceSip || '无'}}</span></div>
          <div><span>服务端口</span><span>{{devDetail.servicePort || '无'}}</span></div>
        </li>
        <li>
          <div><span>摄像头类型</span><span>{{dicFormater(datalist.cameraType, String(devDetail.type)) || '无'}}</span></div>
          <div><span>拍摄方向</span><span>{{devDetail.filmDirection || '无'}}</span></div>
          <div><span>视频接入编码</span><span>{{devDetail.deviceCode || '无'}}</span></div>
          <div><span>用途</span><span>{{devDetail.deviceUse === 1 ? '抓拍摄像头' : devDetail.deviceUse === 2 ? '全景摄像头' : '无'}}</span></div>
        </li>
        <li>
          <div><span>厂商</span><span>{{dicFormater(datalist.manufacturer, String(devDetail.manufacturer)) || '无'}}</span></div>
          <div><span>智能特性</span><span :title="transcodingIntelCharac(devDetail.intelligentCharacs, 1)">{{transcodingIntelCharac(devDetail.intelligentCharacs)}}</span></div>
          <div><span>结构化设备编码</span><span>{{devDetail.viewClassCode || '无'}}</span></div>
        </li>
      </ul>
      <vue-scroll>
        <div style="height: 214px;">
          <ul v-for="item in devDetail.cameraLaneRelList" :key="item.uid" class="driving_info">
            <li>
              <div><span>车道号</span><span>{{item.laneNo || '无'}}</span></div>
              <div><span>大车最高限速</span><span>{{item.bigMaxSpeed || '无'}}</span></div>
            </li>
            <li>
              <div><span>行车方向</span><span>{{transcodingDirection(item.direction)}}</span></div>
              <div><span>小车最低限速</span><span>{{item.smallMinSpeed || '无'}}</span></div>
            </li>
            <li>
              <div><span>大车最低限速</span><span>{{item.bigMinSpeed || '无'}}</span></div>
              <div><span>小车最高限速</span><span>{{item.smallMaxSpeed || '无'}}</span></div>
            </li>
          </ul>
        </div>
      </vue-scroll>
    </el-dialog>
  </div>
</template>
<script>
import {getBayonetDetail, delBayonet} from '@/views/index/api/api.base.js';
import {bayonetDetail} from '../../../control/testData.js';
import {dataList} from '@/utils/data.js';
export default {
  data () {
    return {
      // 摄像头信息参数
      loading: false,
      delBayonetDialog: false,
      loadingBtn: false,
      devDetailDialog: false,
      bayonetId: null,
      bayonetDetail: bayonetDetail,
      datalist: dataList,
    }
  },
  mounted () {
    this.bayonetId = this.$route.query.bayonetId;
    this.getBayonetDetail();
  },
  methods: {
    transcodingUse (use, type) {
      if (!use) return '无';
      let list = ['人脸抓拍', '车辆抓拍', '全结构化', '其他用途'];
      let str = '';
      let data = use.split(',');
      data.forEach((f, i) => {
        if (i === data.length - 1) {
          str += list[f - 1];
        } else {
          str += list[f - 1] + ',';
        }
      })
      if (type) return str;
      return this.strCutWithLen(str, 30);
    },
    transcodingDirection (type) { 
      let list = ['直行', '左转', '右转', '调头'];
      return list[type - 1];
    },
    transcodingIntelCharac (data, type) {
      if (!data) return '无';
      const str = data.split(',').map(m => this.dicFormater(this.datalist.intelCharac, String(m))).join(',');
      if (type) return str;
      return this.strCutWithLen(str, 25);
    },
    // 获取卡口详情
    getBayonetDetail () {
      getBayonetDetail({id: this.bayonetId}).then(res => {
        if (res) {
          this.bayonetDetail = res.data;
        }
      })
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    // 查看设备
    toViewMonitor (data) {
      this.devDetail = data;
      this.devDetailDialog = true;
    },
    // 删除卡口
    deleteBayonet () {
      this.delBayonetDialog = true;
    },
    // 删除卡口
    submitDelBayonet () {
      this.loadingBtn = true;
      delBayonet({id: this.bayonetId}).then(res => {
        if (res) {
          this.$message.success('删除成功');
          this.delBayonetDialog = false;
          this.$router.push({name: 'bayonet_manage_list'});
        }
      }).finally(() => {
        this.loadingBtn = false;
      })
    },
    // 跳转至列表页
    skipIsList () {
      this.$router.push({name: 'bayonet_manage_list'});
    },
    // 跳转至编辑页
    skipIsAdd () {
      this.$router.push({name: 'bayonet_manage_add', query: {type: 2, bayonetId: this.bayonetId}});
    },
  }
}
</script>
<style lang="scss" scoped>
.bayonet_manage_detail{
  width: 100%;
  height: 100%;
  position: relative;
  @mixin text_alignment{
    position: relative;
    > span:nth-child(1){
      position: absolute;
      width: 70px;
      text-align: right;
      color: #666;
    }
    > span:after{
      display: inline-block;
      content: '';
      width: 100%;
      height: 0;
    }
    > span:before{
      position: absolute;
      left: 70px;
      content: '\FF1A';
    }
    > span:nth-child(2){
      padding-left: 84px;
      color: #333;
    }
  }
  .content_box{
    width: 100%;
    height: calc(100% - 128px);
    overflow-y: auto;
    .bayonet_info, .basic_info, .camera_info{
      margin: 0 20px 10px;
      background:rgba(255,255,255,1);
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      > h1{
        height: 54px;
        line-height: 54px;
        border-bottom: 1px solid #F2F2F2;
        padding: 0 20px;
        color: #333333;
        font-weight: bold;
        font-size: 16px;
      }
    }
    .bayonet_info{
      padding: 20px;
      > div{
        > i{
          vertical-align: bottom;
          margin-right: 10px;
        }
        > span:nth-child(2){
          margin-right: 20px;
          color: #333333;
          font-size: 20px;
          font-weight: bold;
        }
        > span:nth-child(3){
          display: inline-block;
          width:48px;
          height:22px;
          text-align: center;
          line-height: 22px;
          background:rgba(226,238,255,1);
          border-radius:11px;
          color: #0C70F8;
          font-size: 12px;
        }
      }
      > p{
        padding-top: 10px;
        color: #666666;
      }
    }
    .basic_info{
      > ul{
        display: flex;
        justify-content: space-between;
        padding: 20px 20px 0;
        > li{
          width: 25%;
          > div{
            @include text_alignment;
          }
        }
      }
      > div{
        display: flex;
        padding: 0 20px;
        @include text_alignment;
      }
    }
    .camera_info{
      .el-table{
        padding: 20px;
        .operation_btn{
          color: #0C70F8;
          cursor: pointer;
        }
      }
    }
  }
  .operate_btn{
    width: 100%;
    height: 65px;
    line-height: 65px;
    padding: 0 10px;
    border-top: 1px solid #e6e6e6;
    background: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 999;
  }
  .dev_detail_dialog{
    ul{
      display: flex;
      justify-content: space-between;
      padding: 20px 20px 0;
      > li{
        width: 33.33%;
        > div{
          position: relative;
          > span:nth-child(1){
            position: absolute;
            width: 98px;
            text-align: right;
            color: #666;
          }
          > span:after{
            display: inline-block;
            content: '';
            width: 100%;
            height: 0;
          }
          > span:before{
            position: absolute;
            left: 98px;
            content: '\FF1A';
          }
          > span:nth-child(2){
            padding-left: 110px;
            color: #333;
          }
        }
      }
    }
    .driving_info{
      background:rgba(250,250,250,1);
      border-radius:2px;
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
}
</style>
