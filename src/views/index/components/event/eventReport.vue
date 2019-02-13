<template>
  <vue-scroll>
    <div class="event-report">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/untreatEventDetail' }">事件详情</el-breadcrumb-item>
          <el-breadcrumb-item>向上级呈报</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic></EventBasic>
        <div class="report-operation">
          <el-form :model="reportForm" class="report-form" size="small">
            <el-form-item label="接收者:" label-width="100px">
              <el-input v-model="reportForm.reportUser"></el-input>
            </el-form-item>
            <el-form-item label="情况说明:" label-width="100px">
              <el-input type="textarea" rows="6" v-model="reportForm.explain"></el-input>
            </el-form-item>
            <div class="search-result">
              <vue-scroll>
                <ul>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                  <li>啊十大科技阿萨大</li>
                  <li>石媛</li>
                  <li>欧阳龙蛟</li>
                </ul>
              </vue-scroll>
            </div>
          </el-form>
        </div>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn">确定提交</el-button>
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
      reportForm: {
        reportUser: null, // 接收者
        explain: null // 情况说明
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.event-report {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .report-operation {
      width: 100%;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .report-form {
        width: 50%;
        padding: 20px 0;
        position: relative;
        .search-result {
          border: 1px solid #000000;
          width: 250px;
          height: 200px;
          position: absolute;
          top: 52px;
          left: 100px;
          background-color: #ffffff;
          .__view {
            > ul {
              width: 100%;
              height: 100%;
              > li {
                width: 100%;
                height: 20px;
                padding-left: 20px;
                line-height: 20px;
                &:hover {
                  cursor: pointer;
                  background-color: #0C70F8;
                  color: #ffffff;
                }
              }
            }
          }
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


