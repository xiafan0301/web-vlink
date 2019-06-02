<template>
  <div class="vl_judge_tc">
    <div class="vl_j_left">
      <div class="vl_jtc_img_box">
        <div class="vl_jtc_upload_img">
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
          <p style="color: #0C70F8;" @click="showHistoryPic">从上传记录中选择</p>
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
        <el-select v-model="searchData.targetType" @change="chooseType" placeholder="请选择">
          <el-option
            v-for="item in targetTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-autocomplete
          v-show="searchData.targetType === 1"
          v-model="searchData.name"
          :fetch-suggestions="autoEvent1"
          value-key="name"
          placeholder="输入姓名搜索">
        </el-autocomplete>
        <!--<el-input v-show="searchData.targetType === 1" v-model="searchData.name" placeholder="输入姓名搜索"></el-input>-->
        <el-autocomplete
          v-show="searchData.targetType === 1"
          v-model="searchData.cardId"
          :fetch-suggestions="autoEvent2"
          value-key="idNo"
          placeholder="输入证件号码搜索">
        </el-autocomplete>
        <!--<el-input v-show="searchData.targetType === 1" v-model="searchData.cardId" placeholder="输入证件号码搜索"></el-input>-->
        <el-autocomplete
          v-show="searchData.targetType === 2"
          v-model="searchData.carNum"
          :fetch-suggestions="autoEvent3"
          value-key="vehicleNumber"
          placeholder="输入车牌号码搜索">
        </el-autocomplete>
        <!--<el-input v-show="searchData.targetType === 2" v-model="searchData.carNum" placeholder="输入车牌号码搜索"></el-input>-->
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
        <el-button @click="resetSearch">重置</el-button>
        <el-button type="primary" :loading="searching" @click="tcDiscuss">{{searching ? '碰撞' : '碰撞分析'}}</el-button>
      </div>
    </div>
    <div class="vl_j_right">
      <div id="tcMap"></div>
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
    <div style="width: 0; height: 0;" v-show="showLarge" :class="{vl_j_fullscreen: showLarge}">
      <video id="vlJtcLargeV" src="http://www.w3school.com.cn/example/html5/mov_bbb.mp4"></video>
      <div @click="closeVideo" class="close_btn el-icon-error"></div>
      <div class="control_bottom">
        <div>{{mapData[curVideo.indexNum] ? mapData[curVideo.indexNum].deviceName : ''}}</div>
        <div>
          <span @click="pauseLargeVideo" class="vl_icon vl_icon_judge_01" v-if="curVideo.playing"></span>
          <span @click="playLargeVideo" class="vl_icon vl_icon_control_09" v-else></span>
          <span><a download="视频" :href="curVideoUrl" class="el-icon-download"></a></span>
          <span @click="cutScreen" class="vl_icon vl_icon_control_07"></span>
        </div>
      </div>
    </div>
    <div style="width: 0; height: 0;" v-show="showCut"  :class="{vl_j_cutscreen: showCut}">
      <img :src="demoImg" alt="">
      <i @click="showCut = false" class="close_btn el-icon-error"></i>
      <a download="截图" :href="demoImg" id="vlJtcDownloadImg" ></a>
    </div>
  </div>
</template>
<script>
let AMap = window.AMap;
import {testData} from './testData';
import {ajaxCtx} from '@/config/config';
import {JtcPOSTAppendixInfo, JtcGETAppendixInfoList, JtcGETTrail, JtcPUTAppendixsOrder, MapGetPortraitsByName} from '../../api/api.judge.js';
import {getPortraitByIdNo, getVehicleByVehicleNumber} from '../../api/api.control.js'
export default {
  data() {
    return {
      uploadAcion: ajaxCtx.base + '/new',
      testData: testData,
      mapData: [],
      searching: false,
      curImageUrl: '', // 当前上传的图片
      curImgNum: 0, // 当前图片数量
      uploading: false, // 是否上传中
      uploadFileList: [],
      imgList: ['', '', ''],
      historyPicList: [], // 上传历史记录
      loadingHis: false,
      searchData: {
        targetType: 1, // 1：人， 2： 车
        name: null, // 目标姓名
        cardId: null, // 目标身份证号
        time: null,
        carNum: null // 车牌号
      },
      targetTypeList: [
        {label: '人', value: 1},
        {label: '车', value: 2}
      ],
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
      markerCheck: [], // 地图checkbox集合
      markerLine: [], // 地图线集合
      markerPoint: [], // 地图点集合
      markerIconPlay: [], // 地图播放按钮集合
      markerIconBig: [], // 地图放大按钮集合
      curVideo: {
        id: '',
        indexNum: 0,
        playing: false
      }, // 当前被放大播放的video
      showLarge: false,
      showCut: false,
      curVideoUrl: '',
      demoImg: '',
      historyPicDialog: false
    }
  },
  computed: {
    choosedHisPic () {
      return this.historyPicList.filter(x => x.checked)
    }
  },
  mounted () {
    this.setDTime();
    let map = new AMap.Map('tcMap', {
      center: [112.974691, 28.093846],
      zoom: 16
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.amap = map;
  },
  methods: {
    autoEvent1 (queryString, cb) {
      if (!queryString) {
        cb([])
      } else {
        MapGetPortraitsByName({'name': queryString}).then(result => {
          cb(result.data);
        })
      }
    },
    autoEvent2 (queryString, cb) {
      if (!queryString) {
        cb([])
      } else {
        getPortraitByIdNo({'idNo': queryString}).then(result => {
          cb(result.data);
        })
      }
    },
    autoEvent3 (queryString, cb) {
      if (!queryString) {
        cb([])
      } else {
        getVehicleByVehicleNumber({'vehicleNumber': queryString}).then(result => {
          cb(result.data);
        })
      }
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
            contentUid: 43143,
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
              this.uploading = false;
              x['uid'] = jRes.data;
              for (let i = 0; i < this.imgList.length; i++) {
                if (!this.imgList[i]) {
                  this.imgList.splice(i, 1, x);
                  break;
                }
              }
              this.showCurImg();
            }
          })
        }
      }
      this.uploadFileList = fileList;
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
        userId: 43143,
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
    chooseType () {
      this.searchData.cardId = null;
      this.searchData.name = null;
      this.searchData.carNum = null;
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
      this.searching = true;
      let _ids = [];
      let params = {
        targetType: this.searchData.targetType,
        dateStart: this.searchData.time[0],
        dateEnd: this.searchData.time[1]
      }
      if (this.searchData.name) {
        params['name'] = this.searchData.name;
      }
      if (this.searchData.cardId) {
        params['idNo'] = this.searchData.cardId;
      }
      if (this.searchData.carNum) {
        params['plateNumber'] = this.searchData.carNum;
      }
      this.imgList.forEach(x => {
        if (x) {
          _ids.push(x.uid);
        }
      })
      if (_ids.length) {
        params['appendixInfos'] = _ids.join(',');
      }
      if (_ids.length ===0 && !this.searchData.cardId && !this.searchData.carNum && !this.searchData.name) {
        this.searching = false;
        this.$message.warning('请至少输入一个搜索条件')
      } else {
        JtcGETTrail(params).then(res => {
          if (res) {
            console.log(res);
            res.data.forEach((z, index) => {
              z['playing'] = false;
              z['checked'] = true;
              z['_key'] = index;
            })
            this.mapData = res.data;
            this.amap.clearMap();
            this.drawMapMarker(this.mapData);
            this.searching = false;
          } else {
            this.searching = false;
          }
        }).catch(() => {
          this.searching = false;
        })
      }
    },
    drawMapMarker (data) {
      let path = [];
      for (let  i = 0; i < data.length; i++) {
        let obj = data[i];
        let _path = [obj.longitude, obj.latitude];
        if (obj.longitude > 0 && obj.latitude > 0) {
          let _id = 'vlJtcVideo' + obj._key;
          let _idCheck = 'vlJtcCheckbox' + obj._key;
          let _idBtn = 'vlJtcPlayBtn' + obj._key;
          let _idPoint = 'vlJtcPoint' + obj._key;
          let _sContent = `
            <div class="vl_jtc_mk" >
              <video preload="auto" id="${_id}" src="http://www.w3school.com.cn/example/html5/mov_bbb.mp4"></video>
              <p>${obj.shotTime}<i id="${_idBtn}" class="vl_icon vl_icon_control_09"></i></p>
              <div class="vl_jtc_mk_check">
                <input id="${_idCheck}" checked type="checkbox">
              </div>
            </div>`;
          setTimeout(() => {
            this.addListen(_idCheck, 'checkbox', obj);
            this.addListen(_idBtn, 'playBtn', obj);
            this.addListen(_id, 'video', obj);
          }, 300)
          // 窗体
          new AMap.Marker({ // 添加自定义点标记
            map: this.amap,
            position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(20, -80), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            content: _sContent
          });
          path.push(_path);
          let _content = `<div id="${_idPoint}" class="vl_icon vl_icon_sxt"></div>`
          let point = new AMap.Marker({ // 添加自定义点标记
            map: this.amap,
            position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            // 自定义点标记覆盖物内容
            content: _content
          });
          this.markerPoint[i] = point;
        }
      }
      this.amap.setFitView()
      this.drawLine(path);
    }, // 覆盖物（窗体和checkbox
    addListen (el, type, obj) {
      let _Dom = document.getElementById(el);
      let self = this;
      _Dom.addEventListener('click', function () {
        switch (type) {
          case 'checkbox':
            obj.checked = !obj.checked;
            self.updateLine(obj)
            break;
          case 'video':
            self.largeVideo(obj);
            break;
          case 'playBtn':
            obj.playing ? $('#' + el).removeClass('vl_icon_judge_01') : $('#' + el).addClass('vl_icon_judge_01')
            self.playVideo(obj);
            break;
        }
      })
    },
    drawLine (path) {
      var polyline = new AMap.Polyline({
        path: path,
        showDir: true,
        strokeColor: '#61C772',
        strokeWeight: 6
      });
      this.markerLine.push(polyline);
      this.amap.add([polyline]);
    }, // 画线
    updateLine (obj) {
      this.amap.remove(this.markerLine);
      // e.target.C.extData.checked = !e.target.C.extData.checked;
      let _i = this.mapData.indexOf(obj);
      this.mapData.splice(_i, 1);
      this.mapData.push(obj);
      let path = [];
      for (let i = 0; i < this.mapData.length; i++) {
        if (this.mapData[i].checked) {
          let _path = [this.mapData[i].longitude, this.mapData[i].latitude];
          path.push(_path);
        }
      }
      this.drawLine(path);
      obj.checked ? $('#vlJtcPoint' + obj._key).removeClass('vl_icon_sxt_not_choose') : $('#vlJtcPoint' + obj._key).addClass('vl_icon_sxt_not_choose')
    }, // 更新画线
    playVideo (data) {
      let _i = this.mapData.indexOf(data);
      let vDom = document.getElementById('vlJtcVideo' + this.mapData[_i]._key);
      if (data.playing) {
        vDom.pause();
      } else {
        vDom.play();
        vDom.addEventListener('ended', (e) => {
          e.target.currentTime = 0;
          this.mapData[_i].playing = false;
          $('#vlJtcPlayBtn' + this.mapData[_i]._key).removeClass('vl_icon_judge_01');
        })
      }
      data.playing = !data.playing;
    },
    largeVideo (data) {
      let _i = this.mapData.indexOf(data);
      let vDom = document.getElementById('vlJtcVideo' + this.mapData[_i]._key);
      // 先把小窗口图标变成暂停
      $('#vlJtcPlayBtn' + this.mapData[_i]._key).removeClass('vl_icon_judge_01');
      vDom.pause();
      this.curVideo.id = 'vlJtcVideo' + this.mapData[_i]._key;
      this.curVideo.playing = this.mapData[_i].playing;
      this.curVideo.indexNum = _i;
      this.showLarge = true;
      if (this.mapData[_i].playing) {
        document.getElementById('vlJtcLargeV').play();
      }
      document.getElementById('vlJtcLargeV').currentTime = vDom.currentTime;
      this.curVideoUrl = vDom.src;
      document.getElementById('vlJtcLargeV').addEventListener('ended', (e) => {
        e.target.currentTime = 0;
        vDom.currentTime = 0;
        this.mapData[_i].playing = false;
        this.showLarge = false;
      })
    },
    closeVideo () {
      let vDom = document.getElementById(this.curVideo.id);
      document.getElementById('vlJtcLargeV').pause();
      vDom.currentTime = document.getElementById('vlJtcLargeV').currentTime;
      this.showLarge = false;
      if (this.curVideo.playing) {
        this.mapData[this.curVideo.indexNum].playing = true;
        $('#vlJtcPlayBtn' + this.mapData[this.curVideo.indexNum]._key).addClass('vl_icon_judge_01');
        vDom.play();
      }
    },
    pauseLargeVideo () {
      this.curVideo.playing = false;
      document.getElementById('vlJtcLargeV').pause();
    } ,
    playLargeVideo () {
      this.curVideo.playing = true;
      document.getElementById('vlJtcLargeV').play();
    },
    cutScreen () {
      this.showCut = true;
      let _canvas = document.createElement('canvas');
      _canvas.setAttribute('width', document.documentElement.clientWidth);
      _canvas.setAttribute('height', document.documentElement.clientHeight);
      let cxt = _canvas.getContext('2d');
      cxt.drawImage(document.getElementById('vlJtcLargeV'), 0, 0, _canvas.width, _canvas.height);
      this.demoImg = _canvas.toDataURL();
      setTimeout(() => {
        document.getElementById('vlJtcDownloadImg').click();
      }, 200)
    }
  },
  watch: {}
}
</script>
<style lang="scss">
  .vl_jtc_mk_check {
    position: absolute;
    right: .08rem;
    top: .08rem;
    width: 14px;
    height: 14px;
  }
</style>