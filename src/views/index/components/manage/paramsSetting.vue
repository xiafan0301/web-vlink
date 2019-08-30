<template>
  <div class="params_setting">
    <div class="content_box">
      <div class="title">
        <span>落脚点分析阀值：</span>
        <span>若是相邻两次抓拍的设备距离和抓拍时间间隔满足以下两个条件，则将其中一个抓拍点设为落脚点</span>
      </div>
      <div class="input_box">
        <span class="input_box_title">{{distanceTitle}}</span>
        <el-input v-model="distanceVal" maxlength="6" style="width: 200px;margin:0 8px" :disabled="!isEdit"></el-input>
        <span class="input_box_title">米</span>
      </div>
      <div class="input_box">
        <span class="input_box_title">{{stopTimeTitle}}</span>
        <el-input v-model="stopTimeVal" maxlength="6" style="width: 200px;margin:0 8px" :disabled="!isEdit"></el-input>
        <span class="input_box_title">分钟</span>
      </div>
      <!-- <div class="title">
        <span>人像检索默认阀值：</span>
        <span>人像检索应用中涉及人像比对功能中，两个人脸信息对比可视为同一人的相似度最低阈值</span>
      </div>
      <div class="input_box">
        <span class="input_box_title">{{personTitle}}</span>
        <el-input v-model="personSearchVal" style="width: 200px;margin:0 8px" :disabled="!isEdit"></el-input>
        <span class="input_box_title">%</span>
      </div> -->
    </div>
    <div class="operation-footer">
      <template v-if="isEdit === false">
        <el-button class="operation_btn" type="primary" @click="isEdit = true">修改</el-button>
      </template>
      <template v-if="isEdit === true">
        <el-button class="operation_btn" type="primary" @click="submitData">确定</el-button>
        <el-button class="operation_btn" @click="cancelEdit">取消</el-button>
      </template>
    </div>
  </div>
</template>
<script>
import { setLjdDistanceAndTime, getLjdDistanceAndTime } from '@/views/index/api/api.judge.js';
export default {
  data () {
    return {
      isEdit: false, // 是否修改
      stopTimeTitle: '落脚点停留时间 >',
      distanceTitle: '落脚点分析距离 <',
      personTitle: '人像默认相似度 >',
      distanceVal: null,
      stopTimeVal: null,
      initDistance: null,
      initStopTime: null,
      personSearchVal: null, 
    }
  },
  created () {
    this.getDistanceAndTime();
  },
  methods: {
    // 获取落脚点分析距离和停留时间
    getDistanceAndTime () {
      getLjdDistanceAndTime()
        .then(res => {
          if (res && res.data) {
            this.distanceVal = res.data.distance;
            this.initDistance = res.data.distance;

            this.stopTimeVal = res.data.minutes;
            this.initStopTime = res.data.minutes;
          }
        })
    },
    // 取消编辑
    cancelEdit () {
      this.isEdit = false;
      this.stopTimeVal = this.initStopTime;
      this.initDistance = this.distanceVal;
    },
    // 确认编辑
    submitData () {
      const reg = /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{1}$)/;
      if (!reg.test(this.stopTimeVal) || !reg.test(this.distanceVal)) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('只能输入数字，且只能输入一位小数');
        }
        return;
      }
      if (this.stopTimeVal !== this.initStopTime || this.distanceVal !== this.initDistance) {
        const params = {
          minutes : this.stopTimeVal,
          distance: this.distanceVal
        };
        setLjdDistanceAndTime(params)
          .then(res => {
            if (res && res.code === '00000000') {
              this.$message({
                type: 'success',
                message: '修改成功',
                customClass: 'request_tip'
              });
              this.getDistanceAndTime();
              this.isEdit = false;
            }
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.params_setting {
  height: 100%;
  .content_box {
    height: calc(100% - 120px);
    width: 98%;
    background-color: #ffffff;
    margin: 20px;
    padding: 20px;
    .title {
      color: #333333;
      span:first-child {
        font-weight: bold;
      }
    }
    .input_box {
      margin: 20px 0;
      display: flex;
      align-items: center;
      .input_box_title {
        color: #666666;
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
      text-align: center;
    }
  }
}
</style>

