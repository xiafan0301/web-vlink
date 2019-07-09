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
            <span>分析时间：</span>
            <span>{{taskDetail.taskName ? taskDetail.taskName : '无'}}</span>
          </li>
          <li>
            <span>起点设备：</span>
            <span>{{taskDetail.taskName ? taskDetail.taskName : '无'}}</span>
          </li>
          <li>
            <span>尾随间隔：</span>
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
            <div class="list-box">
              <div class="list-item" v-for="item in '123123123123123'" :key="item.id">
                <img src="../../../../assets/img/666.jpg" alt="">
                <p class="time"><i></i>2018.-11-12  13:14:15</p>
                <p class="address"><i></i>抓拍设备:抓拍名称京广高速</p>
              </div>
              <el-pagination
                class="cum_pagination th-center-pagination"
                @current-change="onPageChange"
                :current-page.sync="pagination.pageNum"
                :page-size="pagination.pageSize"
                layout="prev, pager, next"
                :total="pagination.total">
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
        pageSize: 8,
        totol: 0
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
      padding: 20px 0 20px 15px;
      position: relative;
      .input-box {
        width: 100%;
        height: calc(100% - 50px);
        overflow: hidden;
        // 选择设备下拉
        .selected_device {
          margin-bottom: 10px;
          position: relative;
          width: 240px;
          height: 40px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          padding-left: 15px;
          > i {
            position: absolute;
            right: 12px;
            top: 13px;
          }
          &:hover,
          &:focus {
            // border-color: #0c70f8;
            cursor: pointer;
          }
          .device_list {
            line-height: 40px;
            font-size: 14px;
            color: #333;
            .device_count {
              color: #0c70f8;
              margin-left: 20px;
            }
          }
          .no_device {
            line-height: 40px;
            color: #999999;
          }
          // 树tab
          .device_tree_tab {
            position: absolute;
            top: 50px;
            left: -1px;
            z-index: 100;
            background: #fff;
            width: 240px;
            height: 350px;
            border-radius: 4px;
            border: 1px solid #d3d3d3;
            .tab_title {
              width: 50%;
              float: left;
              background: #f2f2f2;
              text-align: center;
              color: #666666;
              line-height: 30px;
              font-size: 12px;
            }
            .current_title {
              background: #fff;
            }
            // 树
            .tree_content {
              height: 310px;
              padding-top: 10px;
              .checked_all {
                padding: 0 0 8px 23px;
              }
            }
          }
        }
        // 关闭设备tab
        .selected_device_comp {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: auto;
          margin: 0;
          opacity: 0;
          z-index: 10;
        }
        .input-box-line {
          display: flex;
          padding-bottom: 12px;
          padding-right: 15px;
          .title {
            display: flex;
            flex-direction: column;
            color: #909399;
            width: 20px;
          }
        }
        .left_num{
          display: flex;
          padding-bottom: 10px;
          .el-input{
            width: 175px;
          }
          > span{
            margin-left: 4px;
            line-height: 40px;
            color: #999;
            font-size: 12px;
          }
        }
        .add-vehicle-number {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #909399;
          cursor: pointer;
          i {
            font-size: 20px;
            vertical-align: text-top;
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
        .list-box {
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-between;
          flex-flow: row wrap;
          // height: calc(100% - 45px);
          .list-item {
            width: 24%;
            height: 344px;
            padding: 15px;
            margin-bottom: 15px;
            background: #fff;
            margin-left: 1.3%;
            &:nth-child(4n - 3) {
              margin-left: 0;
            }
            img {
              display: inline-block;
              width: 100%;
              height: calc(100% - 70px);
            }
            p {
              font-size: 14px;
              font-family: 'MicrosoftYaHei';
              font-weight: 500;
              color: #333;
              i {
                color: #999;
                margin-right: 3px;
                display: block;
                width: 15px;
                height: 15px;
              }
            }
            .time {
              display: flex;
              align-items: center;
              padding: 10px 0 5px 0;
              i {
                background: url("../../../../assets/img/the-time.png") no-repeat;
                background-size: 15px 15px;
              }
            }
            .address {
              display: flex;
              align-items: center;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              i {
                background: url("../../../../assets/img/the-daynoint.png") no-repeat;
                background-size: 15px 15px;
              }
            }
          }
        }
        .th-center-pagination {
          width: 100%;
          text-align: center;
          padding: 0 0 20px 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.input-box-line {
  .el-input__inner::placeholder {
    color: #999999;
  }
  .el-input__inner:hover,
  .el-input__inner:focus {
    border-color: #DCDFE6;
  }
  .el-input-group__prepend {
    background: #fff;
    padding: 0 5px;
  }
  .el-date-editor {
    .el-input__inner {
      padding-left: 15px;
    }
    .el-input__prefix {right: 5px;left: auto;}
  }
}
.left_num {
  .el-input__inner:hover,
  .el-input__inner:focus {
    border-color: #DCDFE6 !important;
  } 
  .left-none-border {
    .el-input__inner {
      border-left: none;
    }
    .el-input-group__prepend {
      background-color: #fff;
      color: #999;
      padding: 0 5px 0 10px;
    }
  }
}
.the-left-search {
  .left_btn{
    padding-top: 10px;
    padding-left: 10px;
    .select_btn, .reset_btn {
      width: 110px;
    }
    .select_btn {
      background-color: #0C70F8;
      color: #ffffff;
    }
    .reset_btn {
      background-color: #ffffff;
      color: #666666;
      border-color: #DDDDDD;
    }
  }
}
.th-upload-box {
  width: 242px;
  height: 242px;
  margin-bottom: 15px;
  .vl_jtc_upload {
    width: 100%;
    height: 100%;
    background: none;
    .el-upload {
      width: 100%;
      height: 100%;
    }
  }
  .el-upload--picture-card:hover,
  .el-upload:focus {
    border-color: transparent;
    color: #999;
  }
}
</style>
