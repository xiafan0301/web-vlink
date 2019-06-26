<template>
  <div class="driving-rules">
    <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
          <el-breadcrumb-item>行车规律分析</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="driving-rules-content">
      <!-- 搜索条件 -->
      <div class="info-left">
        <!-- 上传 -->
        <div class="vl_judge_tc_c_item">
            <el-upload
              :class="{'vl_jtc_upload': true}"
              :show-file-list="false"
              accept="image/*"
              :action="uploadAcion"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :on-success="uploadSucess"
              :on-error="handleError">
              <i v-if="uploading" class="el-icon-loading"></i>
              <img v-else-if="curImageUrl" :src="curImageUrl">
              <div v-else>
              <i style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;" class="vl_icon vl_icon_vehicle_01" ></i>
              <span>点击上传图片</span>
              </div>
            </el-upload>
            <p @click="showHistoryPic">从上传记录中选择</p>
            <div v-show="curImageUrl" class="del_icon">
              <i class="el-icon-delete" @click="delPic"></i>
            </div>
          </div>
          <!-- 切换查询条件 -->
          <div class="tab-switching">使用车牌号</div>
          <!-- 车牌号搜索 -->
          <div class="license-plate-search">
            <el-input v-model="searchData.licensePlateNum" placeholder="请输入车牌号码搜索" clearable></el-input>
          </div>
          <!-- 时间 -->
          <div class="time-search">
            <el-date-picker
                v-model="searchData.time"
                type="daterange"
                range-separator="-"
                value-format="yyyy-MM-dd"
                format="yy/MM/dd"
                :picker-options="pickerOptions"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="search-btn">
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" :loading="searching" @click="getVehicleDetail">确定</el-button>
          </div>
      </div>
      <!-- 车辆信息 -->
      <div class="info-right" v-loading="searching">

      </div>
    </div>

    <!--上传记录弹窗-->
    <el-dialog
      :visible.sync="historyPicDialog"
      class="history-pic-dialog"
      :close-on-click-modal="false"
      top="4vh"
      title="最近上传的图片">
      <div style="text-align: center;font-size: 20px;" v-if="loadingHis"><i class="el-icon-loading"></i></div>
      <vue-scroll class="his-pic-box" v-else-if="historyPicList.length">
        <div class="his-pic-item" :class="{'active': item.checked}" v-for="item in historyPicList" :key="item.uid" @click="chooseHisPic(item)">
          <img :src="item.path" alt="">
        </div>
        <div style="clear: both;"></div>
      </vue-scroll>
      <p v-else>暂无历史记录</p>
      <div slot="footer">
        <el-button @click="historyPicDialog = false">取消</el-button>
        <el-button type="primary" @click="addHisToImg" :disabled="choosedHisPic.length === 0">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {ajaxCtx} from '@/config/config';
import {JtcPOSTAppendixInfo, JtcGETAppendixInfoList, JtcPUTAppendixsOrder} from '../../../api/api.judge.js';
export default {
  data () {
    return {
      uploadAcion: ajaxCtx.base + '/new',       //上传路径
      uploading: false, // 是否上传中
      uploadFileList: [],
      curImageUrl: '', // 当前上传的图片
      historyPicList: [], // 上传历史记录
      historyPicDialog: false,
      loadingHis: false,
      imgData: null,
      searchData: {                //搜索参数
          time: null,
          licensePlateNum: null, // 车牌号
      },
      pickerOptions: {
          disabledDate (time) {
            let date = new Date();
            let y = date.getFullYear();
            let m = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
            let d = date.getDate();
            let threeMonths = '';
            let start = '';
            if (parseFloat(m) >= 4) {
              start = y + '-' + (m - 3) + '-' + d;
            } else {
              start = (y - 1) + '-' + (m - 3 + 12) + '-' + d;
            }
            threeMonths = new Date(start).getTime();
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          }
        },
        searching: false,
    }
  },
  computed: {
    choosedHisPic () {
      return this.historyPicList.filter(x => x.checked)
    }
  },
  mounted () {
      this.setDTime();
  },
  methods: {
    // 上传图片
    beforeAvatarUpload (file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error('只能上传 JPG / PNG 格式图片!');
      }
      if (!isLt) {
        this.$message.error('上传图片大小不能超过 100MB!');
      }
      this.uploading = true;
      return isJPG && isLt;
    },
    //上传成功
    uploadSucess (response, file, fileList) {
      this.uploading = false;
      /* this.compSim = '';
      this.compSimWord = ''; */
      if (response && response.data) {
        let oRes = response.data;
        if (oRes) {
          let x = {
            cname: oRes.fileName, // 附件名称 ,
            contentUid: this.$store.state.loginUser.uid,
            // desci: '', // 备注 ,
            filePathName: oRes.fileName, // 附件保存名称 ,
            fileType: 1, // 文件类型 ,
            imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
            imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
            imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
            // otherFlag: '', // 其他标识 ,
            path: oRes.fileFullPath, // 附件路径 ,
            // path: oRes.path,
            thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
            thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
            // uid: '' //  附件标识
          };
          JtcPOSTAppendixInfo(x).then(jRes => {
            if (jRes) {
              x['uid'] = jRes.data;
              console.log(x);
            }
          })
          this.imgData = x;
          this.curImageUrl = x.path;
        }
      }
      this.uploadFileList = fileList;
    },
    //上传失败
    handleError () {
      this.uploading = false;
      this.$message.error('上传失败')
    },
    //获取上传记录
    showHistoryPic () {
      this.loadingHis = true;
      this.historyPicDialog = true;
      let params = {
        userId: this.$store.state.loginUser.uid,
        fileType: 1
      }
      JtcGETAppendixInfoList(params).then(res => {
        if (res) {
          this.loadingHis = false;
          res.data.forEach(x => x.checked = false);
          this.historyPicList = res.data;
        }
      }).catch(() => {
        this.historyPicDialog = false;
      })
    },
    //删除图片
    delPic () {
      this.uploadFileList.splice(0, 1);
      this.curImageUrl = '';
    },
    //选择最近上传的图片
    chooseHisPic (item) {
      this.historyPicList.forEach(x => {
        x.checked = false;
      })
      item.checked = true;
    },
    //从历史上传图片中上传
    addHisToImg () {
      this.historyPicDialog = false;
      let _ids = [];
      this.choosedHisPic.forEach(x => {
        _ids.push(x.uid)
        this.curImageUrl = x.path;
        this.imgData = x;
      })
      let _obj = {
        appendixInfoIds: _ids.join(',')
      }
      JtcPUTAppendixsOrder(_obj);
    },
    //设置默认时间
    setDTime () {
        let date = new Date();
        let curDate = date.getTime();
        let curS = 30 * 24 * 3600 * 1000;
        let _s = new Date(curDate - curS).getFullYear() + '-' + (new Date(curDate - curS).getMonth() + 1) + '-' + new Date(curDate - curS).getDate();
        let _e = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        this.searchData.time = [_s, _e]
    },
    //重置
    resetSearch () {
        this.searchData.licensePlateNum = null;
        this.uploadFileList.splice(0, this.uploadFileList.length);
        this.imgData = null;
        this.curImageUrl = '';
        this.setDTime();
        this.getVehicleDetail();
    },
    //查询
    getVehicleDetail() {
      this.searching = true;
      console.log("======getVehicleDetail=====",this.searchData,this.imgData)
      let params = {

      }
      setTimeout(() => {
        this.searching = false;
      },3000)
    },
  }
}
</script>
<style lang="scss" scoped>
.driving-rules {
  height: calc(100% - 54px);
  .breadcrumb_heaer {
    background: #fff;
  }
  .driving-rules-content {
    height: 100%;
    display: flex;
    border-top: 1px solid #D3D3D3;
    .info-left {
      width: 272px;
      padding: 20px 0 20px 20px;
      color: #999;
      background: #fff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      .vl_judge_tc_c_item {
          width: 232px;
          height: 232px;
          display: inline-block;
          position: relative;
          margin-bottom: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          border-radius: 10px;
          cursor: pointer;
          &:hover {
            background: #2981F8;
            >p {
              display: block;
            }
            .del_icon {
              display: block;
            }
          }
          .vl_jtc_upload {
            width: 100%;
            height: 100%;
            background: none;
          }
          >p {
            display: none;
            position: absolute;
            bottom: 0;
            text-align: center;
            width: 100%;
            color: #FFFFFF;
            height: 40px;
            line-height: 40px;
            -webkit-border-radius: 0 0 10px 10px;
            -moz-border-radius: 0 0 10px 10px;
            border-radius: 0 0 10px 10px;
            background: #0C70F8;
          }
          .del_icon {
            display: none;
            position: absolute;
            top: 10px;
            right: 10px;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background: rgba(0, 0, 0, .4);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            color: #FFFFFF;
          }
        }
        //条件切换
        .tab-switching {
          width: 232px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #666;
          background-color: #f2f2f2;
          border: 1px solid #d3d3d3;
          border-radius: 4px;
          cursor: pointer;
          /* &:hover {
            color: #0C70F8;
          } */
        }
        //车牌号搜索
        .license-plate-search {
          width: 232px;
          margin-bottom: 10px;
        }
    }
  }
}
</style>

<style lang="scss">
html {
    font-size: 100px;
  }
@media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
@media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
@media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
@media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
@media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
.driving-rules {
  .vl_judge_tc_c_item {
    .vl_jtc_upload {
      .el-upload {
            width: 100%;
            height: 100%;
            background: #F2F2F2;
            border: none;
            span {
              color: #999;
            }
            img {
              width: 100%;
              height: 100%;
              -webkit-border-radius: 10px;
              -moz-border-radius: 10px;
              border-radius: 10px;
            }
      }
    }
  }
  //时间搜索
  .time-search {
    margin-bottom: 10px;
    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
      width: 232px;
    }
  }
  //搜索按钮
  .search-btn {
    width: 232px;
    text-align: center;
    .el-button {
      width: 45%;
    }
  }
  //弹窗
  .history-pic-dialog {
      .el-dialog {
        max-width: 12.6rem;
        width: 100%!important;
      }
      .el-dialog__title {
        font-size: .16rem;
        color: #333333;
      }
      .el-dialog__body {
        padding: 0 .76rem .3rem;
      }
      .his-pic-box {
        width: 100%;
        height: 4.6rem!important;
        .his-pic-item {
          float: left;
          width: 1.38rem;
          height: 1.38rem;
          border: .02rem solid #FFFFFF;
          margin-right: .2rem;
          margin-bottom: .2rem;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .active {
          border-color: #0C70F8;
        }
      }
      .el-dialog__footer {
        button {
          width: 1.4rem!important;
          height: .4rem;
          line-height: .4rem;
          padding: 0;
        }
      }
    }
}
</style>