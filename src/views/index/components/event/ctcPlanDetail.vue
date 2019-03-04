<template>
  <vue-scroll>
    <div class="ctc-plan-detail">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/ctcplan' }">调度预案</el-breadcrumb-item>
          <el-breadcrumb-item>预案详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <ul>
          <li>
            <span>预案名称:</span>
            <span>公共区域消防安全应急预案</span>
          </li>
          <li>
            <span>预案类型:</span>
            <span>事故灾难</span>
          </li>
          <li>
            <span>适用事件等级:</span>
            <span>Ⅰ级(特重)、Ⅱ级(重大)</span>
          </li>
          <li>
            <span>任务内容:</span>
            <span>
              任务内容示意：调度指挥方案任务内容填写，段落文字多行显示，
              这段文字是样式参考。调度指挥方案任务内容填写，段落文字多行显示，这段文字是样式参考。
              调度指挥方案任务内容填写，段落文字多行显示，这段文字是样式参考。调度指挥方案任务内容填写，
              段落文字多行显示，这段文字是样式参考。调度指挥方案任务内容填写，段落文字多行显示，
              这段文字是样式参考。调度指挥方案任务内容填写，段落文字多行显示，这段文字是样式参考。
            </span>
          </li>
          <li>
            <span>附件:</span>
            <span style="display:flex;align-items:center;">
              <i class="vl_icon vl_icon_event_5"></i>
              公共区域消防安全应急预案.docx
              <i class="vl_icon vl_icon_event_6" style="margin-left:5px;cursor:pointer;"></i>
            </span>
          </li>
          <li>
            <span>响应处置:</span>
            <div class="res-list">
              <div class="list-detail">
                <div>
                  <span>协同部门：</span>
                  <span>协同部门：联动单位A</span>
                </div>
                <div>
                  <span>任务名称：</span>
                  <span>任务名称：灭火</span>
                </div>
                <div>
                  <span>任务内容：</span>
                  <span>
                    第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，
                    完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：
                    第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，
                    完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：
                    第一时间赶往火灾现场处理，完成后及时上报任务名称：
                    第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报
                  </span>
                </div>
              </div>
              <div class="list-detail">
                <div>
                  <span>协同部门：</span>
                  <span>协同部门：联动单位A</span>
                </div>
                <div>
                  <span>任务名称：</span>
                  <span>任务名称：灭火</span>
                </div>
                <div>
                  <span>任务内容：</span>
                  <span>任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：
                    第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报</span>
                </div>
              </div>
              <div class="list-detail">
                <div>
                  <span>协同部门：</span>
                  <span>联动单位A</span>
                </div>
                <div>
                  <span>任务名称：</span>
                  <span>灭火</span>
                </div>
                <div>
                  <span>任务内容：</span>
                  <span>第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报任务名称：
                    第一时间赶往火灾现场处理，完成后及时上报任务名称：第一时间赶往火灾现场处理，完成后及时上报</span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <span>创建用户:</span>
            <span>谭某某</span>
          </li>
          <li>
            <span>创建事件:</span>
            <span>2018-07-16 08:56:55</span>
          </li>
        </ul>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn" @click="skipEditPage">修改</el-button>
        <el-button class="operation_btn delete_btn" @click="showDeleteDialog">删除</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
      <!--删除预案弹出框-->
      <el-dialog
        title="是否确定删除该预案?"
        :visible.sync="delPlanDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <span style="color: #999999;">删除后调度指挥时将不能再执行此预案。</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="delPlanDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" @click="delPlanDialog = false">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </vue-scroll>
</template>
<script>
export default {
  data () {
    return {
      delPlanDialog: false, // 删除预案弹出框
    }
  },
  methods: {
    // 显示删除预案弹出框
    showDeleteDialog () {
      this.delPlanDialog = true;
    },
    // 跳至修改预案页面
    skipEditPage () {
      this.$router.push({name: 'edit_plan'});
    },
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc-plan-detail {
  width: 100%;
  .content-box {
    width: 98%;
    margin: 0 20px;
    margin-bottom: 100px;
    box-shadow: 5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius: 4px;
    background-color: #ffffff;
    > ul {
      padding: 20px;
      width: 100%;
      > li {
        line-height: 35px;
        display: flex;
        > span:nth-child(1) {
          width: 100px;
          text-align: right;
          color: #666666;
          display: inline-block;
          margin-right: 10px;
        }
        > span:nth-child(2) {
          width: 50%;
          display: inline-block;
          color: #333333;
        }
        .res-list {
          width: 50%;
          .list-detail {
            width: 100%;
            background-color: #FAFAFA;
            padding: 10px;
            color: #333333;
            margin-bottom: 10px;
            > div {
              color: #333333;
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
    .delete_btn {
      background-color: #F94539;
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

