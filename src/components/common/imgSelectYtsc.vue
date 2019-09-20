<template>
  <el-dialog
  title=""
  :visible.sync="dialogVisible"
  width="1024px"
  :show-close="true"
  :close-on-press-escape="false"
  :close-on-click-modal="false"
  custom-class="cut_img_select_ytsc_dialog"
  >
    <div class="select_body">
      <div class="top">
        <div class="tab_list">
          <p class="active_tab">
            <span class="number">1</span>
            <span class="text">选择车体</span>
          </p>
          <p>
            <span class="number">2</span>
            <span class="text">框选特征</span>
          </p>
        </div>
        <div class="btn_box">
          <el-button class="nosure_btn" size="small">取消</el-button>
          <el-button class="nosure_btn" size="small">上一步</el-button>
          <el-button class="sure_btn" size="small">确定</el-button>
        </div>
      </div>
      <div class="middle">
        <div class="middle_left">
          <span class="middle_step">1</span>
          <img src="http://newfile.aorise.org:80/group1/default/20190919/15/00/2/9546310b-b254-49ca-8ff2-4b3cef487d45.png" alt="">

        </div>
        <div class="middle_right">
          <span class="middle_step">2</span>
          <img src="http://newfile.aorise.org:80/group1/default/20190919/15/00/2/9546310b-b254-49ca-8ff2-4b3cef487d45.png" alt="">
        </div>
      </div>
      <div class="divide"></div>
      <div class="bottom">
        <div class="item_list" v-for="item in '123456'" :key="item">
          <p class="close_btn">
            <i class="el-icon-close"></i>
          </p>
          <img src="http://newfile.aorise.org:80/group1/default/20190919/15/00/2/9546310b-b254-49ca-8ff2-4b3cef487d45.png" alt="">
          <span class="info_text">特征{{item}}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: true,
    }
  }
}
</script>
<style lang="scss" scoped>
.cut_img_select_ytsc_dialog {
  .select_body {
    .top {
      display: flex;
      align-items: center;
      >div {
        width: 50%;
      }
      .tab_list {
        display: flex;
        >p {
          padding-bottom: 10px;
          margin-right: 20px;
          color: #666666;
          display: inline-block;
          .number {
            // width: 10px;
            // height: 10px;
            font-size: 12px;
            padding: 0 5px;
            margin-right: 10px;
            border: 1px solid #666666;
            border-radius: 50%;
          }
        }
        .active_tab {
          color: #0C70F8;
          border-bottom: 2px solid #0C70F8;
          .number {
            border-color: #0C70F8;
            color: #0C70F8;
          }
        }
      }
      .btn_box {
        .nosure_btn, .sure_btn {
          width: 110px;
          border-radius:2px;
        }
        .nosure_btn {
          background:rgba(246,248,249,1);
          border:1px solid rgba(211,211,211,1);
        }
        .sure_btn {
          background:rgba(12,112,248,1);
          color: #ffffff;
        }
      }
    }
    .middle {
      margin-top: 20px;
      display: flex;
      height: 300px;
      .middle_left, .middle_right {
        position: relative;
        width: 48%;
        >img {
          width: 100%;
          height: 100%;
        }
        .middle_step {
          position: absolute;
          width: 25px;
          height: 25px;
          line-height: 25px;
          background:rgba(12,112,248,1);
          border-radius:50%;
          color: #ffffff;
          font-weight:600;
          font-size: 13px;
          text-align: center;
          left: 10px;
          top: 10px;
        }
      }
      .middle_right {
        margin-left: 2%;
      }
    }
    .divide {
      border: 1px solid #F2F2F2;
      margin: 20px 0;
    }
    .bottom {
      display: flex;
      flex-wrap: wrap;
      .item_list {
        width: calc((100% - 100px) / 6);
        height: auto;
        min-height: 85px;
        margin-right: 20px;
        position: relative;
        background-color: #EAEAEA;
        .close_btn {
          background-color: #000000;
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 20px;
          text-align: center;
          cursor: pointer;
          i {
            font-size: 14px;
            color: #ffffff;
          }
        }
        .info_text {
          padding: 2px 5px;
          position: absolute;
          background-color: #000000;
          bottom: 0;
          left: 0;
          opacity:0.8;
          color: #ffffff;
          border-radius:0px 2px 0px 0px;
        }
        &:last-child {
          margin-right: 0;
        }
        >img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>