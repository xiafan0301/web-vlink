<template>
  <vue-scroll>
    <div class="report-detail">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail' }">事件详情</el-breadcrumb-item>
          <el-breadcrumb-item>查看上级呈报</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic :status="$route.query.status"></EventBasic>
        <div class="report-content">
          <div class="header">
            <p class="ctc-title">上级指示</p>
          </div>
          <div class="divide"></div>
          <ul class="report-list">
            <li>
              <div>
                <span>wang东东</span>
                <span>2018-11-21 17:15</span>
              </div>
              <div>
                增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决
              </div>
            </li>
            <div class="content-divide"></div>
            <li>
              <div>
                <span>wang东东</span>
                <span>2018-11-21 17:15</span>
              </div>
              <div>
                增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决
              </div>
            </li>
            <div class="content-divide"></div>
            <li>
              <div>
                <span>wang东东</span>
                <span>2018-11-21 17:15</span>
              </div>
              <div>
                增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决
              </div>
            </li>
            <div class="content-divide"></div>
            <li>
              <div>
                <span>wang东东</span>
                <span>2018-11-21 17:15</span>
              </div>
              <div>
                增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn">再次呈报</el-button>
        <el-button class="operation_btn back_btn">返回</el-button>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
export default {
  components: { EventBasic },
  data () {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.report-detail {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .report-content {
      width: 100%;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .header {
        padding: 10px 20px 0 20px;
        > p {
          color: #333333;
          font-size: 16px;
          font-weight: 600;
        }
      }
      .divide {
        width: 100%;
        height: 1px;
        margin-top: 10px;
        background-color: #F2F2F2;
      }
      .report-list {
        padding: 10px 20px;
        > li {
          > div {
            line-height: 25px;
            color: #333333;
            &:nth-child(1) {
              span:nth-child(1) {
                color: #333333;
                margin-right: 10px;
              }
              span:nth-child(2) {
                color: #666666;
              }
            }
            &:nth-child(2) {
              width: 50%;
            }
          }
        }
        .content-divide {
          width: 100%;
          height: 1px;
          margin: 5px 0;
          border-bottom: 1px dashed #F2F2F2;
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


