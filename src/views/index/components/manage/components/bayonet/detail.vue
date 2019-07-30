<template>
  <div class="bayonet_manage_detail">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ name: 'manage' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'bayonet_manage' }">卡口管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bayonet_info">
      <div><i class="vl_icon vl_icon_manage_19"></i><span>卡口名称卡口名称</span><span>在线</span></div>
      <p>创建于2019-4-17 10:00:00，最近更新于2019-4-22 9:00:00</p>
    </div>
    <div class="basic_info">
      <h1>基本信息</h1>
      <ul>
        <li>
          <div><span>卡口编码</span><span>kk201812209001</span></div>
          <div><span>IP地址</span><span>溆浦县卢峰镇XXXXXX号</span></div>
          <div><span>卡口地址</span><span>溆浦县卢峰镇XXXXXX号</span></div>
          <div><span>描述</span><span>溆浦县卢峰镇XXXXXX号</span></div>
        </li>
        <li>
          <div><span>卡口编号</span><span>21</span></div>
          <div><span>设备端口</span><span>车辆违章抓拍卡口</span></div>
          <div><span>管理车道数</span><span>车辆违章抓拍卡口</span></div>
        </li>
        <li>
          <div><span>所属机构</span><span>想县交通队</span></div>
          <div><span>卡口用途</span><span>无</span></div>
          <div><span>是否启用</span><span>无</span></div>
        </li>
        <li>
          <div><span>出入城卡口</span><span>经度120°；纬度50°</span></div>
          <div><span>经纬度</span><span>经度120°；纬度50°</span></div>
        </li>
      </ul>
    </div>
    <div class="camera_info">
      <h1>卡口设备</h1>
      <el-table
        v-loading="loading"
        :data="cameraList"
        >
        <el-table-column
          label="序号"
          show-overflow-tooltip
          :index="indexMethod"
          >
        </el-table-column>
        <el-table-column
          label="摄像头名称"
          prop="num"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="类型"
          :show-overflow-tooltip="true"
          >
        </el-table-column>
        <el-table-column
          label="智能特性"
          prop="time"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="厂家"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="拍摄方向"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="管理车道"
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
      <el-button class="btn_100" type="primary" @click="skipIsAdd(2)">编辑资料</el-button>
    </div>
    <el-dialog
      :visible.sync="delBayonetDialog"
      :close-on-click-modal="false"
      width="482px"
      top="40vh">
      <h4>是否确定删除该卡口及相关信息？</h4>
      <div slot="footer">
        <el-button @click="delBayonetDialog = false" class="btn_140">取消</el-button>
        <el-button :loading="loadingBtn" class="btn_140" type="primary">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="devDetailDialog"
      class="dev_detail_dialog"
      :close-on-click-modal="false"
      width="800px"
      height="430px"
      top="40vh"
      title="添加卡口设备">
      <ul>
        <li>
          <div><span>摄像头名称</span><span>摄像头1</span></div>
          <div><span>最大像素</span><span>摄像头1</span></div>
          <div><span>SIP编码</span><span>摄像头1</span></div>
          <div><span>服务端口</span><span>摄像头1</span></div>
        </li>
        <li>
          <div><span>摄像头类型</span><span>摄像头1</span></div>
          <div><span>拍摄方向</span><span>摄像头1</span></div>
          <div><span>视频接入编码</span><span>摄像头1</span></div>
          <div><span>用途</span><span>摄像头1</span></div>
        </li>
        <li>
          <div><span>厂商</span><span>摄像头1</span></div>
          <div><span>智能特性</span><span>摄像头1</span></div>
          <div><span>结构化设备编码</span><span>摄像头1</span></div>
        </li>
      </ul>
      <vue-scroll>
        <div style="height: 214px;">
          <ul v-for="item in '1234'" :key="item.id" class="driving_info">
            <li>
              <div><span>车道号</span><span>xxxxx</span></div>
              <div><span>大车最高限速</span><span>xxxxx</span></div>
            </li>
            <li>
              <div><span>行车方向</span><span>xxxxx</span></div>
              <div><span>小车最低限速</span><span>xxxxx</span></div>
            </li>
            <li>
              <div><span>大车最低限速</span><span>xxxxx</span></div>
              <div><span>小车最高限速</span><span>xxxxx</span></div>
            </li>
          </ul>
        </div>
      </vue-scroll>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 摄像头信息参数
      cameraList: [{}],
      loading: false,
      delBayonetDialog: false,
      loadingBtn: false,
      devDetailDialog: false,
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    // 查看监控
    toViewMonitor () {
      this.devDetailDialog = true;
    },
    // 删除卡口
    deleteBayonet () {
      this.delBayonetDialog = true;
    },
    // 跳转至列表页
    skipIsList () {
      this.$router.push({name: 'bayonet_manage_list'});
    },
    // 跳转至编辑页
    skipIsAdd (type) {
      this.$router.push({name: 'bayonet_manage_add', query: {type}});
    },
  }
}
</script>
<style lang="scss" scoped>
.bayonet_manage_detail{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
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
      }
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
