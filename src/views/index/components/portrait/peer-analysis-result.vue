<template>
  <div class="peer-analysis">
    <div class="th-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">人像检索</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/portrait/peer-analysis-list' }">同行分析</el-breadcrumb-item>
        <el-breadcrumb-item>分析结果</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <el-button :loading="exportLoadingbtn" @click="onExport" class="th-button-export-color">导出</el-button> -->
    </div>
    <div class="the-bottom">
      <div class="the-left-search">
       <ul>
          <li>
            <img src="../../../../assets/img/temp/vis-eg.png" alt="">
          </li>
          <li>
            <span>任务名称：</span>
            <span>{{taskDetail.taskName ? taskDetail.taskName : '无'}}</span>
          </li>
          <li>
            <span>已选设备：</span>
            <span>{{taskDetail.taskName ? taskDetail.taskName : '无'}}</span>
          </li>
          <li>
            <span>分析时间：</span>
            <span>
              <p>{{taskDetail.taskName ? taskDetail.taskName : '无'}}</p>
              <p>{{taskDetail.taskName ? taskDetail.taskName : '无'}}</p>
            </span>
          </li>
          <li>
            <span>同行次数：</span>
            <span>{{taskDetail.taskName ? taskDetail.taskName : '无'}}</span>
          </li>
          <li>
            <span>创建时间：</span>
            <span>{{taskDetail.createTime ? taskDetail.createTime : '无'}}</span>
          </li>
        </ul>
      </div>
      <div class="the-right-result">
        <div class="the-result-box-peer">
          <vue-scroll>
            <div class="the-result-number">检查结果<span>（166）</span></div>
            <div class="list-box">
              <ul class="rlcx_r_list clearfix">
                <li v-for="item in 12" :key="item">
                  <div style="">
                    <img src="../../../../assets/img/666.jpg" alt="">
                    <div>
                      <h4>检索资料</h4>
                      <div><i class="vl_icon rlcx_sj"></i>18-12-24 14:12:17</div>
                      <p>
                        <span style="height: 30px;line-height: 30px;padding: 0 10px;display: inline-block;background: #fafafa;border: 1px solid #f2f2f2;border-radius: 3px;">男性</span>
                        <span style="height: 30px;line-height: 30px;padding: 0 10px;display: inline-block;background: #fafafa;border: 1px solid #f2f2f2;border-radius: 3px;margin-left: 8px;">青年</span>
                      </p>
                      <p><img src="../../../../assets/img/txfx_pao.png" alt=""><b style="color: #0C70F8;font-size: 34px;padding-left: 8px;">04</b><span style="color: #0C70F8;"> 同行次</span></p>
                      <div style="margin-top: 15px; cursor: pointer;border:1px solid #D3D3D3;border-radius:4px;background:rgba(246,248,249,1);color: #666;" @click="goRecord">查看同行记录</div>
                    </div>
                  </div>
                </li>
              </ul>
              <el-pagination
                class="cum_pagination th-center-pagination"
                @current-change="onPageChange"
                :current-page.sync="pagination.currentPage"
                :page-size="pagination.pageSize"
                layout="prev, pager, next"
                :total="32">
              </el-pagination>
            </div>
          </vue-scroll>
        </div>
      </div>
    </div>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>                         -->
  </div>
</template>

<script>
import { getTaskInfosDetail } from '@/views/index/api/api.analysis.js';
export default {
  data () {
    return {
      pagination: {
        pageNum: 1,
        pageSize: 9,
        currentPage: 1
      },
      taskDetail: {}
    }
  },
 
  mounted() {

  },
  methods: {
    // 获取离线任务详情
    getDetail () {
      const id = this.$route.query.id;
      if (id) {
        getTaskInfosDetail(id)
          .then(res => {
            if (res) {
              this.taskDetail = res.data;
            }
          })
      }
    },
    goRecord () {
      this.$router.push({name: 'peer_analysis_record'})
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
    },
  }
}
</script>

<style lang="scss" scoped>
.peer-analysis {
  width: 100%; height: 100%;
  .the-bottom {
    width: 100%;height: calc(100% - 60px);
    display: flex;
    position: relative;
    .the-left-search {
      width: 272px;height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
      padding: 20px 15px;
      position: relative;
      > ul {
        width: 100%;height: 100%;
        li:nth-child(1) {
          img {
            display: inline-block;
            width: 232px;height: 232px;
            border-radius: 10px;
          }
        }
        li {
          padding-bottom: 10px;
          span:nth-child(1) {
            color: #999;
            display: inline-block;
            width: 75px;
            vertical-align: top;
          }
          span:nth-child(2) {
            display: inline-block;
            width: calc(100% - 75px);
            color: #555;
          }
        }
      }
    }
    .the-right-result {
      width: calc(100% - 285px); height: 100%;
      margin-left: 13px;
      background: #F7F9F9;
      padding: 15px 12px 25px 0;
      overflow-y: hidden;
      .the-result-box-peer {
        width: 100%; height: 100%;
        background: #F6F8F9;
        .the-result-number {
          color: #333;
          padding: 0 0 8px 12px;
          span {
            color: #666;
          }
        }
        .list-box {
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-between;
          flex-flow: row wrap;
          // height: calc(100% - 45px);
          > .rlcx_r_list {
            padding: 5px;
            > li {
              padding: 5px;
              float: left;
              > div {
                position: relative;
                width: 380px; height: 210px;
                padding: 10px;
                background-color: #fff;
                box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
                > img {
                  position: absolute; top: 10px; left: 10px;
                  width: 190px; height: 190px;
                }
                > div {
                  height: 100%;
                  margin-left: 210px; padding-right: 10px;
                  > h4 {
                    color: #999;
                    margin-bottom: 10px;
                  }
                  > div {
                    position: relative;
                    height: 30px; line-height: 30px;
                    margin-bottom: 10px; padding-left: 30px;
                    font-size: 12px;
                    background:rgba(250,250,250,1);
                    border:1px solid rgba(242,242,242,1);
                    border-radius:3px;
                    > i {
                      position: absolute; top: 7px; left: 10px;
                      width: 12px; height: 15px;
                      &.rlcx_sxt { background-position: -325px -377px; }
                      &.rlcx_sj { background-position: -787px -376px; }
                    }
                  }
                }
              }
            }
          }
        }
        .th-center-pagination {
          width: 100%;
          text-align: center;
          padding: 20px 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
</style>
