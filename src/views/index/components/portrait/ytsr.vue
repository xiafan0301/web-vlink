<template>
  <div class="vl_judge_tc">
    <div class="">
      <div is="vlBreadcrumb"
           :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '以图搜人'}]">
      </div>
    </div>
    <div class="vl_j_left">
      <div class="vl_jtc_img_box">
        <div class="vl_jtc_upload_img" :style="{}" @drop="drop($event)" @dragover="allowDrop($event)">
          <el-upload
              :class="{'vl_jtc_upload_ytsr': true}"
              multiple
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
            <div v-else>
              <i
                style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;"
                class="vl_icon vl_icon_vehicle_01"
              ></i>
            </div>
          </el-upload>
          <p @click="showHistoryPic">从上传记录中选择</p>
        </div>
      </div>
      <div class="vl_jtc_search">
        <el-date-picker
          class="vl_date"
          v-model="searchData.time"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <div class="per_semblance"><span>相似度</span><el-input oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 100)value = 100" v-model="searchData.minSemblance"></el-input> <i></i> 100</div>
        <el-select
          v-model="devIdData"
          multiple
          class="camera-select"
          @remove-tag="removeCamera"
          @click.native="vChange"
          collapse-tags
          style="width: 100%"
          :popper-append-to-body="false"
          placeholder="选择监控">
          <el-option value="0" label=" "></el-option>
        </el-select>
        <div class="vl_jtc_search_item">
          <vue-scroll>
            <el-tree
                v-show="showCameraList"
                :data="cameraData"
                class="camera-tree"
                ref="cameraTree"
                :default-checked-keys="defaultTreeKes"
                @check-change="chooseCamera"
                show-checkbox
                node-key="deviceName"
                :props="defaultProps">
            </el-tree>
          </vue-scroll>
        </div>
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
              <div :class="{'active-item': stucOrder < 3}" @click="timeOrderS">时间排序 <span><i :class="{'active': stucOrder === 2}" class="el-icon-caret-top"></i><i :class="{'active': stucOrder === 1}" class="el-icon-caret-bottom"></i></span></div>
            </div>
            <div class="vl_jr_t_item">
              <div :class="{'active-item': stucOrder === 3}" @click="stucOrder = 3">监控排序</div>
              <div :class="{'active-item': stucOrder === 4}" @click="stucOrder = 4" style="margin-left: .1rem;">相似度排序</div>
            </div>
          </div>
          <div class="vl_jfo_event">
            <vue-scroll>
              <div class="vl_jfo_event_box clearfix">
                <div class="vl_jfo_box_item" v-for="(item, index) in strucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
                  <div class="vl_jfo_i_left"><img title="可以试着把我拖拽到左侧上传图片处" draggable="true" @dragstart="drag($event)" :src="item.subStoragePath" alt=""></div>
                  <div class="vl_jfo_i_right">
                    <p>检索资料</p>
                    <div class="vl_jfo_line" :title="item.shotTime"><i class="vl_icon vl_icon_retrieval_01"></i>{{item.shotTime}}</div>
                    <div class="vl_jfo_line"><i class="vl_icon vl_icon_retrieval_02"></i>{{item.deviceName}}</div>
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
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img :src="sturcDetail.storagePath" alt="">
              <span>全景图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>对比信息<div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? (sturcDetail.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div></h2>
              <div class="struc_cdi_line">
                <span v-show="sturcDetail.age">{{sturcDetail.age}}</span>
                <span v-show="sturcDetail.baby">{{sturcDetail.baby}}</span>
                <span v-show="sturcDetail.mask">{{sturcDetail.mask}}</span>
                <span v-show="sturcDetail.hat">{{sturcDetail.hat}}</span>
                <span v-show="sturcDetail.glasses">{{sturcDetail.glasses}}</span>
                <span v-show="sturcDetail.hair">{{sturcDetail.hair}}</span>
                <span v-show="sturcDetail.umberlla">{{sturcDetail.umberlla}}</span>
                <span v-show="sturcDetail.sex">{{sturcDetail.sex}}</span>
                <span v-show="sturcDetail.bottomType">{{sturcDetail.bottomColor}}{{sturcDetail.bottomType}}</span>
                <span v-show="sturcDetail.upperType">{{sturcDetail.upperColor}}{{sturcDetail.upperTexture}}{{sturcDetail.upperType}}</span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.shotTime}}<i class="vl_icon vl_icon_retrieval_01"></i></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.deviceName}}<i class="vl_icon vl_icon_retrieval_02"></i></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.address}}<i class="vl_icon vl_icon_retrieval_04"></i></span>
              </div>
              <div class="struc_cdi_line"></div>
            </div>
            <span>抓拍信息</span>
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address"></div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <video id="capVideo" :src="sturcDetail.videoPath"></video>
            <div class="play_btn" @click="videoTap" v-show="!playing">
              <i class="vl_icon vl_icon_judge_01" v-if="playing"></i>
              <i class="vl_icon vl_icon_control_09" v-else></i>
            </div>
          </div>
          <div class="download_btn"><a download="视频" :href="videoUrl"></a>下载视频</div>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="width: 100%; height: .88rem;" :src="item.subStoragePath" alt="">
              <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? (item.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div>
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
    <div id="capMap"></div>
  </div>
</template>
<script>
  import vlBreadcrumb from '@/components/common/breadcrumb.vue';
  import noResult from '@/components/common/noResult.vue';
  let AMap = window.AMap;
  import {ajaxCtx} from '@/config/config';
  import {ScpGETstrucInfoList, ScpGETdeviceListById, ScpGETretrievalHisById} from '../../api/api.search.js';
  import {JtcPUTAppendixsOrder, JtcPOSTAppendixInfo, JtcGETAppendixInfoList } from '../../api/api.judge'
  export default {
    components: {vlBreadcrumb, noResult},
    data() {
      return {
        isInitPage: true,
        targetType: 2,
        swiperOption: {
          slidesPerView: 10,
          spaceBetween: 18,
          slidesPerGroup: 10,
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
        mapData: [],
        searching: false,
        curImageUrl: '', // 当前上传的图片
        uploading: false, // 是否上传中
        imgList: '',
        historyPicList: [], // 上传历史记录
        loadingHis: false,
        cameraData: [],
        devIdData: [],
        showCameraList: false,
        defaultProps: {
          children: 'deviceBasicList',
          label: 'deviceName'
        },
        defaultTreeKes: [],
        searchData: {
          time: null,
          minSemblance: 85, // 最小相似度
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
        amap: null, // 地图实例
        markerPoint: null, // 地图点集合
        InfoWindow: null,
        curVideoUrl: '',
        playing: false, // 视频播放是否
        historyPicDialog: false,
        stucOrder: 4, // 1升序，2降序，3监控，4相似度
        strucInfoList: [], // 检索抓拍信息
        strucCurTab: 1,
        curImgIndex: 0,
        sturcDetail: {},
        strucDetailDialog: false,
        videoUrl: '' // 弹窗视频回放里的视频
      }
    },
    computed: {
      choosedHisPic () {
        return this.historyPicList.filter(x => x.checked)
      }
    },
    mounted () {
      this.setDTime();
      new Promise((resolve) => {
        this.getDeviceList(resolve);
      }).then(() => {
        if (this.$route.query.hisId) {
          ScpGETretrievalHisById(this.$route.query.hisId)
              .then(res => {
                if (res) {
                  this.searchData.time = [res.data.startTime, res.data.endTime];
                  this.searchData.minSemblance = res.data.minSemblance ? res.data.minSemblance : '';
                  res.data.retrievalPicList.forEach((x, index) => {
                    this.imgList = x;
                    if ((index + 1) === res.data.retrievalPicList.length) {
                      this.curImageUrl = x.path;
                    }
                  })
                  res.data.retrievalDevList.forEach(x => {
                    this.defaultTreeKes.push(x.uid)
                  })
                  this.defaultTreeKes = [3];
                }
                this.tcDiscuss(true);
              })
        } else {
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
        }
      })
      let map = new AMap.Map('capMap', {
        center: [112.974691, 28.093846],
        zoom: 16
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.amap = map;
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
      // 设备列表
      getDeviceList (cb) {
        let params = {
          id: 1
        }
        ScpGETdeviceListById(params)
            .then(res => {
              if (res) {
                this.cameraData = res.data.map(x => {
                  x['deviceName'] = x.groupName;
                  return x;
                })
                console.log(this.cameraData)
              }
              cb()
            })
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
      setDTime () {
        let date = new Date();
        let curDate = date.getTime();
        let curS = 1 * 24 * 3600 * 1000;
        let sM = '', sD = '';
        if ((new Date(curDate - curS).getMonth() + 1) < 10 ) {
          sM = '0' + (new Date(curDate - curS).getMonth() + 1);
        } else {
          sM = (new Date(curDate - curS).getMonth() + 1)
        }
        if ( new Date(curDate - curS).getDate() < 10 ) {
          sD = '0' +  new Date(curDate - curS).getDate();
        } else {
          sD =  new Date(curDate - curS).getDate()
        }
        let _s = new Date(curDate - curS).getFullYear() + '-' + sM + '-' + sD;
        let eM = '', eD = '';
        if ((date.getMonth() + 1) < 10 ) {
          eM = '0' + (date.getMonth() + 1);
        } else {
          eM = (date.getMonth() + 1)
        }
        if (date.getDate() < 10 ) {
          eD = '0' + date.getDate();
        } else {
          eD = date.getDate()
        }
        let _e = date.getFullYear() + '-' + eM + '-' + eD;
        this.searchData.time = [_s, _e];
      },
      vChange () {
        this.showCameraList = !this.showCameraList;
      },
      removeCamera (e) { // 有问题，摄像头名字是否会有相同的，
        for (let i = 0; i < this.cameraData.length; i++) {
          let _index = this.cameraData[i].deviceBasicList.findIndex(y => y.deviceName === e);
          if (_index !== -1) {
            this.$refs.cameraTree.setChecked(this.cameraData[i].deviceBasicList[_index].deviceName, false)
            break;
          }
        }
      },
      chooseCamera () {
        let obj = [];
        this.$refs.cameraTree.getCheckedNodes()
            .forEach(x => {
              if (!x.deviceBasicList) {
                obj.push(x.deviceName)
              }
            })
        this.devIdData = obj.splice(0, obj.length);
      },
      resetSearch () {
        this.$refs.cameraTree.setCheckedKeys([]);
        this.searchData.minSemblance = null;
        this.searchData.devIds = [];
        this.devIdData = [];
        this.imgList = '';
        this.curImageUrl = '';
        this.isInitPage = false;
      },
      tcDiscuss (boolean) {
        if (!this.imgList) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('请上传图片')
          }
          return false;
        }
        if (!boolean) {
          this.searching = true;
        }
        let _ids = [],devIds = [];
        let _arr = this.$refs.cameraTree.getCheckedNodes();
        _arr.forEach(x => {
          if (!x.deviceBasicList) {
            devIds.push(x.uid)
          }
        })
        let params = {
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
          where: {}
        }
        if (this.stucOrder === 1) {
          params['order'] = 'asc';
        } else {
          params['order'] = 'desc';
        }
        switch (this.stucOrder) {
          case 1:
            params['orderBy'] = 'shotTime';
            break;
          case 2:
            params['orderBy'] = 'shotTime';
            break;
          case 3:
            params['orderBy'] = 'deviceNamePinyin';
            break;
          case 4:
            params['orderBy'] = 'semblance';
            break;
        }
        params.where.startTime = this.searchData.time[0] + ' 00:00:00';
        params.where.endTime = this.searchData.time[1] + ' 23:59:59';
        params.where.targetType = this.targetType * 1;
        if (this.searchData.minSemblance) {
          params.where['minSemblance'] = this.searchData.minSemblance;
        } else {
          params.where['minSemblance'] = 0;
        }
        if (devIds.length) {
          params.where['deviceIds'] = devIds.join(',');
        }
        _ids.push(this.imgList.uid);
        if (_ids.length) {
          params.where['appendixIds'] = _ids.join(',');
        }
        ScpGETstrucInfoList(params).then(res => {
          if (res) {
            console.log(res);
            this.strucInfoList = res.data.list;
            console.log(JSON.stringify(this.strucInfoList), 'this.strucInfoList')
//            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
            this.searching = false;
            this.isInitPage = false;
          } else {
            this.searching = false;
          }
        }).catch(() => {
          this.searching = false;
        })
        console.log(this.searchData.time)
      },
      timeOrderS () {
        if (this.stucOrder > 2) {
          this.stucOrder = 2;
        } else {
          this.stucOrder === 1 ? this.stucOrder = 2 : this.stucOrder = 1;
        }
      },
      showStrucInfo (data, index) {
        this.curImgIndex = index;
        this.strucDetailDialog = true;
        this.sturcDetail = data;
        console.log(JSON.stringify(data) , 'data')
        this.drawPoint(data);
      },
      imgListTap (data, index) {
        this.curImgIndex = index;
        this.sturcDetail = data;
        this.drawPoint(data);
      },
      handleCurrentChange (e) {
        this.pagination.pageNum = e;
        this.tcDiscuss(true);
      },
      drawPoint (data) {
        this.$nextTick(() => {
          $('.struc_c_address').append($('#capMap'))
        })
        if (this.markerPoint) {
          this.amap.remove(this.markerPoint)
        }
        let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
        this.markerPoint = new AMap.Marker({ // 添加自定义点标记
          map: this.amap,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        this.amap.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
        let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
        this.infoWindow = new AMap.InfoWindow({
          map: this.amap,
          isCustom: true,
          closeWhenClickMap: false,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
          offset: new AMap.Pixel(0, -70),
          content: sConent
        })
      },
      videoTap () {
        let vDom = document.getElementById('capVideo')
        if (this.playing) {
          vDom.pause();
        } else {
          vDom.play();
        }
        vDom.addEventListener('ended', (e) => {
          e.target.currentTime = 0;
          this.playing = false;
        })
        this.playing = !this.playing;
      }
    },
    watch: {
      stucOrder () {
        this.tcDiscuss(true);
      },
      strucCurTab (e) {
        if (e === 2) {
          this.drawPoint(this.sturcDetail)
        } else if (e === 3) {
          this.videoUrl = document.getElementById('capVideo').src;
        }
      }
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
  .vl_judge_tc {
    width: 100%;
    height: 100%;
    .vl_j_left {
      float: left;
      width: 272px;
      padding-top: 20px;
      height: calc(100% - 56px);
      min-height: 763px;
      background: #ffffff;
      box-shadow:0px 0px 0px 0px rgba(131,131,131,0.28);
      animation: fadeInLeft .4s ease-out .3s both;
      .vl_jtc_img_box {
        width: 100%;
        height: auto;
        padding: 0 20px;
        border-bottom: 1px dashed #D3D3D3;
        padding-bottom: 44px;
        .vl_jtc_upload_img {
          position: relative;
          .vl_jtc_upload_ytsr {
            .el-upload--picture-card {
              width: 100%!important;
              padding-top: 100%!important;
              position: relative!important;
              > i {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
              }
              > img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                -webkit-border-radius: 6px;
                -moz-border-radius: 6px;
                border-radius: 6px;
              }
            }
          }
          > p {
            position: absolute;
            bottom: 7px;
            text-align: center;
            font-size: 14px;
            width: 100%;
            color: #0C70F8;
            &:hover {
              text-decoration: underline;
            }
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
        padding: 0 20px;
        padding-top: 40px;
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
          height: 140px;
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
          height: 70px;
          line-height: 70px;
          color: #999999;
          .vl_jr_t_item {
            float: left;
            width: 50%;
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
        color: #999999;
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
  .per_semblance {
    position: relative;
    >span {
      position: absolute;
      left: 20px;
      display: block;
      height: 40px;
      line-height: 40px;
      z-index: 9;
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
      width: 148px;
      input{
        text-indent: 60px;
      }
    }
  }
</style>