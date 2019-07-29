<template>
  <div class="bayonet_manage_detail">
    <div is="vlBreadcrumb" :breadcrumbData="[{name: '系统管理', routerName: 'manage'}, {name: '卡口管理', routerName: 'bayonet_manage'}, {name: '查看详情'}]"></div>
    <div class="detail_box">
      <div class="bayonet_info">
        <div>
          <h1>卡口名称卡口名称</h1>
          <p>创建于2019-4-17 10:00:00，最近更新于2019-4-22 9:00:00</p>
        </div>
        <i class="el-icon-platform-eleme"></i>
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
  </div>
</template>
<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
export default {
  components: {vlBreadcrumb},
  data () {
    return {
      // 摄像头信息参数
      cameraList: [{}],
      loading: false,
      delBayonetDialog: false,
      loadingBtn: false
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    // 查看监控
    toViewMonitor () {

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
  .detail_box{
    width: 100%;
    padding: 20px;
    background: #fff;
    overflow-y: auto;
    .bayonet_info{
      width: 100%;
      display: flex;
      justify-content: space-between;
      > div > h1{
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .basic_info, .camera_info{
      padding: 20px 0;
      > h1{
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: bold;
      }
      > ul{
        display: flex;
        justify-content: space-between;
        > li{
          line-height: 30px;
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
  }
}
</style>
