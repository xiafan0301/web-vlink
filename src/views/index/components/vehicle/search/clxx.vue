<template>
  <div class="vehicle-info">
    <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
          <el-breadcrumb-item>信息查询</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="vehicle-info-content">
      <!-- 搜索条件 -->
      <div class="info-left">
        <vue-scroll>
        <p>可选择一个或多个条件进行搜索</p>
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
            <el-button type="primary" @click="getSearchData">查询</el-button>
          </div>
        </vue-scroll>
      </div>
      <!-- 车辆信息 -->
      <div class="info-right" v-loading="searching">
        <vue-scroll>
        <div class="info-r-content">
          <!-- 车辆信息 -->
          <div class="info-card">
            <p class="card-header">车辆信息</p>
            <div class="card-row">
              <div class="card-item">
                <label class="title">车牌号牌：</label>
                <span>湘A51790</span>
              </div>
              <div class="card-item">
                <label class="title">中文品牌：</label>
                <span>雪佛兰科鲁兹</span>
              </div>
              <div class="card-item">
                <label class="title">车身颜色：</label>
                <span>红色</span>
              </div>
              <div class="card-item">
                <label class="title">机动车状态：</label>
                <span>正常</span>
              </div>
              <div class="card-item">
                <label class="title">所有人：</label>
                <span>周全</span>
              </div>
              <div class="card-item">
                <label class="title">身份证号：</label>
                <span>430111199071651322</span>
              </div>
              <div class="card-item">
                <label class="title">核定载客：</label>
                <span>5人</span>
              </div>
              <div class="card-item">
                <label class="title">有效期：</label>
                <span>2020-02-20</span>
              </div>
              <div class="card-item vehicle-img">
                <label class="title">车辆登记照片：</label>
                <div class='upload_box'>
                  <div class="img-box" v-for="(item, index) in historyPicList" :key="index">
                    <img
                      :src="item.path"
                      @click="openBigImg(index, historyPicList)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 违章信息 -->
          <div class="info-card">
            <p class="card-header">违章信息</p>
            <div class="table_box">
              <el-table
                :data="regulationsList"
                >
                <el-table-column
                  label="序号"
                  type="index"
                  width="100"
                  >
                </el-table-column>
                <el-table-column
                  label="违法时间"
                  prop="date"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="违法地点"
                  prop="address"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="违法行为"
                  prop="name"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="处理机关"
                  prop="name"
                  show-overflow-tooltip
                  >
                </el-table-column>
              </el-table>
            </div>
            <template v-if="pagination.total > 0">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="onPageChange"
                :current-page.sync="pagination.pageNum"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="pagination.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="pagination.total"
                class="cum_pagination">
              </el-pagination>
            </template>
          </div>
          <!-- 年检信息 -->
          <div class="info-card">
            <p class="card-header">年检信息</p>
            <div class="yearly-inspection">
              <label class="title">年检到期时间：</label>
              <span class="content">2020-01-01</span>
            </div>
          </div>
        </div>
        </vue-scroll>
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

    <BigImg :imgList="imgList" :imgIndex="imgIndex" :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
  </div>
</template>
<script>
import {ajaxCtx} from '@/config/config';
import BigImg from '@/components/common/bigImg.vue';
import {JtcPOSTAppendixInfo, JtcGETAppendixInfoList, JtcPUTAppendixsOrder} from '../../../api/api.judge.js';
import { setTimeout } from 'timers';
export default {
  components: { BigImg },
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
        imgIndex: 0, // 点击的图片索引
        isShowImg: false, // 是否放大图片
        imgList: [],
        regulationsList: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],      //违章信息列表
          pagination: { total: 20, pageSize: 10, pageNum: 1 },
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
        this.getSearchData();
    },
    //查询
    getSearchData() {
      let params = {};
      if(this.searchData.time && this.searchData.time.length > 0) {
        params['startDate'] = this.searchData.time[0];
        params['endDate'] = this.searchData.time[1];
      }
      if(this.searchData.licensePlateNum) {
        params['plateNo'] = this.searchData.licensePlateNum
      }else {
        this.$message.error("请输入车牌号码");
        return false;
      }
      if(this.imgData) {
        params['vehicleNumberPic'] = this.imgData.path;
      }
      this.searching = true;
      console.log("======getSearchData=====", this.searchData, this.imgData,params);
      setTimeout(() => {
        this.searching = false;
      }, 3000);
    },
    // 图片放大
    openBigImg (index, data) {
      console.log('--------------',index, data)
      this.imgList = data;
      this.isShowImg = true;
      this.imgIndex = index;
    },
    // 关闭图片放大
    emitCloseImgDialog(data){
      this.imgList = [];
      this.isShowImg = data;
    },
    //分页
    handleSizeChange (val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getTaskData();
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
    },
  }
}
</script>
<style lang="scss" scoped>
.vehicle-info {
  height: calc(100% - 54px);
  .breadcrumb_heaer {
    background: #fff;
  }
  .vehicle-info-content {
    height: 100%;
    display: flex;
    border-top: 1px solid #D3D3D3;
    .info-left {
      width: 272px;
      padding: 20px 0 20px 20px;
      color: #999;
      background: #fff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      animation: fadeInLeft .4s ease-out .3s both;
      .vl_judge_tc_c_item {
          width: 232px;
          height: 232px;
          display: inline-block;
          position: relative;
          margin-top: 36px;
          margin-bottom: 20px;
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
        //车牌号搜索
        .license-plate-search {
          width: 232px;
          margin-bottom: 10px;
        }
    }
    .info-right {
      width: calc(100% - 272px);
      height: 100%;
      padding: 20px 0 20px 20px;
      .info-r-content {
        height: 100%;
        padding-right: 20px;
        .info-card {
          width: 100%;
          background: #fff;
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          border-radius:4px;
          margin-bottom: 20px;
          .card-header {
              font-size: 16px;
              height: 55px;
              line-height: 55px;
              border-bottom: 1px solid #F2F2F2;
              color: #333;
              padding-left: 20px;
          }
          .card-row {
            display: flex;
            flex-wrap: wrap;
            padding-left: 20px;
            padding-bottom: 20px;
            .card-item {
              color: #666;
              width: 25%;
              margin-top: 16px;
              .title {
                width: 98px;
                display: inline-block;
                text-align: right;
              }
              .upload_box {
                width: 415px;
                display: flex;
                flex-wrap: wrap;
                .img-box {
                  position: relative;
                  .play_icon {
                    position: absolute;
                    cursor: pointer;
                    top: 25%;
                    left: 28%;
                    border-radius: 50%;
                    background: #000;
                    opacity: 0.6;
                    width: 40px;
                    height: 40px;
                    .play_btn {
                      margin-left: 37%;
                      margin-top: 22%;
                    }
                  }
                  img {
                    border: 1px solid #ccc;
                    width: 100px;
                    height: 100px;
                    border-radius: 4px;
                    margin: 0 5px 5px 0;
                    cursor: pointer;
                  }
                }
              }
            }
            .vehicle-img {
              display: flex;
              width: 100%;
            }
          }
          .table_box {
            padding: 20px 20px 0;
          }
          .yearly-inspection {
            padding: 20px;
            .title {
              color: #666;
            }
          }
        }
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
.vehicle-info {
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
    .__view {
      width: 100% !important; // vue-scroll样式重置
    }
}
</style>
