<template>
  <div class="vl_judge_tc">
    <div class="vl_j_left">
      <div class="vl_jtc_target_type">
        <el-radio v-model="targetType" label="1">人像抓拍</el-radio>
        <el-radio v-model="targetType" label="2">车像抓拍</el-radio>
      </div>
      <div class="vl_jtc_img_box">
        <div class="vl_jtc_upload_img" :style="{}" @drop="drop($event)" @dragover="allowDrop($event)">
          <el-upload
            :class="{'vl_jtc_upload': true}"
            :limit="3"
            multiple
            :show-file-list="false"
            accept="image/*"
            :action="uploadAcion"
            list-type="picture-card"
            @drop="drop($event)"
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
        <div><el-input style="width: 1.36rem" oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 100)value = 100" v-model="searchData.minSemblance" placeholder="相似度"></el-input> - 100</div>
        <el-select
          v-model="devIdData"
          multiple
          class="camera-select"
          @remove-tag="removeCamera"
          @click.native="vChange"
          collapse-tags
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
        <div style="text-align: center">
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="primary" :loading="searching" @click="tcDiscuss(false)">确定</el-button>
        </div>
      </div>
    </div>
    <div class="vl_s_right">
      <div class="vl_jig_right">
        <div class="vl_jig_right_title">
          <div class="vl_jr_t_item">
            <span><span style="color: #333333">检索结果 </span> ({{strucInfoList.length}})</span>
            <div :class="{'active-item': stucOrder < 3}" @click="timeOrderS">时间排序 <span><i :class="{'active': stucOrder === 2}" class="el-icon-caret-top"></i><i :class="{'active': stucOrder === 1}" class="el-icon-caret-bottom"></i></span></div>
          </div>
          <div class="vl_jr_t_item">
            <div :class="{'active-item': stucOrder === 3}" @click="stucOrder = 3">监控排序</div>
            <div :class="{'active-item': stucOrder === 4}" @click="stucOrder = 4" v-show="showSim" style="margin-left: .1rem;">相似度排序</div>
          </div>
        </div>
        <div class="vl_jfo_event">
          <vue-scroll>
            <div class="vl_jfo_event_box clearfix">
              <div class="vl_jfo_box_item" v-for="(item, index) in strucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
                <div class="vl_jfo_i_left"><img title="可以试着把我拖拽到左侧上传图片处" draggable="true" @dragstart="drag($event)" :src="item.photoPath" alt=""></div>
                <div class="vl_jfo_i_right">
                  <p>检索资料</p>
                  <div class="vl_jfo_line" :title="item.shotTime"><i class="vl_icon vl_icon_retrieval_01"></i>{{item.shotTime}}</div>
                  <div class="vl_jfo_line"><i class="vl_icon vl_icon_retrieval_02"></i>{{item.deviceName}}</div>
                  <div class="vl_jfo_sim"  v-show="showSim"><i class="vl_icon vl_icon_retrieval_03"></i>{{item.semblance}}<span style="font-size: 12px;">%</span></div>
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
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="showSim ? sturcDetail.uploadPath : sturcDetail.panoramaPath" alt="">
            <span>{{showSim ? '上传图' : '全景图'}}</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img :src="sturcDetail.photoPath" alt="">
              <i v-show="showSim">全景图</i>
            </div>
            <div class="struc_c_d_info">
              <h2>对比信息<div class="vl_jfo_sim"  v-show="showSim"><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? sturcDetail.semblance : 98.32}}<span style="font-size: 12px;">%</span></div></h2>
              <div class="struc_cdi_line">
                <span>青年</span>
                <span>女性</span>
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
            <img :src="sturcDetail.photoPath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <video id="capVideo" :src="sturcDetail.uploadPath"></video>
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
              <img style="width: 100%; height: .88rem;" :src="item.photoPath" alt="">
              <div class="vl_jfo_sim"  v-show="showSim"><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? item.semblance : 92}}<span style="font-size: 12px;">%</span></div>
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
  let AMap = window.AMap;
  import {ajaxCtx} from '@/config/config';
  import {ScpGETstrucInfoList, ScpGETdeviceListById, ScpGETretrievalHisById} from '../../api/api.search.js';
  import {JtcPUTAppendixsOrder, JtcPOSTAppendixInfo, JtcGETAppendixInfoList } from '../../api/api.judge'
  export default {
    data() {
      return {
        targetType: '1',
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
        pagination: { total: 0, pageSize: 16, pageNum: 1 },
        uploadAcion: ajaxCtx.base + '/new',
        mapData: [],
        searching: false,
        curImageUrl: '', // 当前上传的图片
        curImgNum: 0, // 当前图片数量
        uploading: false, // 是否上传中
        uploadFileList: [],
        imgList: ['', '', ''],
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
        amap: null, // 地图实例
        markerPoint: null, // 地图点集合
        InfoWindow: null,
        curVideoUrl: '',
        playing: false, // 视频播放是否
        historyPicDialog: false,
        stucOrder: 2, // 1升序，2降序，3监控，4相似度
        showSim: false, // 展示相似度排序
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
                  res.data.retrievalDevList.forEach(x => {
                    this.defaultTreeKes.push(x.uid)
                  })
                  this.defaultTreeKes = [3];
                }
                this.tcDiscuss(true);
              })
        } else {
          this.tcDiscuss(true);
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
        this.uploadFileList.splice(0, this.uploadFileList.length);
        this.imgList = ['', '', ''];
        this.curImageUrl = '';
        this.curImgNum = 0;
      },
      tcDiscuss (boolean) {
        if (!boolean) {
          if (this.curImgNum === 0) {
            this.$message.warning('请至少上传或选择一张图片')
            return false;
          }
          this.searching = true;
          this.showSim = true;
        }
        this.$_showLoading({target: '.vl_jfo_event'});
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
          'where.sortType': this.stucOrder,
          'where.startTime': this.searchData.time[0],
          'where.endTime': this.searchData.time[1],
          'where.targetType': this.targetType * 1
        }
        if (this.searchData.minSemblance) {
          params['where.minSemblance'] = this.searchData.minSemblance;
        }
        if (devIds.length) {
          params['where.devIds'] = devIds.join(',');
        }
        this.imgList.forEach(x => {
          if (x) {
            _ids.push(x.uid);
          }
        })
        if (_ids.length && this.showSim) {
          params['where.appendixIds'] = _ids.join(',');
        }
        ScpGETstrucInfoList(params).then(res => {
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
          position: [data.longitude, data.latitude], // 基点位置 [116.397428, 39.90923]
          offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        this.amap.setZoomAndCenter(16, [data.longitude, data.latitude]); // 自适应点位置
        let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
        this.infoWindow = new AMap.InfoWindow({
          map: this.amap,
          isCustom: true,
          closeWhenClickMap: false,
          position: [data.longitude, data.latitude],
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
  .vl_jtc_target_type {
    position: absolute;
    z-index: 9;
    top: 4px;
    .is-checked {
      .el-radio__label{
        color: #0C70F8!important;
      }
    }
    .el-radio__label {
      padding-left: 0px;
    }
    .el-radio {
      margin-right: 0;
      width: 1.16rem;
      text-align: center;
    }
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
</style>