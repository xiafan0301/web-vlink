<template>
  <vue-scroll>
    <div class="send-units">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/untreatEventDetail' }">事件详情</el-breadcrumb-item>
          <el-breadcrumb-item>转到其他单位</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
        <div class="units-box">
          <div class="units-content">
            <span>接收单位:</span>
            <el-select v-model="unitsName" placeholder="" size="small">
              <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn" :loading="isLoading" @click="submitData">确定提交</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail, updateEvent } from '@/views/index/api/api.event.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { operationType, handeMethods } from '@/utils/data.js';
import BigImg from '@/components/common/bigImg.vue';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      unitsName: null, // 转到其他单位
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [],
      basicInfo: {}, // 事件详情
      userInfo: {},
      departmentData: [], // 单位列表数据
      isLoading: false, // 提交加载中
    }
  },
  mounted () {
    this.userInfo =  this.$store.state.loginUser;
    this.getDetail();
    this.getList();
  },
  methods: {
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.eventId;
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            this.basicInfo = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取部门列表数据
    getList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.departmentData = res.data.list;
          }
        })
    },
    // 提交数据
    submitData () {
      if (this.unitsName) {
        this.isLoading = true;
        const params = {
          uid: this.$route.query.eventId,
          dealOrgId: this.unitsName,
          dealType: handeMethods.sendOtherUint,
          type: operationType.sendOtherUint
        };
        updateEvent(params)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '提交成功',
                customClass: 'request_tip'
              });
              this.isLoading = false;
              this.$router.push({name: 'event_manage'});
            } else {
              this.isLoading = false;
            }
          })
          .catch(() => { this.isLoading = false; })
      }
    },
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 图片放大传参
    emitHandleImg (isShow, index) {
      this.openBigImg(index, this.basicInfo.attachmentList);
    },
    // 关闭图片放大
    emitCloseImgDialog(data){
      this.imgList1 = [];
      this.isShowImg = data;
    },
    // 放大图片
    openBigImg (index, data) {
      this.isShowImg = true;
      this.imgIndex = index;
      this.imgList1 = JSON.parse(JSON.stringify(data));
    },
  }
}
</script>
<style lang="scss" scoped>
.send-units {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .units-box {
      width: 100%;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .units-content {
        width: 100%;
        padding: 20px;
        > span {
          margin-right: 10px;
          color: #666666;
        }
        .el-select {
          width: 40%;
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
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
}
</style>


