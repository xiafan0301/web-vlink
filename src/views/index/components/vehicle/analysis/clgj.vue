<template>
  <div class="point">
    <div class="">
      <div
              is="vlBreadcrumb"
              :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle_menu'},
          {name: '车辆轨迹'}]"
      ></div>
    </div>

    <div :class="['left',{hide:hideleft}]">
      <div class="plane">
        <el-form
            :model="ruleForm"
            status-icon
            ref="ruleForm"
            label-width="0px"
            class="demo-ruleForm_clgj"
        >
          <el-form-item class="" prop="data1">
            <el-date-picker
              v-model="ruleForm.data1"
              style="width: 100%;"
              class="vl_date"
              :picker-options="pickerOptions"
              type="datetime"
              value-format="timestamp"
              placeholder="请选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              style="width: 100%;"
              class="vl_date vl_date_end"
              :picker-options="pickerOptions"
              v-model="ruleForm.data2"
              @change="chooseEndTime"
              value-format="timestamp"
              type="datetime"
              placeholder="请选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="input5">
            <div class="per-semblance per-semblance-is-max" v-if="ruleForm.input3.length >= 6"><el-input placeholder="已添加6辆车" :disabled="true"></el-input><i class="el-icon-circle-plus"></i></div>
            <div class="per-semblance" v-else><el-input placeholder="输入车牌号" v-model="ruleForm.input5"></el-input><i class="el-icon-circle-plus" @click="addPlateNo"></i></div>
          </el-form-item>
          <div class="add-plate-no">
            <div class="plate-item" v-for="(item, index) in ruleForm.input3" :key="item.id">
              <div>车牌号码{{index + 1}}：<span>{{item}}</span></div><i class="el-icon-remove" @click="removePlateNo(index)"></i>
            </div>
          </div>
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button @click="resetForm('ruleForm')" class="full">重置</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" :loading="serarchLoading" @click="submitForm('ruleForm')" class="select_btn full">分析</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div class="insetLeft vl_icon vl_icon_vehicle_02" :class="{'vl_icon_vehicle_03': hideleft}" @click="hideLeft"></div>
        <!--车辆切换列表-->
        <div class="clgj-s-list">
          <div v-for="(item, index) in evData" :key="item.id" :class="{'active': index === activeList}" @click="plateTap(index)">{{item.plateNo}}</div>
        </div>
      </div>
    </div>
    <div :class="['right',{hide:!hideleft}]" id="rightMap"></div>
    <ul class="map_rrt_u2">
      <li @click="resetZoom"><i class="el-icon-aim"></i></li>
      <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
      <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
    </ul>
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
        <ul v-show="strucCurTab === 1">
          <!-- <li><span>抓拍设备：{{sturcDetail.deviceName}}</span></li> -->
          <li><span>抓拍地址：{{sturcDetail.address}}</span></li>
          <li style="color: #999;">{{sturcDetail.shotTime}}</li>
        </ul>
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img class="bigImg"  :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img class="bigImg"  :src="sturcDetail.storagePath" alt="">
              <span>全景图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>抓拍信息</h2>
              <div class="struc_cd_info_main">
                <vue-scroll>
                  <div class="scroll_box">
                    <!--<div class="struc_cdi_line">-->
                      <!--<span :title="sturcDetail.shotTime"><font>抓拍时间</font>{{sturcDetail.shotTime}}</span>-->
                    <!--</div>-->
                    <!--<div class="struc_cdi_line">-->
                      <!--<span :title="sturcDetail.deviceName"><font>抓拍设备</font>{{sturcDetail.deviceName}}</span>-->
                    <!--</div>-->
                    <!--<div class="struc_cdi_line">-->
                      <!--<span :title="sturcDetail.address"><font>抓拍地址</font>{{sturcDetail.address}}</span>-->
                    <!--</div>-->
                    <div class="struc_cdi_line">
                      <span :title="sturcDetail.plateNo"><font>车牌号码</font>{{sturcDetail.plateNo}}</span>
                    </div>
                    <div class="struc_cdi_line">
                      <span :title="sturcDetail.plateColor"><font>号牌颜色</font>{{sturcDetail.plateColor}}</span>
                    </div>
                    <div class="struc_cdi_line">
                      <span :title="sturcDetail.vehicleModel"><font>车辆型号</font>{{sturcDetail.vehicleModel}}</span>
                    </div>
                    <div class="struc_cdi_line">
                      <span :title="sturcDetail.vehicleColor"><font>车辆颜色</font>{{sturcDetail.vehicleColor}}</span>
                    </div>
                    <div class="struc_cdi_line">
                      <span :title="sturcDetail.vehicleClass"><font>车辆类型</font>{{sturcDetail.vehicleClass}}</span>
                    </div>
                    <div class="struc_cdi_line">
                      <span :title="sturcDetail.plateClass"><font>号牌类型</font>{{sturcDetail.plateClass}}</span>
                    </div>
                  </div>
                </vue-scroll>
              </div>
            </div>
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address"></div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img class="bigImg"  :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box" style="float: left;" v-if="playerData">
            <div is="flvplayer" :oData="playerData"
                 :oConfig="{fit: false, sign: false, pause: true, close: false, tape: false, download: false}">
            </div>
          </div>
          <div class="struc_c_d_box struc_vid_empty" style="float: left;" v-else>
            <div class="struc_vid_empty_c com_trans50_lt">
              <div></div>
              <p>暂无视频</p>
            </div>
          </div>
          <p class="download_tips" v-show="sturcDetail.videoPath">下载提示：右键点击视频选择“另存视频为”即可下载视频。</p>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in curEvData" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="width: 100%; height: .88rem;" :src="item.subStoragePath" alt="">
              <!--<div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? item.semblance : 92}}<span style="font-size: 12px;">%</span></div>-->
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <div id="capMap"></div>
  </div>
</template>
<script>
  import vlBreadcrumb from "@/components/common/breadcrumb.vue";
  import { mapXupuxian } from "@/config/config.js";
  import { objDeepCopy, random14, formatDate } from "@/utils/util.js";
  import { cityCode, dataList } from "@/utils/data.js";
  import { InvestigateGetTrace } from "@/views/index/api/api.judge.js";
  import { getDiciData } from '@/views/index/api/api.js';
  import flvplayer from '@/components/common/flvplayer.vue';
  export default {
    components: {vlBreadcrumb, flvplayer},
    data() {
      return {
        playerData: null,
        activeList: 0,
        serarchLoading: false,
        selectMapClear: '',
        curChooseNum: '已选择0个设备',
        hover:null,
        input3: null,
        mouseTool: null,
        drawArea: null,
        swiperOption: {
          slidesPerView: 10,
          spaceBetween: 10,
          slidesPerGroup: 9,
          loop: false,
          slideToClickedSlide: true,
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
        amap: null,
        map: null,
        pointData: {
          deviceList: [],
          bayonetList: []
        },
        hideleft: false,
        timeOrder: false,
        ruleForm: {
          data1:null,
          data2: null,
          input5: '', // 当前输入的车牌号
          input3: [],
        },
        pricecode:cityCode,
        pickerOptions: {
          disabledDate (time) {
            let date = new Date();
            let y = date.getFullYear();
            let m = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
            let d = date.getDate();
            let threeMonths = '';
            let start = '';
            if (parseFloat(m) >= 4) {
              start = y + '-' + (m - 1) + '-' + d;
            } else {
              start = (y - 1) + '-' + (m - 1 + 12) + '-' + d;
            }
            threeMonths = new Date(start).getTime();
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          }
        },
        evData: [],
        curEvData: [],
        originEvData: [],
        marks: [[], []],
        markerLine: [], // 地图线集合
        markerPoint: [], // 地图点集合
        supMarkerPoint: null,
        curStrucList: [],
        strucCurTab: 1,
        curImgIndex: 0,
        sturcDetail: {},
        playing: false, // 视频播放是否
        strucDetailDialog: false,
        videoUrl: '', // 弹窗视频回放里的视频
        numberTypeList: [], // 号牌种类列表
      };
    },
    mounted() {
      if (this.$route.query.plateNo) {
        this.ruleForm.input5 = this.$route.query.plateNo;
      }
      this.renderMap();
      this.setDTime();
      this.getNumberTypeList();
    },
    methods: {
      // 设置视频数据
      setPlayerData () {
        if (this.sturcDetail.videoPath) {
          this.playerData = {
            type: 3,
            title: this.sturcDetail.deviceName,
            video: {
              uid: new Date().getTime() + '',
              downUrl: this.sturcDetail.videoPath
            }
          }
        } else {
          this.playerData = null;
        }
      },
      // 获取号牌种类列表
      getNumberTypeList () {
        const type = dataList.numberType;
        getDiciData(type)
          .then(res => {
            if (res) {
              this.numberTypeList = res.data;
            }
          })
      },
      plateTap (index) {
        this.amap.clearMap();
        this.activeList = index;
        this.filterData();
        this.drawLine();
      },
      addPlateNo () {
        if (!this.ruleForm.input5.replace(/\s+|\s+$/g, '')) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('车牌号码不能为空')
          }
        }else {
          if (this.ruleForm.input3.includes(this.ruleForm.input5.replace(/\s+|\s+$/g, ''))) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('该车牌号码已经添加了')
            }
          } else {
            this.ruleForm.input3.push(this.ruleForm.input5.replace(/\s+|\s+$/g, ''))
          }
        }
      },
      removePlateNo (index) {
        this.ruleForm.input3.splice(index, 1)
      },
      chooseEndTime (e) {
        if (e < this.ruleForm.data1) {
          this.$message.info('结束时间必须大于开始时间才会有结果')
        }
      },
      mapZoomSet (val) {
        if (this.amap) {
          this.amap.setZoom(this.amap.getZoom() + val);
        }
      },
      resetZoom () {
        if (this.amap) {
          this.amap.setZoomAndCenter(14, mapXupuxian.center);
        }
      },
      setDTime () {
        let date = new Date();
        let curDate = date.getTime();
        let curS = 1 * 24 * 3600 * 1000;
        let yDate = new Date(curDate - curS);
        this.ruleForm.data1 = new Date(yDate.getFullYear() + '-' + (yDate.getMonth() + 1) + '-' + yDate.getDate() + ' 00:00:00').getTime();
        this.ruleForm.data2 =  new Date(yDate.getFullYear() + '-' + (yDate.getMonth() + 1) + '-' + yDate.getDate() + ' 23:59:59').getTime();
      },
      hideLeft() {
        this.hideleft = !this.hideleft;
      },
      submitForm(v) {
        if(this.ruleForm && this.ruleForm.data1 && this.ruleForm.data2){
          if (this.ruleForm.input3.length || this.ruleForm.input5) {
            let pg = {
              vehicleNumber: ''
            }
            if (this.ruleForm.input3.includes(this.ruleForm.input5.replace(/\s+|\s+$/g, ''))) {
              if (!document.querySelector('.el-message--info')) {
                this.$message.info('输入框内的车牌已经添加了')
              }
              return false;
            }
            pg['startTime'] = formatDate(this.ruleForm.data1, 'yyyy-MM-dd HH:mm:ss');
            pg['endTime'] = formatDate(this.ruleForm.data2, 'yyyy-MM-dd HH:mm:ss');
//            if (this.ruleForm.input3.length) {
//              pg['vehicleNumber'] += this.ruleForm.input3.join(',');
//            }
            pg['vehicleNumber'] = this.ruleForm.input3.concat(this.ruleForm.input5).join(',')

            this.getVehicleShot(pg);
          } else {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info("请输入车牌号码。");
            }
          }
        }else{
          if (!document.querySelector('.el-message--info')) {
            this.$message.info("请输入开始和结束时间。");
          }
        }
      },
      resetForm(){
        this.ruleForm.input3 = [];
        this.ruleForm.input5 = '';
        this.setDTime ();
        //this.$refs[v].resetFields();
      },

      renderMap() {
        let map = new window.AMap.Map("rightMap", {
          zoom: 10,
          center: mapXupuxian.center
        });
        map.setMapStyle("amap://styles/whitesmoke");
        this.amap = map;
        // 弹窗地图
        let supMap = new AMap.Map('capMap', {
          center: mapXupuxian.center,
          zoom: 16
        });
        supMap.setMapStyle('amap://styles/whitesmoke');
        this.map = supMap;

      },
      getVehicleShot(d, bool) {
        this.activeList = 0;
        if (!bool) {
          this.serarchLoading = true;
        }
        this.count = 10;
        InvestigateGetTrace(d).then(res => {
          this.serarchLoading = false;
          if (res) {
            // console.log(res);
            this.amap.clearMap();
            if (!res.data || res.data.length === 0) {
              this.$message.info("抱歉，没有找到匹配结果");
              return false;
            }
            this.evData = res.data;
            this.originEvData = objDeepCopy(res.data);
            this.filterData();
            this.drawLine();
          }
        }).catch(() => {
          this.serarchLoading = false;
        });
      },
      filterData () {
        let _arr = [];
        this.evData = objDeepCopy(this.originEvData);
        this.evData.forEach((z, index) => {
          z.traceList.forEach(x => {
            // 是否显示时间
            if (index === this.activeList) {
              x['showTime'] = true;
            } else {
              x['showTime'] = false;
            }
            // 判断是不是有卡口
            if (x.bayonetName) {
              x['dataType'] = 8;
            } else {
              x['dataType'] = 0;
            }
            let _i = _arr.findIndex(y => y.deviceID === x.deviceID);
            if (_i === -1) {
              _arr.push(x);
            } else {
              if (index === this.activeList) {
                // 判断出现的重复点是不是同一辆车的
                if (x.plateNo === _arr[_i].plateNo) {
                  _arr[_i]['shotTime'] += ',' + x.shotTime;
                } else {
                  x['simLength'] += 1;
                  _arr.splice(_i, 1, x);
                }
              } else {
                if (x.plateNo === _arr[_i].plateNo) {
                  _arr[_i]['shotTime'] += ',' + x.shotTime;
                } else {
                  _arr[_i]['simLength'] += 1;
                }
              }
            }
          })
        });
        _arr.forEach(x => {
          let b = true;
          this.evData.forEach(y => {
            if (y.traceList.findIndex(z => z.deviceID === x.deviceID) === -1){
              b = false;
            }
          })
          if (b && this.evData.length > 1) {
            if (x.bayonetName) {
              x['dataType'] = 12;
            } else {
              x['dataType'] = 13;
            }
          }
        })
        this.curEvData = this.originEvData[this.activeList].traceList;
        this.drawMapMarker(_arr);
      },
      //查询所有的卡口设备
      // 地图标记
      mapHoverInfo (data) {
        let str = '<div class="vl_map_hover_main"><ul>';
        if (data.dataType === 0) {
          str += '<li><span>设备名称：</span><p>' + data.infoName + '</p></li>';
          str += '<li><span>设备地址：</span><p>' + data.address + '</p></li>';
          str += '</ul></div>'
        } else if (data.dataType === 1) {
          str += '<li><span>卡口名称：</span><p>' + data.infoName + '</p></li>';
          str += '<li><span>卡口编号：</span><p>' + data.bayonetNo + '</p></li>';
          str += '<li><span>地理位置：</span><p>' + data.bayonetAddress + '</p></li>';
//          str += '<li><span>设备数量：</span><p>' + data.devNum + '</p></li>';
          str += '</ul></div>'
        }
        return str;
      },
      drawMapMarker (data) {
        for (let  i = 0; i < data.length; i++) {
          let obj = data[i];
          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            let $id = 'mapMark' + obj.dataType + obj.uid;
            let _time = '', isStartEnd = false;
            if (obj.showTime) {
              _time = '<p class="vl_map_mark_time">';
              obj.shotTime.split(',').forEach(j => {
                _time += `<span>${j}</span>`
              })
              _time += '</p>';
            }
            let _content = `<div id="${$id}" class="vl_icon right_map_icon vl_icon_map_mark` + obj.dataType + `">` + _time + `</div>`
            // 判断是不是起止点
            let curList = this.evData[this.activeList].traceList;
            if (obj.deviceID === curList[curList.length - 1].deviceID) {
              _content = `<div id="${$id}" class="vl_icon vl_icon_map_mark_start">` + _time + `</div>`;
              isStartEnd = true;
            }
            if (obj.deviceID === curList[0].deviceID) {
              _content = `<div id="${$id}" class="vl_icon vl_icon_map_mark_end">` + _time + `</div>`;
              isStartEnd = true;
            }
            let point = new window.AMap.Marker({ // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              // 自定义点标记覆盖物内容
              content: _content
            });
            point.on('click', () => {
              if (obj.showTime) {
                let newObj = objDeepCopy(obj);
                newObj.shotTime = newObj.shotTime.split(',')[0];
                this.showStrucInfo(newObj, i)
              }
            })
            this.markerPoint[i] = point;
            if (!isStartEnd) {
              point.on('mouseover', function () {
                $('#' + $id).addClass('vl_icon_map_hover_mark' + obj.dataType)
              })
              point.on('mouseout', function () {
                $('#' + $id).removeClass('vl_icon_map_hover_mark' + obj.dataType)
              })
            }
          }
        }
        this.amap.setFitView()
      },
      drawLine () {
        this.evData.forEach((x, index)  => {
          let path = [];
          x.traceList.forEach(y => {
            let _path = [y.shotPlaceLongitude, y.shotPlaceLatitude];
            path.push(_path);
          })
          var polyline = new window.AMap.Polyline({
            path: path,
            showDir: true,
            strokeColor: index === this.activeList ? '#61C772' : '#086AEA',
            strokeWeight: index === this.activeList ? 6 : 3,
            zIndex: index === this.activeList ? 6 : 4,
            extData: index
//            strokeOpacity: index === this.activeList ? 1 : 0,
          });
          polyline.on('click', ()=> {
            let aIndex = polyline.getExtData();
            if(aIndex !== this.activeList) {
              this.plateTap(aIndex)
            }
          })
          this.markerLine.push(polyline);
          this.amap.add([polyline]);
        })
      }, // 画线
      showStrucInfo (data) {
        this.amap.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude])
        this.curImgIndex = this.curEvData.findIndex(x => x.deviceID === data.deviceID);
        this.strucDetailDialog = true;

        this.numberTypeList.map(item => {
          if (item.enumField === data.plateClass) {
            data.plateClass = item.enumValue;
          }
        });

        this.sturcDetail = data;
        this.strucCurTab = 1;
        this.drawPoint(data);
        this.setPlayerData();
      },
      drawPoint (data) {
        this.$nextTick(() => {
          $('.struc_c_address').append($('#capMap'))
        })
        if (this.supMarkerPoint) {
          this.map.remove(this.supMarkerPoint)
        }
        let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
        this.supMarkerPoint = new window.AMap.Marker({ // 添加自定义点标记
          map: this.map,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        this.map.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
        let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
        new window.AMap.InfoWindow({
          map: this.map,
          isCustom: true,
          closeWhenClickMap: false,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
          offset: new window.AMap.Pixel(0, -70),
          content: sConent
        })
      },
      imgListTap (data, index) {
        this.numberTypeList.map(item => {
          if (item.enumField === data.plateClass) {
            data.plateClass = item.enumValue;
          }
        });

        this.curImgIndex = index;
        this.sturcDetail = data;
        this.playing = false;
        this.drawPoint(data);
        this.setPlayerData();
      }
    }
  };
</script>
<style lang="scss">
  #rightMap {
    .vl_icon {
      width: 47px;
      position: relative;
      > .vl_map_mark_time {
        position: absolute; top: 10px; left: 98%;
        width: 130px;
        word-break:keep-all; 
        font-size: 12px; color: #fff;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 2px;
        padding: 2px 5px;
        span{
          display: block;
        }
      }
    }
    .vl_icon.vl_icon_map_mark_start {
      width: 80px;
      height: 80px;
    }
    .vl_icon.vl_icon_map_mark_end {
      width: 80px;
      height: 80px;
    }
  }
</style>
<style lang="scss" scoped>
  .add-plate-no {
    padding-left: 10px;
    .plate-item {
      height: 32px;
      line-height: 32px;
      margin-bottom: 10px;
      >div {
        width: 194px;
        display: inline-block;
        margin-right: 8px;
        color: #999999;
        span {
          color: #333333;
        }
      }
      > i{
        color: #D3D3D3;
        cursor: pointer;
        font-size: 20px;
        &:hover {
          color: #FA453A;
        }
      }
    }
  }
  .map_rrt_u2 {
    position: absolute; right: 30px;
    bottom: 30px;
    margin-top: .2rem;
    font-size: 26px;
    background: #ffffff;
    width: 78px;
    padding: 0 10px;
    > li {
      line-height: 70px;
      text-align: center;
      cursor: pointer;
      border-bottom: 1px solid #F2F2F2;
      > i {
        margin-top: 0;
        display: inline-block;
      }
      color: #999999;
      &:hover {
        color: #0C70F8;
      }
    }
  }
  .point {
    width: 100%;
    height: 100%;
  }
  .breadcrumb_heaer {
    background: #ffffff;
    border-bottom: 1px solid #D3D3D3;
  }
  .full {
    width: 100%;
  }
  .insetPadding {
    padding: 10px;
    height: 100%;
  }
  .right.hide {
    width: calc(100% - 272px);
    height: calc(100% - 55px);
    float: right;
  }
  .right {
    width: 100%;
    height: calc(100% - 55px);
    float: right;
  }
  .left.hide {
    margin-left: -272px;
    transition: marginLeft 0.3s ease-in;
    position: relative;
    z-index: 2;
    // animation: fadeOutLeft 0.4s ease-out 0.3s both;
  }
  .left {
    position: relative;
    width: 272px;
    height: calc(100% - 55px);
    background-color: #ffffff;
    float: left;
    z-index: 1;
    margin-left: 0px;
    /*box-shadow: 4px 0px 10px 0px #838383;*/
    /*box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);*/
    animation: fadeInLeft 0.4s ease-out 0.3s both;
    transition: marginLeft 0.3s ease-in;
    .plane {
      padding: 20px;
      position: relative;
      height: 100%;
    }
    .line40 {
      line-height: 40px;
    }
    .inset {
      display: inline-block;
      line-height: 40px;
      font-style: normal;
    }
    .firstItem {
      margin-bottom: 5px;
    }
  }
  .insetLeft {
    position: absolute;
    right: -28px;
    width: 25px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    cursor: pointer;
  }
  .clgj-s-list {
    position: absolute;
    top: 15px;
    left: 298px;
    display: flex;
    > div {
      width: 92px;
      height: 40px;
      background: #F6F8F9;
      border: 1px solid #D3D3D3;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      text-align: center;
      line-height: 40px;
      color: #999999;
      cursor: pointer;
      margin-right: 10px;
      &:hover {
        background: #0C70F8;
        color: #ffffff;
        border-color: #0C70F8;
      }
    }
    .active {
      background: #0C70F8;
      color: #ffffff;
      border-color: #0C70F8;
    }
  }
  .hide {
    .insetLeft {
    }
  }
  .insetLeft2 {
    position: absolute;
    right: -28px;
    width: 28px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    background-repeat: no-repeat;
    transform: rotate(180deg);
    background-image: url(../../../../../assets/img/icons.png);
    background-position: -318px -1269px;
    cursor: pointer;
  }
  .select_btn {
    background-color: #0c70f8;
    color: #ffffff;
  }
  .plane_main_box {
    height: calc(100% - 100px);
    padding-top: 10px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .plane_main {
    .p_main_list {
      height: 40px;
      overflow: hidden;
      -webkit-transition: all .3s;
      -moz-transition: all .3s;
      -ms-transition: all .3s;
      -o-transition: all .3s;
      transition: all .3s;
      .p_main_head {
        height: 40px;
        line-height: 40px;
        background: #F6F6F6;
        cursor: pointer;
        text-indent: 6px;
        border-bottom: 1px solid #F2F2F2;
        i{
          color: #999999;
        }
      }
      .p_main_item {
        width: 100%;
        height: 39px;
        cursor: pointer;
        &:hover{
          background: #E0F3FF;
          color: #0C70F8;
        }
        >div {
          display: inline-block;
          width: 50%;
          text-align: center;
          line-height: 39px;
          color: #666666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          border-bottom: 1px solid #F2F2F2;
          &:first-child {
            width: 46%;
          }
        }
      }
    }
    .is_open {
      height: auto;
    }
    .th-center-pagination {
      text-align: center;
    }
  }
  .mapbox {
    width: 100%;
    height: 500px;
    .shrink {
      background: #ffffff;
      padding: 1px;
      position: absolute;
      right: 20px;
      bottom: 90px;
      box-shadow: 3px 4px 5px -5px #666666;
      span {
        display: block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 28px;
        font-weight: normal;
        cursor: pointer;
        &:first-child {
          border-bottom: solid 1px #dddddd;
        }
      }
      span:hover {
        color: #0c70f8;
      }
    }
    .select_btn {
      background-color: #0c70f8;
      color: #ffffff;
    }
  }
  .bottomBox{
    background: #ffffff;
    width: 100%;
    padding: 10px 10px;
    text-align: center;
  }
  .setPost {
    position: absolute;
    left: 20px;
    top: 20px;
    width: 300px;
    .drawBox {
      margin-top: 20px;
      background: #ffffff;
      padding: 10px;
      .items {
        padding-top: 20px;
        span {
          display: inline-block;
          width: 55px;
          height: 55px;
          text-align: center;
          line-height: 55px;
          border-right: solid 1px #eeeeee;
          cursor: pointer;
          &:last-child {
            border-right: none;
          }
        }
        .cut1 {
          background: url(../../../../../assets/img/vehicle/cut1.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut1.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut1m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut2 {
          background: url(../../../../../assets/img/vehicle/cut2.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut2.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut2m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut3 {
          background: url(../../../../../assets/img/vehicle/cut3.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut4 {
          background: url(../../../../../assets/img/vehicle/cut4.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut5 {
          background: url(../../../../../assets/img/vehicle/cut5.png) center
          no-repeat;
          background-size: 80% 80%;
        }
        .cut3.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut3m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut4.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut4m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut5.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut5m.png) center
          no-repeat;
          background-size: 80% 80%;
        }
      }
    }
  }
</style>
<style lang="scss">
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
  .demo-ruleForm_clgj {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .data_range {
    .el-range__close-icon {
      display: none;
    }
  }
  .struc_detail_dialog {
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
            border: .5rem solid #0c70f8;
            border-color: transparent transparent #0C70F8;
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
            border: .5rem solid #50CC62;
            border-color: transparent transparent #50CC62;
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
            height: 3.2rem;
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
            .struc_cd_info_main {
              height: calc(100% - 0.74rem);
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
                color: #333333;
                white-space: nowrap;
                text-overflow: ellipsis;
                border-radius:3px;
                font-size: 12px;
                overflow: hidden;
                padding-right: .1rem;
                margin-right: .08rem;
                > i {
                  vertical-align: middle;
                  margin-left: .1rem;
                }
                > font {
                  width: 75px;
                  text-align: center;
                  border-right: 1px solid #F2F2F2;
                  color: #999999;
                  background: #FAFAFA;
                  display: inline-block;
                  margin-right: .1rem;
                }
              }
              p {
                color: #999999;
              }
            }
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
        .download_tips {
          float: left;
          width: 100%;
          text-align: right;
          padding-right: 40px; padding-top: 10px;
        }
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
  .vl_jtc_mk {
    display: none;
    width: 218px;
    height: 122px;
    position: relative;
    > img {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    > p {
      width: 100%;
      position: absolute;
      color: #FFFFFF;
      bottom: 8px;
      font-size: 12px;
      padding: 0 6px;
      line-height: 20px;
      > i {
        height: 20px;
        float: right;
        vertical-align: middle;
      }
    }
  }
  .vl_jig_mk_p {
    width: 180px;
    height: auto;
    background: #ffffff;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    box-shadow: 4px 0px 10px 0px #838383;
    box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
    .big {
      font-size: 16px;
      font-weight: bold;
    }
    &:after {
      border-bottom-color: rgba(0, 0, 0, 1);
      content: "";
      display: inline-block;
      position: absolute;
      left: 50%;
      margin-left: -10px;
      bottom: -10px;
      border-top: 10px solid #fff;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
    }
    &.vl_jig_mk_img_hover {
      &:after {
        border-bottom-color: rgba(0, 0, 0, 1);
        content: "";
        display: inline-block;
        position: absolute;
        left: 50%;
        margin-left: -10px;
        bottom: -10px;
        border-top: 10px solid #0c70f8;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
      }
      background: rgba(12, 112, 248, 1);
      position: relative;
      border: 0.04rem solid #0c70f8;
      > p {
        color: #ffffff;
      }
    }
  }
  .map_select {
    /deep/.el-dialog__body,.el-dialog__header {
      padding: 0px;
    }
    .el-dialog__headerbtn {
      z-index: 1;
    }
  }
  .per-semblance {
    position: relative;
    >span {
      position: absolute;
      left: 10px;
      display: block;
      height: 40px;
      line-height: 40px;
      z-index: 9;
      color: #999999;
    }
    >i {
      color: #0C70F8;
      cursor: pointer;
      font-size: 20px;
    }
    .el-input {
      width: 204px;
      margin-right: 8px;
      /*input{*/
        /*text-indent: 10px;*/
      /*}*/
    }
  }
  .per-semblance-is-max {
    >i {
      color: #D3D3D3;
      cursor: not-allowed;
    }
  }
</style>
