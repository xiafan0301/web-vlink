<template>
  <div class="camera_detail">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ name: 'camera_manage' }">摄像头管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="camera_name_info">
        <div class="top">
          <i class="vl_icon vl_icon_event_4"></i>
          <span class="name">{{detailInfo.deviceName}}</span>
          <span class="status" :class="[detailInfo.deviceStatusStr === '正常' ? 'online-status' : 'offline-status']" v-show="detailInfo.deviceStatusStr">{{detailInfo.deviceStatusStr}}</span>
        </div>
        <p class="create_time">创建于{{detailInfo.createTime}}，最近更新于{{detailInfo.updateTime}}</p>
      </div>
      <div class="basic_info">
        <p class="title_p">基本信息</p>
        <ul class="basic_info_ul">
          <li :title="detailInfo.code">
            <span>摄像头编码：</span>
            <span>{{detailInfo.code ? detailInfo.code : '无'}}</span>
          </li>
          <li>
            <span>所属机构：</span>
            <span>{{detailInfo.dutyUnitName ? detailInfo.dutyUnitName : '无'}}</span>
          </li>
          <li :title="detailInfo.deviceSeq">
            <span>摄像头编号：</span>
            <span>{{detailInfo.deviceSeq ? detailInfo.deviceSeq : '无'}}</span>
          </li>
          <li :title="detailInfo.typeStr">
            <span>摄像头类型：</span>
            <span>{{detailInfo.typeStr ? detailInfo.typeStr : '无'}}</span>
          </li>
          <li>
            <span>厂商：</span>
            <span>{{detailInfo.manufacturerStr ? detailInfo.manufacturerStr : '无'}}</span>
          </li>
          <li :title="detailInfo.deviceSn">
            <span>摄像头序列号：</span>
            <span>{{detailInfo.deviceSn ? detailInfo.deviceSn : '无'}}</span>
          </li>
          <li>
            <span>最大像素：</span>
            <span>{{detailInfo.maxPixelStr ? detailInfo.maxPixelStr : '无'}}</span>
          </li>
          <li :title="detailInfo.intelligentCharac">
            <span>智能特性：</span>
            <span>{{detailInfo.intelligentCharac ? detailInfo.intelligentCharac : '无'}}</span>
          </li>
          <li>
            <span>拍摄方向：</span>
            <span>{{detailInfo.filmDirection ? detailInfo.filmDirection : '无'}}</span>
          </li>
          <li>
            <span>是否启用：</span>
            <span>{{detailInfo.isActive === 1 ? '启用' : '调试'}}</span>
          </li>
        </ul>
      </div>
      <div class="online_info">
        <p class="title_p">联网信息</p>
        <ul class="online_info_ul">
          <li :title="detailInfo.deviceSip">
            <span>SIP编号：</span>
            <span>{{detailInfo.deviceSip ? detailInfo.deviceSip : '无'}}</span>
          </li>
          <li :title="detailInfo.deviceCode">
            <span>视频接入编码：</span>
            <span>{{detailInfo.deviceCode ? detailInfo.deviceCode : '无'}}</span>
          </li>
          <li :title="detailInfo.viewClassCode">
            <span>结构化设备编码：</span>
            <span>{{detailInfo.viewClassCode ? detailInfo.viewClassCode : '无'}}</span>
          </li>
          <li :title="detailInfo.ipAddress">
            <span>IP：</span>
            <span>{{detailInfo.ipAddress ? detailInfo.ipAddress : '无'}}</span>
          </li>
          <li>
            <span>重要级别：</span>
            <span>{{detailInfo.importantLevelStr ? detailInfo.importantLevelStr : '无'}}</span>
          </li>
          <li>
            <span>经纬度：</span>
            <span>{{detailInfo.longitude}},{{detailInfo.latitude}}</span>
          </li>
          <!-- <li>
            <span>经纬度：</span>
            <span>经度{{detailInfo.longitude}},纬度{{detailInfo.latitude}}</span>
          </li> -->
          <li class="position" :title="detailInfo.address">
            <span>所在位置：</span>
            <span>{{detailInfo.address ? detailInfo.address : '无'}}</span>
          </li>
          <li>
            <span>账户名：</span>
            <span>{{detailInfo.account ? detailInfo.account : '无'}}</span>
          </li>
          <li>
            <span>密码：</span>
            <span>{{detailInfo.password ? detailInfo.password : '无'}}</span>
          </li>
           <li>
            <span>RTSP端口：</span>
            <span>{{detailInfo.rtspPort ? detailInfo.rtspPort : '无'}}</span>
          </li>
          
          <!-- <li class="position">
            <span>视频接入编码：</span>
            <span>{{detailInfo.deviceCode}}</span>
          </li> -->
        </ul>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn" type="primary" @click="skipAddCameraPage">编辑资料</el-button>
      <el-button class="operation_btn" type="primary" @click="selectMonitor">查看监控</el-button>
      <el-button class="operation_btn" @click="showDeleteDialog">删除</el-button>
      <el-button class="operation_btn" @click="back">返回</el-button>
    </div>
    <!--删除摄像头弹出框-->
    <el-dialog
      title="是否确定删除该摄像头信息?"
      :visible.sync="delCameraDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <!-- <span style="color: #999999;">删除后数据不可恢复。</span> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="delCameraDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteCamera">确认</el-button>
      </div>
    </el-dialog>
    <div class="video_box" v-if="isShowMonitor">
      <div is="flvplayer" class="vl_map_video_box" @playerClose="playerClose" :oData="oData" :showFullScreen="true"></div>
    </div>
  </div>
</template>
<script>
import flvplayer from '@/components/common/flvplayer.vue';
import { getDepartmentList} from '@/views/index/api/api.manage.js';
import { delDevice, getDeviceDetailById } from '@/views/index/api/api.base.js';
export default {
  components: { flvplayer },
  data () {
    return {
      oData: null,
      bResize: null,
      isShowMonitor: false,
      isDeleteLoading: false,
      delCameraDialog: false, // 删除摄像头弹出框
      detailInfo: {}, // 摄像头详情
      departmentList: [],
      userInfo: {}
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
    this.getDepartList();
  },
  mounted () {
    setTimeout(() => {
      this.getDetail();
    }, 1000)
  },
  methods: {
    // 获取所有的机构单位
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.departmentList = res.data.list;
          }
        })
    },
    // 获取摄像头详情
    getDetail () {
      const id = this.$route.query.id;
      if (id) {
        getDeviceDetailById({id})
          .then(res => {
            if (res && res.data) {
              this.detailInfo = res.data;
              this.departmentList.map(item => {
                if (item.uid == this.detailInfo.dutyUnitId) {
                  this.detailInfo.dutyUnitName = item.organName;
                }
              });
              const obj = {
                type: 1, // 直播
                title: this.detailInfo.deviceName,
                video: {
                  uid: this.detailInfo.uid
                }
              };
              this.oData = obj;
            }
          })
      }
    },
    // 跳至编辑资料页面
    skipAddCameraPage () {
      this.$router.push({name: 'add_camera', query: { id: this.$route.query.id }});
    },
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 显示删除弹出框
    showDeleteDialog (obj) {
      this.delCameraDialog = true;
    },
    // 删除摄像头
    deleteCamera () {
      const id = this.$route.query.id;
      if (id) {
        this.isDeleteLoading = true;
        delDevice(id)
          .then(res => {
            if (res && res.data) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              });
              this.delCameraDialog = false;
              this.isDeleteLoading = false;
              this.$router.push({name: 'camera_manage'});
            } else {
              this.isDeleteLoading = false;
            }
          })
          .catch(() => {this.isDeleteLoading = false;})
      }
    },
    // 查看监控
    selectMonitor () {
      this.isShowMonitor = true;
    },
    playerClose () {
      this.isShowMonitor = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.camera_detail {
  height: 100%;
  .content_box {
    width: 98%;
    height: 100%;
    margin: 0 20px 100px 20px;
    padding-bottom: 5px;
    .camera_name_info, .basic_info, .online_info {
      background-color: #ffffff;
      box-shadow: 5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      margin-bottom: 10px;
      padding-bottom: 10px;
      .top {
        padding: 10px 20px;
        display: flex;
        align-items: center;
        .name {
          font-size: 20px;
          color: #333333;
          font-weight: bold;
          margin: 0 20px 0 10px;
        }
        .status {
          display: inline-block;
          width:48px;
          border-radius:11px;
          font-size: 12px;
          text-align: center;
          padding: 3px 0;
        }
        .online-status {
          background-color: #E2EEFF;
          color: #0C70F8;
        }
        .offline-status {
          color: #FA4439;
          background-color: #FFE5E5;
        }
      }
      .create_time {
        color: #666666;
        // margin-top: 10px;
        padding-bottom: 10px;
        margin-left: 35px;
      }
      .title_p {
        font-size: 16px;
        color: #333333;
        font-weight: bold;
        height: 55px;
        line-height: 55px;
        padding: 0 20px;
        border-bottom: 1px solid #F2F2F2;
      }
      .basic_info_ul, .online_info_ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        >li {
          width: 25%;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span:first-child {
            min-width: 100px;
            text-align: right;
            display: inline-block;
            color: #666666;
          }
          span:last-child {
            color: #333333;
          }
        }
        .position {
          width: 50%;
        }
      }
    }
  }
  .operation-footer {
    border-left: 1px solid #F2F2F2;
    width: 100%;
    height: 65px;
    line-height: 65px;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    padding-left: 20px;
    z-index: 1;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      cursor: pointer;
      text-align: center;
    }
  }
}
.video_box {
  position: fixed;
  left:0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
}
.vl_map_video_box {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
.monitor_dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>

