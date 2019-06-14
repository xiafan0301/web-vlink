<template>
  <div class="vl_judge_tc">
    <div class="vl_j_left">
      <div class="vl_jtc_img_box">
        <div class="vl_jtc_upload_img" @drop="drop($event)" @dragover="allowDrop($event)">
          <el-upload
            :class="{'vl_jtc_upload': true}"
            :limit="3"
            multiple
            :show-file-list="false"
            accept="image/*"
            :action="uploadAcion"
            list-type="picture-card"
            :on-exceed="uploadPicExceed"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSucess"
            :on-error="handleError">
            <i v-if="uploading" class="el-icon-loading"></i>
            <img v-else-if="curImageUrl" :src="curImageUrl">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
          <p @click="showHistoryPic">从上传记录中选择</p>
        </div>
        <div class="vl_jtc_img_list">
          <div v-for="(item, index) in imgList" :key="item.id" :class="{'middle_img': index === 1}">
            <img :src="item.path ? item.path : ''" alt="">
            <div class="del_mask" v-show="item.path">
              <i class="el-icon-delete" @click="delPic(index)"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="vl_jtc_search">
        <div style="text-align: center">
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="primary" :loading="searching"  @click="tcDiscuss(false)">确定</el-button>
        </div>
      </div>
    </div>
    <div class="vl_s_right">
      <div class="vl_jig_right">
        <div class="vl_jig_right_title">
          <div class="vl_jr_t_item">
            <span><span style="color: #333333">检索结果 </span> ({{strucInfoList.length}})</span>
          </div>
        </div>
        <div class="vl_jfo_event">
          <vue-scroll>
            <div class="vl_jfo_event_box clearfix" >
              <div class="vl_jfo_box_item" v-for="(item, index) in strucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
                <div class="vl_jfo_i_left"><img title="可以试着把我拖拽到左侧上传图片处" draggable="true" @dragstart="drag($event)" :src="item.photoUrl" alt=""></div>
                <div class="vl_jfo_i_right">
                  <p>检索资料</p>
                  <div class="vl_jfo_line" style="margin-right: .1rem;"><span>{{item.name}}</span></div>
                  <div class="vl_jfo_line"><span>{{item.originBank}}</span></div>
                  <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_03"></i>{{item.semblance}}<span style="font-size: 12px;">%</span></div>
                </div>
              </div>
            </div>
            <el-pagination
              v-show="pagination.total > 16"
              style="text-align: center"
              background
              @current-change="handleCurrentChange"
              :current-page="pagination.pageNum"
              layout="prev, pager, next"
              :total="pagination.total">
            </el-pagination>
          </vue-scroll>
        </div>
      </div>
    </div>
    <!--历史记录弹窗-->
    <el-dialog
      :visible.sync="historyPicDialog"
      class="history-pic-dialog"
      :close-on-click-modal="false"
      top="4vh"
      title="最近上传的图片">
      <div style="text-align: center;font-size: 20px;" v-if="loadingHis"><i class="el-icon-loading"></i></div>
      <vue-scroll class="his-pic-box" v-else-if="historyPicList.length">
        <div class="his-pic-item" :class="{'active': item.checked}" v-for="item in historyPicList" :key="item.id" @click="chooseHisPic(item)">
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
    <!--检索详情弹窗-->
    <el-dialog
      :visible.sync="strucDetailDialog"
      class="struc_detail_dialog"
      :close-on-click-modal="false"
      top="4vh"
      :show-close="false">
      <div class="struc_tab">
        <span>检索详情</span>
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <div class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.upPhotoUrl" alt="">
            <span>上传图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img :src="sturcDetail.photoUrl" alt="">
            </div>
            <div class="struc_c_d_info">
              <h2>{{sturcDetail.name}}<div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? sturcDetail.semblance : 98.32}}<span style="font-size: 12px;">%</span></div></h2>
              <div class="struc_cdi_line">
                <span>待查字典</span>
                <span>待查字典</span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.birthDate}}</span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.idNo}}<i class="vl_icon vl_icon_retrieval_01"></i></span>
              </div>
              <div class="struc_cdi_line">
                <span :title="sturcDetail.remarks" style="height: auto;white-space: normal">{{sturcDetail.remarks ? sturcDetail.remarks.length > 74 ? (sturcDetail.remarks.slice(0, 74) + '...') : sturcDetail.remarks : ''}}</span>
              </div>
              <div class="struc_cdi_line"></div>
            </div>
            <span>布控库信息</span>
          </div>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="height: .88rem;width: 50%;padding-right: .02rem;" :src="item.upPhotoUrl" alt="">
              <img style="height: .88rem;width: 50%;padding-left: .02rem;" :src="item.photoUrl" alt="">
              <div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_05"  :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? item.semblance : 92}}<span style="font-size: 12px;">%</span></div>
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {ajaxCtx} from '@/config/config';
import {ScpGETPortraitInfo, ScpGETretrievalHisById} from '../../api/api.search.js';
import {JtcPOSTAppendixInfo, JtcGETAppendixInfoList, JtcPUTAppendixsOrder} from '../../api/api.judge.js';
export default {
  data() {
    return {
      swiperOption: {
        slidesPerView: 5,
        spaceBetween: 10,
        slidesPerGroup: 5,
        loop: false,
        slideToClickedSlide: true,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      pagination: { total: 0, pageSize: 16, pageNum: 1 },
      uploadAcion: ajaxCtx.base + '/new',
      searching: false,
      curImageUrl: '', // 当前上传的图片
      curImgNum: 0, // 当前图片数量
      uploading: false, // 是否上传中
      uploadFileList: [],
      imgList: ['', '', ''],
      historyPicList: [], // 上传历史记录
      loadingHis: false,
      searchData: {
        time: null,
        minSemblance: null, // 最小相似度
        devIds: [] // 设备列表
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
      historyPicDialog: false,
      strucInfoList: [], // 检索抓拍信息
      curImgIndex: 0,
      sturcDetail: {},
      strucDetailDialog: false
    }
  },
  computed: {
    choosedHisPic () {
      return this.historyPicList.filter(x => x.checked)
    }
  },
  mounted () {
    this.setDTime();
    if (this.$route.query.hisId) {
      ScpGETretrievalHisById(this.$route.query.hisId)
        .then(res => {
          if (res) {
            this.showSim = true;
            this.searchData.time = [res.data.startTime, res.data.endTime];
            this.searchData.minSemblance = res.data.minSemblance ? res.data.minSemblance : '';
            this.curImgNum = res.data.retrievalPicList.length;
            res.data.retrievalPicList.forEach((x, index) => {
              this.imgList[index] = x;
              if ((index + 1) === res.data.retrievalPicList.length) {
                this.curImageUrl = x.path;
              }
            })
          }
          this.tcDiscuss(true);
        })
    }
  },
  methods: {
    drag (ev) {
      ev.dataTransfer.setData("Text",ev.target.currentSrc);
    },
    drop (e) {
      let x = {
        contentUid: this.$store.state.loginUser.uid,
        cname: '拖拽图片' + Math.random(),
        filePathName: '拖拽图片' + Math.random(),
        path: e.dataTransfer.getData("Text")
      }
      if (this.curImgNum >= 3) {
        this.$message.error('最多上传3张，请先删掉再上传');
        return;
      }
      this.curImgNum++;
      JtcPOSTAppendixInfo(x).then(jRes => {
        if (jRes) {
          x['uid'] = jRes.data;
          console.log(x);
        }
      })
      for (let i = 0; i < this.imgList.length; i++) {
        if (!this.imgList[i]) {
          this.imgList.splice(i, 1, x);
          break;
        }
      }
      this.showCurImg();
    },
    allowDrop (e) {
      e.preventDefault();
    },
    // 上传图片
    uploadPicExceed () {
      this.$message.warning('当前限制选择 3 个文件，请删除后再上传！');
    },
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
    uploadSucess (response, file, fileList) {
      this.uploading = false;
      if (response && response.data) {
        if (this.curImgNum >= 3) {
          this.$message.error('最多上传3张，请先删掉再上传');
          return;
        }
        this.curImgNum++;
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
          for (let i = 0; i < this.imgList.length; i++) {
            if (!this.imgList[i]) {
              this.imgList.splice(i, 1, x);
              break;
            }
          }
          this.showCurImg();
        }
      }
      this.uploadFileList = fileList;
      console.log(fileList)
    },
    handleError () {
      this.uploading = false;
      this.$message.error('上传失败')
    },
    delPic (index) {
      this.curImgNum--;
      if (this.uploadFileList.length > index) {
        this.uploadFileList.splice(index, 1);
      } else {
        this.uploadFileList.splice(this.uploadFileList.length - 1, 1);
      }
      this.imgList.splice(index, 1, '');
      console.log(this.uploadFileList, index);
      if (this.curImgNum) {
        this.showCurImg();
      } else {
        this.curImageUrl = '';
      }
    },
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
    chooseHisPic (item) {
      if ((this.choosedHisPic.length + this.curImgNum) === 3 && !item.checked) {
        this.$message.error('最多上传3个图片')
      } else {
        item.checked = !item.checked;
      }
    },
    addHisToImg () {
      this.historyPicDialog = false;
      let _ids = [];
      this.choosedHisPic.forEach(x => {
        this.curImgNum++;
        _ids.push(x.uid)
        for (let i = 0; i < this.imgList.length; i++) {
          if (!this.imgList[i]) {
            this.imgList.splice(i, 1, x);
            break;
          }
        }
      })
      let _obj = {
        appendixInfoIds: _ids.join(',')
      }
      JtcPUTAppendixsOrder(_obj);
      this.showCurImg();
    },
    showCurImg () {
      if (this.imgList[this.curImgNum - 1].path && this.imgList[0].path) {
        this.curImageUrl = this.imgList[this.curImgNum - 1].path;
      } else {
        if (this.curImgNum === 2) {
          this.curImageUrl = this.imgList[2].path;
        } else {
          if (this.imgList[this.curImgNum - 1].path) {
            this.curImageUrl = this.imgList[this.curImgNum - 1].path;
          } else {
            this.curImageUrl = this.imgList[2].path ? this.imgList[2].path : this.imgList[1].path;
          }
        }
      }
    },
    setDTime () {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 15 * 24 * 3600 * 1000;
      let _s = new Date(curDate - curS).getFullYear() + '-' + (new Date(curDate - curS).getMonth() + 1) + '-' + new Date(curDate - curS).getDate();
      let _e = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      this.searchData.time = [_s, _e]
    },
    resetSearch () {
      this.searchData.targetType = 1;
      this.searchData.name = null;
      this.searchData.cardId = null;
      this.searchData.carNum = null;
      this.uploadFileList.splice(0, this.uploadFileList.length);
      this.imgList = ['', '', ''];
      this.curImageUrl = '';
      this.curImgNum = 0;
    },
    tcDiscuss () {
      if (this.curImgNum === 0) {
        this.$message.warning('请至少上传或选择一张图片')
        return false;
      }
      this.searching = true;
      this.$_showLoading({target: '.vl_jfo_event'});
      let _ids = [];
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      this.imgList.forEach(x => {
        if (x) {
          _ids.push(x.uid);
        }
      })
      if (_ids.length) {
        params['where.appendixIds'] = _ids.join(',');
      }
      ScpGETPortraitInfo(params).then(res => {
        this.$_hideLoading();
        if (res) {
          console.log(res);
          this.strucInfoList = res.data.list;
          this.pagination.pageNum = res.data.pageNum;
          this.pagination.total = res.data.total;
          this.searching = false;
        } else {
          this.searching = false;
        }
      }).catch(() => {
        this.searching = false;
      })
      console.log(this.searchData.time)
    },
    showStrucInfo (data, index) {
      this.curImgIndex = index;
      this.strucDetailDialog = true;
      this.sturcDetail = data;
    },
    imgListTap (data, index) {
      this.curImgIndex = index;
      this.sturcDetail = data;
    },
    handleCurrentChange (e) {
      this.pagination.pageNum = e;
      this.tcDiscuss();
    }
  },
  watch: {
  }
}
</script>
<style lang="scss">
  .camera-select {
    .el-select-dropdown {
      display: none;
    }
    .el-select__tags {
      >span {
        white-space: nowrap;
        display: block;
        width: 100%;
        overflow: hidden;
      }
    }
  }
  .cap_info_win {
    background: #FFFFFF;
    padding: .18rem;
    font-size: .14rem;
    color: #666666;
    position: relative;
    &:after {
      display: block;
      content: '';
      border: .1rem solid #FFFFFF;
      border-color: #FFFFFF transparent transparent;
      position: absolute;
      bottom: -.2rem;
      left: calc(50% - .05rem);
    }
  }
  .struc_c_video {
    .struc_c_d_box {
      background: #E9E7E8;
      height: 100%;
      text-align: center;
      &:hover {
        .play_btn {
          display: block!important;
        }
      }
      .play_btn {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background: rgba(0, 0, 0, .4);
        width: 1rem;
        height: 1rem;
        text-align: center;
        line-height: 1rem;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        cursor: pointer;
        i {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          height: 22px!important;
        }
      }
      >video {
        width: auto;
        height: 100%;
      }
      &:after {
        content: none!important;
      }
      &:before {
        content: none!important;
      }
      -webkit-box-shadow: 0 0 0!important;
      -moz-box-shadow: 0 0 0!important;
      box-shadow: 0 0 0!important;
    }
    .download_btn {
      text-align: center;
      width: 1.1rem;
      height: .4rem;
      float: right!important;
      margin-top: .2rem;
      background: rgba(246,248,249,1);
      border: 1px solid rgba(211,211,211,1);
      border-radius: 4px;
      line-height: .4rem;
      cursor: pointer;
      color: #666666;
      &:hover {
        color: #FFFFFF;
        background: #0C70F8;
        border-color: #0C70F8;
      }
    }
  }
</style>