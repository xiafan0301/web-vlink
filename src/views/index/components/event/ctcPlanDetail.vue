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
            <span>{{planDetail.planName}}</span>
          </li>
          <li>
            <span>预案类型:</span>
            <span>{{planDetail.eventTypeName}}</span>
          </li>
          <li>
            <span>适用事件等级:</span>
            <span>
              <template v-if='planDetail.levelNameList'>
                {{planDetail.levelNameList.join()}}
              </template>
            </span>
          </li>
          <li>
            <span>预案正文:</span>
            <span>{{planDetail.planDetail}}</span>
          </li>
          <li>
            <span>附件:</span>
            <span style="display:flex;align-items:center;">
              <template v-if="planDetail.cname">
                <i class="vl_icon vl_icon_event_5"></i>
                {{planDetail.cname}}
                <i class="vl_icon vl_icon_event_6" style="margin-left:5px;cursor:pointer;" @click="downloadFile(planDetail.path)"></i>
              </template>
              <template v-else>无</template>
            </span>
          </li>
          <li>
            <span>响应处置:</span>
            <div class="res-list">
              <div
                class="list-detail"
                v-for="(item, index) in planDetail.taskList"
                :key="'item' + index"
              >
                <div>
                  <span>协同部门：</span>
                  <span>{{item.departmentName}}</span>
                </div>
                <div>
                  <span>任务名称：</span>
                  <span>{{item.taskName}}</span>
                </div>
                <div>
                  <span>任务内容：</span>
                  <span>{{item.taskContent}}</span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <span>创建用户:</span>
            <span>{{planDetail.createUserName}}</span>
          </li>
          <li>
            <span>创建时间:</span>
            <span>{{planDetail.createTime}}</span>
          </li>
        </ul>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn" @click="skipEditPage">修改</el-button>
        <a target="_blank" :href="previewUrl.ctc + 'plan-services/plans/preview/' + this.$route.query.planId">
          <el-button class="operation_btn function_btn">预览</el-button>
        </a>
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
          <el-button class="operation_btn function_btn" @click="sureDeletePlan">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </vue-scroll>
</template>
<script>
import { getPlanDetail, delPlan } from '@/views/index/api/api.js';
import { ajaxCtx } from '@/config/config.js';
export default {
  data () {
    return {
      previewUrl: null,
      delPlanDialog: false, // 删除预案弹出框
      planDetail: {}, // 预案详情
    }
  },
  created () {
    this.previewUrl = ajaxCtx;
  },
  mounted () {
    this.getPlanDetail();
  },
  methods: {
    // 获取预案详情
    getPlanDetail () {
      const planId = this.$route.query.planId;
      if (planId) {
        getPlanDetail(planId)
         .then(res => {
           if (res) {
             this.planDetail = res.data;
           }
         })
      }
    },
    // 显示删除预案弹出框
    showDeleteDialog () {
      this.delPlanDialog = true;
    },
    // 跳至修改预案页面
    skipEditPage () {
      this.$router.push({name: 'edit_plan', query:{planId: this.$route.query.planId}});
    },
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 确认删除预案
    sureDeletePlan () {
      const delPlanId = this.$route.query.planId;
      if (delPlanId) {
        delPlan(delPlanId)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              })
              this.delPlanDialog = false;
              this.$router.push({name: 'event_ctcplan'});
            } else {
              this.$message({
                type: 'error',
                message: '删除失败',
                customClass: 'request_tip'
              })
          }
          })
          .catch(() => {})
      }
    },
     // 下载文件
    downloadFile (url) {
      if (url) {
        window.open(url);
      }
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

