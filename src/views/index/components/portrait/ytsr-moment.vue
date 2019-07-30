<template>
  <div class="vl_judge_tc_ytsr">
    <div class="">
      <div is="vlBreadcrumb"
           :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '以图搜人'}]">
      </div>
    </div>
    <div class="vl_j_left">
      <div class="vl_jtc_img_box">
        <div style="margin-left: 17px;" class="vl_judge_tc_c_item"  @drop="drop($event)" @dragover="allowDrop($event)">
          <el-upload
            :class="{'vl_jtc_upload_ytsr': true}"
            :show-file-list="false"
            accept="image/*"
            :action="uploadAcion"
            list-type="picture-card"
            @drop="drop($event)"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSucess"
            :on-error="handleError">
            <i v-if="uploading" class="el-icon-loading"></i>
            <img v-else-if="curImageUrl" :src="curImageUrl">
            <i style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;" class="vl_icon vl_icon_vehicle_01" v-else></i>
          </el-upload>
          <p @click="showHistoryPic">从上传记录中选择</p>
        </div>
      </div>
      <div class="per_semblance_ytsr"><span>相似度：≥</span><el-input oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 100)value = 100" placeholder="填写相似度数字" v-model="searchData.minSemblance"></el-input>%</div>
      <div class="vl_jtc_search">
        <div style="text-align: center;margin-bottom: 0px;">
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="primary" :loading="searching" @click="tcDiscuss(false)">确定</el-button>
        </div>
      </div>
    </div>
    <div class="vl_s_right">
      <template v-if="strucInfoList && strucInfoList.length > 0">
        <div class="vl_jig_right">
          <div class="vl_jig_right_title">
            <div class="vl_jr_t_item">
              <span><span style="color: #333333">检索结果 </span> ({{strucInfoList.length}})</span>
            </div>
          <div class="vl_jfo_event">
            <vue-scroll>
              <div class="vl_jfo_event_box clearfix">
                <div class="vl_jfo_box_item" v-for="(item, index) in strucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
                  <div class="vl_jfo_i_left"><img title="可以试着把我拖拽到左侧上传图片处" draggable="true" @dragstart="drag($event)" :src="item.photoUrl" alt=""></div>
                  <div class="vl_jfo_i_right">
                    <p>检索资料</p>
                    <div class="vl_jfo_line"><span>{{item.name}}</span></div>
                    <br>
                    <div class="vl_jfo_line"><span>{{item.originBank}}</span></div>
                    <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_03"></i>{{(item.semblance*1).toFixed(2)}}<span style="font-size: 12px;">%</span></div>
                  </div>
                </div>
              </div>
              <el-pagination
                      v-show="pagination.total > 12"
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
      </template>
      <template v-else>
        <div is="noResult" :isInitPage="isInitPage"></div>
      </template>
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
            class="struc_detail_dialog_ytsr"
            :close-on-click-modal="false"
            top="4vh"
            :show-close="false">
      <div class="struc_tab">
        <span >检索详情</span>
        <!-- <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span> -->
        <i style="font-size: 20px;" class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.upPhotoUrl" alt="">
            <span>上传图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img :src="sturcDetail.photoUrl" alt="">
              <span>布控库图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>{{sturcDetail.name}}<div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? (sturcDetail.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div></h2>
              <div class="struc_cdi_line">
                <span v-show="sturcDetail.sex">{{sturcDetail.sex}}</span>
                <span v-show="sturcDetail.nation">{{sturcDetail.nation}}</span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.birthDate}}</span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.idNo}}<i class="el-icon-postcard"></i></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.group}}</span>
              </div>
              <div class="struc_cdi_line"></div>
            </div>
            <span>布控库信息</span>
          </div>
        </div>
        <!--<div v-show="strucCurTab === 2" class="struc_c_address"></div>-->
        <!--<div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">-->
        <!--<div class="struc_c_d_qj struc_c_d_img">-->
        <!--<img :src="sturcDetail.subStoragePath" alt="">-->
        <!--<span>抓拍图</span>-->
        <!--</div>-->
        <!--<div class="struc_c_d_box">-->
        <!--<video id="capVideo" :src="sturcDetail.videoPath"></video>-->
        <!--<div class="play_btn" @click="videoTap" v-show="!playing">-->
        <!--<i class="vl_icon vl_icon_judge_01" v-if="playing"></i>-->
        <!--<i class="vl_icon vl_icon_control_09" v-else></i>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="download_btn"><a download="视频" :href="videoUrl"></a>下载视频</div>-->
        <!--</div>-->
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="height: .88rem;width: 50%;padding-right: .02rem;" :src="item.upPhotoUrl" alt="">
              <img style="height: .88rem;width: 50%;padding-left: .02rem;" :src="item.photoUrl" alt="">
              <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? (item.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div>
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
  import vlBreadcrumb from '@/components/common/breadcrumb.vue';
  import noResult from '@/components/common/noResult.vue';
  import { formatDate } from "@/utils/util.js";
  import {ajaxCtx} from '@/config/config';
  import { MapGETmonitorList } from "../../api/api.map.js";
  import { PortraitPostByphotoTask, PortraitPostByphotoRealtime } from '@/views/index/api/api.portrait.js';
  import { ScpGETdeviceListById, ScpGETretrievalHisById} from '../../api/api.search.js';
  import {JtcPUTAppendixsOrder, JtcPOSTAppendixInfo, JtcGETAppendixInfoList } from '../../api/api.judge'
  import { getPeopleTaskDetail } from '@/views/index/api/api.analysis.js';
  export default {
    components: {vlBreadcrumb, noResult},
    data() {
      return {
        isInitPage: true,
        targetType: 2,
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
        pagination: { total: 0, pageSize: 12, pageNum: 1 },
        uploadAcion: ajaxCtx.base + '/new',
        searching: false,
        curImageUrl: '', // 当前上传的图片
        uploading: false, // 是否上传中
        imgList: '',
        historyPicDialog: false,
        historyPicList: [], // 上传历史记录
        loadingHis: false,
        searchData: {
          minSemblance: 85, // 最小相似度
        },
        stucOrder: 4, // 1升序，2降序，3监控，4相似度
        strucInfoList: [], // 检索抓拍信息
        strucCurTab: 1,
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
      if (this.$route.query.imgurl) {
        let x = {
          contentUid: this.$store.state.loginUser.uid,
          cname: '带图' + Math.random(),
          filePathName: '带图' + Math.random(),
          path: this.$route.query.imgurl
        }
        JtcPOSTAppendixInfo(x).then(jRes => {
          if (jRes) {
            x['uid'] = jRes.data;
            console.log(x);
          }
        })
        this.imgList = x;
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
        JtcPOSTAppendixInfo(x).then(jRes => {
          if (jRes) {
            x['uid'] = jRes.data;
            console.log(x);
          }
        })
        this.imgList = x;
        this.curImageUrl = x.path;
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
            this.imgList = x;
            this.curImageUrl = x.path;
          }
        }
        console.log(fileList)
      },
      handleError () {
        this.uploading = false;
        this.$message.error('上传失败')
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
        this.historyPicList.forEach(x => x.checked = false)
        item.checked = true;
      },
      addHisToImg () {
        this.historyPicDialog = false;
        let _ids = [];
        this.choosedHisPic.forEach(x => {
          _ids.push(x.uid)
          this.imgList = x;
          this.curImageUrl = x.path;
        })
        let _obj = {
          appendixInfoIds: _ids.join(',')
        }
        JtcPUTAppendixsOrder(_obj);
      },
      resetSearch () {
        this.searchData.minSemblance = 85;
        this.imgList = '';
        this.curImageUrl = '';
        this.isInitPage = false;
      },
      tcDiscuss (boolean) {
        let params = {
          taskType: 2,
        }
        if (!this.imgList) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('请上传图片')
          }
          return false;
        } else {
          params['appendixIds'] = this.imgList.uid;
          params['uploadImgUrls'] = this.imgList.path;
        }
        if (!boolean) {
          this.searching = true;
        }
        if (this.searchData.minSemblance) {
          params['minSemblance'] = this.searchData.minSemblance;
        } else {
          params['minSemblance'] = 0;
        }
        PortraitPostByphotoRealtime(params)
          .then(sRes => {
            if (sRes) {
              this.$set(sRes.data, 'taskResult', JSON.parse(sRes.data.taskResult));
              this.$set(sRes.data, 'taskWebParam', JSON.parse(sRes.data.taskWebParam));
              // res.data.taskResult.push(...res.data.taskResult)
              this.pagination.total = sRes.data.taskResult ? sRes.data.taskResult.length : 0;
              this.strucInfoList = sRes.data.taskResult;
              this.taskDetail = sRes.data.taskWebParam;
              console.log(sRes.data)
              this.searching = false;
              this.isInitPage = false;
            }
          })
        /* PortraitPostByphotoTask(params).then(res => {
          if (res) {
            getPeopleTaskDetail(res.data)
                .then(sRes => {
                  if (sRes) {
                    this.$set(sRes.data, 'taskResult', JSON.parse(sRes.data.taskResult));
                    this.$set(sRes.data, 'taskWebParam', JSON.parse(sRes.data.taskWebParam));
                    // res.data.taskResult.push(...res.data.taskResult)
                    this.pagination.total = sRes.data.taskResult ? sRes.data.taskResult.length : 0;
                    this.strucInfoList = sRes.data.taskResult;
                    this.taskDetail = sRes.data.taskWebParam;
                    console.log(sRes.data)
                    this.searching = false;
                    this.isInitPage = false;
                  }
                })
          } else {
            this.searching = false;
          }
        }).catch(() => {
          this.searching = false;
        }) */
      },
      showStrucInfo (data, index) {
        this.curImgIndex = index;
        this.strucDetailDialog = true;
        this.sturcDetail = data;
        console.log(JSON.stringify(data) , 'data')
      },
      imgListTap (data, index) {
        this.curImgIndex = index;
        this.sturcDetail = data
      },
      handleCurrentChange (e) {
        this.pagination.pageNum = e;
        this.tcDiscuss(true);
      }
    },
    watch: {
    }
  }
</script>
<style lang="scss">
  .breadcrumb_heaer {
    background: #ffffff;
    border-bottom: 1px solid #D3D3D3;
  }
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
  .vl_judge_tc_ytsr {
    width: 100%;
    height: 100%;
    .vl_j_left {
      float: left;
      width: 272px;
      padding-top: 20px;
      height: calc(100% - 56px);
      min-height: 763px;
      background: #ffffff;
      box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
      animation: fadeInLeft .4s ease-out .3s both;
      .vl_jtc_img_box {
        width: 100%;
        height: auto;
        border-bottom: 1px solid #D3D3D3;
        padding-bottom: 30px;
        margin-bottom: 30px;
        .vl_judge_tc_c_item {
          width: 238px;
          height: 238px;
          display: inline-block;
          position: relative;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          border-radius: 10px;
          cursor: pointer;
          background: #f2f2f2;
          &:first-child {
            margin-right: .15rem;
          }
          &:last-child {
            margin-left: .15rem;
          }
          &:hover {
            background: #2981F8;
            >p {
              display: block;
            }
          }
          .vl_jtc_upload_ytsr {
            width: 100%;
            height: 100%;
            background: none;
            .el-upload--picture-card {
              border: none;
            }
            .el-upload {
              width: 100%;
              height: 100%;
              background: none;
              line-height: 238px;
              img {
                width: 100%;
                height: 100%;
                -webkit-border-radius: 10px;
                -moz-border-radius: 10px;
                border-radius: 10px;
              }
            }
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
          .vl_jtc_ic_input {
            position: absolute;
            top: .2rem;
            width: 3rem;
            height: .26rem;
            left: .2rem;
            border: 1px solid #D3D3D3;
            -webkit-border-radius: .13rem;
            -moz-border-radius: .13rem;
            border-radius: .13rem;
            padding: 0 .02rem;
            background: #FFFFFF;
            .el-form-item__content {
              height: .23rem;
              line-height: .23rem;
            }
            input {
              border: none!important;
              height: .23rem;
              line-height: .23rem;
            }
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
        .vl_jtc_img_list {
          width: 100%;
          margin-top: 10px;
          text-align: center;
          .middle_img {
            display: inline-block;
          }
          > div {
            width: 30%;
            padding-top: 30%;
            border: 1px dashed #D3D3D3;
            position: relative;
            &:hover {
              .del_mask {
                display: block;
              }
            }
            &:last-child {
              float: right;
            }
            &:first-child {
              float: left;
            }
            .del_mask {
              display: none;
              position: absolute;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, .2);
              top: 0;
              > i {
                cursor: pointer;
                display: block;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                color: #ffffff;
                width: 16px;
                height: 16px;
                text-align: center;
              }
            }
            > img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .vl_jtc_search {
        width: 100%;
        height: auto;
        padding: 30px 0 20px 0;
        .el-input__inner {
          height: 40px!important;
          line-height: 40px!important;
        }
        .el-input__icon {
          height: 40px!important;
          line-height: 40px!important;
        }
        .el-range-editor {
          width: 100%;
          /*padding: 0;*/
          > .el-range__close-icon {
            display: none;
          }
          > input {
            width: 50%;
          }
          /*.el-range-separator {*/
          /*height: 40px;*/
          /*line-height: 40px;*/
          /*width: 10px;*/
          /*padding: 0;*/
          /*}*/
        }
        button {
          width: 110px;
          height: 40px;
          line-height: 40px;
          padding: 0 12px;
        }
        .el-select {
          margin-bottom: 10px;
        }
        > div {
          margin-bottom: 10px;
        }
        .vl_jtc_search_item {
          height: 217px;
          .camera-tree {
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            background-color: #fff;
            -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            -webkit-box-sizing: border-box;
          }
        }
      }
    }
    .vl_s_right {
      display: inline-block;
      width: calc(100% - 272px);
      height: calc(100% - 60px);
      position: relative;
      .vl_jig_right {
        width: 100%;
        height: 100%;
        padding: 0 20px;
        padding-right: 0;
        .vl_jig_right_title {
          width: 100%;
          color: #999999;
          .vl_jr_t_item {
            float: left;
            width: 50%;
            height: 70px;
            line-height: 70px;
            text-align: left;
            padding-left: 10px;
            >div {
              cursor: pointer;
              display: inline-block;
            }
            .active-item {
              color: #2580FC;
              i {
                color: #999999;
              }
              .active {
                color: #2580FC;
              }
            }
            &:first-child {
              padding-right: 10px;
              padding-left: 0;
              >div {
                float: right;
                span {
                  display: inline-block;
                  vertical-align: middle;
                  i {
                    display: block;
                    font-size: 10px;
                  }
                }
              }
            }
          }
        }
        .vl_jfo_event {
          height: calc(100% - 70px);
          min-height: 693px;
          .vl_jfo_event_box {
            width: 100%;
            height: auto;
            .vl_jfo_box_item {
              float: left;
              cursor: pointer;
              width: 387px;
              height: 203px;
              padding: 20px;
              margin-right: 20px;
              margin-bottom: 20px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
              .vl_jfo_i_left {
                float: left;
                width: 163px;
                height: 163px;
                >img {
                  width: 100%;
                  height: 100%;
                }
              }
              .vl_jfo_i_right {
                width: calc(100% - 163px);
                height: 100%;
                margin-left: 163px;
                padding-left: 10px;
                >p {
                  color: #999999;
                  margin-bottom: 13px;
                }
                .vl_jfo_line {
                  position: relative;
                  max-width: 100%;
                  display: inline-block;
                  height: 28px;
                  line-height: 28px;
                  margin-bottom: 8px;
                  border: 1px solid #F2F2F2;
                  background: #FAFAFA;
                  color: #333333;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  border-radius:3px;
                  font-size: 12px;
                  overflow: hidden;
                  padding-right: 4px;
                  > i {
                    vertical-align: middle;
                  }
                  span {
                    padding: 0 4px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .vl_jfo_sim {
      color: #0C70F8;
      font-weight: bold;
      font-size: 24px;
      margin-top: -4px;
      i {
        vertical-align: text-top;
        margin-right: 10px;
      }
      span {
        font-weight: normal;
      }
    }
    .vl_j_fullscreen {
      position: fixed;
      width: 100%!important;
      height: 100%!important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #000000;
      z-index: 9999;
      -webkit-transition: all .4s;
      -moz-transition: all .4s;
      -ms-transition: all .4s;
      -o-transition: all .4s;
      transition: all .4s;
      > video {
        width: 100%;
        height: 100%;
      }
      > .control_bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 48px;
        background: rgba(0, 0, 0, .65);
        > div {
          float: left;
          width: 50%;
          height: 100%;
          line-height: 48px;
          text-align: right;
          padding-right: 20px;
          color: #FFFFFF;
          &:first-child {
            text-align: left;
            padding-left: 20px;
          }
          > span {
            display: inline-block;
            height: 22px;
            margin-left: 10px;
            vertical-align: middle;
            cursor: pointer;
            a {
              font-size: 25px;
              text-decoration: none;
              color: #ffffff;
              vertical-align: top;
            }
          }
        }
      }
    }
    .vl_j_cutscreen {
      position: fixed;
      width: 90%!important;
      height: 90%!important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #FFFFFF;
      z-index: 9999;
      -webkit-transition: all .4s;
      -moz-transition: all .4s;
      -ms-transition: all .4s;
      -o-transition: all .4s;
      transition: all .4s;
      padding: 20px;
      margin: auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .close_btn {
      position: absolute;
      top: 30px;
      right: 30px;
      font-size: .3rem;
      cursor: pointer;
      &:hover {
        color: #409EFF;
      }
    }
    .vl_jtc_mk {
      width: 2.18rem;
      height: 1.22rem;
      position: relative;
      > video {
        width: 100%;
        height: 100%;
      }
      > p {
        position: absolute;
        color: #FFFFFF;
        bottom: .08rem;
        font-size: .12rem;
        padding-left: .06rem;
      }
    }
    .vl_jtc_mk_check {
      > input {
        position: absolute;
        top: .08rem;
        right: .08rem;
        &:after {
          position: absolute;
          width: 14px;
          height: 14px;
          top: 0;
          content: '';
          background-color: #FFFFFF;
          color: #fff;
          display: block;
          border: 1px solid #409EFF;
          line-height: 11px;
          text-align: center;
          border-radius: 3px;
        }
      }
      > input:checked {
        &:after {
          background-color: #409EFF;
          content: '✓';
          font-size: 10px;
        }
      }
    }
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
    .struc_detail_dialog_ytsr {
      .el-dialog {
        max-width: 13.06rem;
        width: 100%!important;
      }
      .el-dialog__header {
        display: none;
      }
      .struc_tab {
        height: 1.16rem;
        padding: .3rem 0;
        position: relative;
        color: #333333;
        span {
          display: inline-block;
          margin-right: .55rem;
          padding-bottom: .1rem;
          cursor: pointer;
        }
        .active {
          color: #0C70F8;
          border-bottom: 2px solid #0C70F8;
        }
        i {
          display: block;
          position: absolute;
          top: .3rem;
          right: 0px;
          cursor: pointer;
        }
      }
      .struc_main {
        width: 11.46rem;
        height: 4.4rem;
        margin: 0 auto;
        border-bottom: 1px solid #F2F2F2;
        .struc_c_detail {
          width:  100%;
          height: 3.6rem;
          >div {
            float: left;
          }
          .struc_c_d_img {
            width: 3.6rem;
            height: 3.6rem;
            background: #EAEAEA;
            position: relative;
            img {
              width: 100%;
              height: auto;
              max-height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
            }
            i {
              display: block;
              position: absolute;
              top: .1rem;
              right: .1rem;
              line-height: .26rem;
              height: .26rem;
              background: rgba(255, 255, 255, .8);
              border-radius: .13rem;
              font-style: normal;
              color: #0C70F8;
              font-size: 12px;
              padding: 0 .1rem;
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.5rem;
              left: -.5rem;
              transform: rotate(-45deg);
              border: .5rem solid #50CC62;
              border-color: transparent transparent #50CC62;
              z-index: 9;
            }
            span {
              display: block;
              position: absolute;
              top: .1rem;
              left: .1rem;
              width: .6rem;
              height: .6rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(-45deg);
              -moz-transform: rotate(-45deg);
              -ms-transform: rotate(-45deg);
              -o-transform: rotate(-45deg);
              transform: rotate(-45deg);
              z-index: 99;
            }
          }
          .struc_c_d_qj {
            margin-right: .3rem;
            &:before {
              border: .5rem solid #0c70f8;
              border-color: transparent transparent #0C70F8;
            }
          }
          .struc_c_d_box {
            width: calc(100% - 3.9rem);
            box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
            border-radius:1px;
            position: relative;
            overflow: hidden;
            >div {
              float: left;
            }
            .struc_c_d_info {
              width: calc(100% - 3.6rem);
              padding-left: .24rem;
              color: #333333;
              h2 {
                font-weight: bold;
                line-height: .74rem;
                padding-right: 1rem;
                .vl_jfo_sim {
                  color: #0C70F8;
                  font-weight: bold;
                  font-size: .24rem;
                  float: right;
                  i {
                    vertical-align: text-bottom;
                    margin-right: .1rem;
                  }
                  span {
                    font-weight: normal;
                  }
                }
              }
              .struc_cdi_line {
                >span {
                  /*position: relative;*/
                  max-width: 100%;
                  display: inline-block;
                  height: .3rem;
                  line-height: .3rem;
                  margin-bottom: .08rem;
                  border: 1px solid #F2F2F2;
                  background: #FAFAFA;
                  color: #333333;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  border-radius:3px;
                  font-size: 12px;
                  overflow: hidden;
                  padding: 0 .1rem;
                  margin-right: .08rem;
                  > i {
                    vertical-align: middle;
                    margin-left: .1rem;
                  }
                  font {
                    color: #999999;
                    margin-left: 20px;
                  }
                }
                p {
                  color: #999999;
                }
              }
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.7rem;
              right: -.7rem;
              transform: rotate(-46deg);
              border: .7rem solid #0c70f8;
              border-color: transparent transparent transparent #0C70F8;
            }
            &:after {
              display: block;
              content: '';
              position: absolute;
              top: -.4rem;
              right: -.4rem;
              transform: rotate(-45deg);
              border: .4rem solid #FFFFFF;
              border-color: transparent transparent transparent #FFFFFF;
            }
            >span {
              display: block;
              position: absolute;
              top: .19rem;
              right: .19rem;
              width: 1rem;
              height: 1rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(45deg);
              -moz-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              -o-transform: rotate(45deg);
              transform: rotate(45deg);
              z-index: 99;
            }
          }
        }
        .struc_c_address {
          height: 100%;
          #capMap {
            width:  100%;
            height: 100%;
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
            position: relative;
            &:hover {
              color: #FFFFFF;
              background: #0C70F8;
              border-color: #0C70F8;
            }
            a {
              display: block;
              position: absolute;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .struc-list {
        width: 12.46rem;
        margin: 0 auto;
        padding: .44rem 0 .34rem 0;
        .swiper-container {
          padding: .02rem .5rem;
          &:before {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            background: #FFFFFF;
            position: absolute;
            left: 0;
            z-index: 9;
            border: 1px solid #FFFFFF;
          }
          &:after {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            background: #FFFFFF;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 9;
            border: 1px solid #FFFFFF;
          }
          .swiper-button-next {
            right:  0;
          }
          .swiper-button-prev {
            left: 0;
          }
          .swiper-slide {
            .swiper_img_item {
              cursor: pointer;
              border: 1px solid #FFFFFF;
              padding: 2px;
              img {
                width: 100%;
                height: 100%;
              }
              .vl_jfo_sim {
                font-size: .14rem;
                height: .3rem;
                margin-top: 0;
                /*display: inline-block;*/
                white-space: nowrap;
                text-align: center;
                color: #999999;
                i {
                  margin-right: 0;
                }
              }
            }
            .active {
              border-color: #0C70F8;
              box-shadow: inset 0px 3px 3px #c8c8c8;
              .vl_jfo_sim {
                color: #0C70F8;
              }
            }
          }
        }
      }
    }
  }
  .per_semblance_ytsr {
    position: relative;
    padding-left: 20px;
    >span {
      position: absolute;
      left: 20px;
      display: block;
      height: 40px;
      line-height: 40px;
      z-index: 9;
      color: #999999;
      width: 79px;
      padding-left: 12px;
    }
    >i {
      display: inline-block;
      width: 20px;
      height: 1px;
      background: #999;
      margin: 19px 16px;
      vertical-align: middle;
    }
    .el-input {
      width: 200px;
      margin-right: 10px;
      input{
        text-indent: 69px;
      }
    }
  }
</style>