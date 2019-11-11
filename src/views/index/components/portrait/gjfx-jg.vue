<template>
  <div class="point">
    
    <!-- <div> -->
      <div is="vlBreadcrumb"
        :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
        {name: '轨迹分析', routerName: 'portrait_gjfx'},
        {name: '分析结果'}]">
      </div>
    <!-- </div> -->
    <div class="vl_gjfx_jg_left">
      <template v-if="showNewTask">
        <div class="plane">
          <el-form
            :model="ruleForm"
            status-icon
            ref="ruleForm"
            label-width="0px"
            class="demo-ruleForm"
            >
            <p class="task_name">
              <span>任务名称：</span>
              <span>{{taskDetail.taskName}}</span>
            </p>
            <el-form-item prop="data1">
              <el-date-picker
                v-model="ruleForm.data1"
                style="width: 100%;"
                class="vl_date"
                :picker-options="pickerOptions"
                type="datetime"
                time-arrow-control
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                style="width: 100%;"
                class="vl_date vl_date_end"
                v-model="ruleForm.data2"
                :time-arrow-control="true"
                :picker-options="pickerOptions"
                @change="chooseEndTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <div class="upload_warp">
                <div style="padding: 0px 15px; height: 210px;">
                  <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit" :imgData="imgData"></div>
                </div>
              </div>
            </el-form-item>
            <el-form-item style="margin-top: 20px;">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-button @click="resetForm('ruleForm')" class="full">取消</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" :loading="searchLoading" @click="submitForm()" class="select_btn full">确定</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template v-else>
        <ul>
          <li v-if="taskDetail.uploadImgUrls">
            <img :src="taskDetail.uploadImgUrls" alt="">
          </li>
          <li>
            <span>任务名称：</span>
            <span>{{taskDetail.taskName ? taskDetail.taskName : '无'}}</span>
          </li>
          <li>
            <span>分析时间：</span>
            <span>
            <p>从{{taskDetail.startTime ? taskDetail.startTime : '无'}}</p>
            <p>至{{taskDetail.endTime ? taskDetail.endTime : '无'}}</p>
          </span>
          </li>
        </ul>
        <div class="update_task">
          <el-button type="primary" @click="showNewTask = true;">修改任务</el-button>
        </div>
      </template>
      <div class="insetLeft2 vl_icon vl_icon_vehicle_03" v-show="hideleft" @click="showResult"></div>
    </div>
    <div class="right" id="rightGjfxJgMap"></div>
    <div class="reselt" v-if="reselt && showLeft">
      <div class="plane insetPadding">
        <h3 class="title">分析结果<p>共经过{{totalAddressNum}}个地方，出现{{totalMapNum}}次</p></h3>
        <!--<div class="sup_title">-->
        <!--<div  @click="timeOrderS">时间排序 <span><i class="el-icon-caret-top" :class="{'active': !timeOrder}"></i><i :class="{'active': timeOrder}" class="el-icon-caret-bottom"></i></span></div>-->
        <!--<div>({{}}次)</div>-->
        <!--</div>-->
        <div class="plane_main_box"  @scroll="scrollIt">
          <!--<vue-scroll>-->
          <div class="plane_main">
            <!--可以展开列表-->
            <div class="infinite-list-wrapper" v-if="leftEvData.length" >
              <ul>
                <li class="p_main_list" :class="{'is_open': item.isOpen}" v-for="item in leftEvData" :key="item.id">
                  <div class="p_main_head" @click="item.isOpen = !item.isOpen"><i :class="{'el-icon-caret-right': !item.isOpen, 'el-icon-caret-bottom': item.isOpen}"></i>{{item.label}}({{item.times}}次)</div>
                  <div class="p_main_item" v-for="sItem in item.list" :key="sItem.id" @click="toSnapDetail(evData.findIndex(function (u) {return u === sItem}))">
                    <div class="info">
                      <div class="info_left">
                        <img :src="sItem.subStoragePath" alt="">
                      </div>
                      <div class="info_right">
                        <p class="time"><i class="vl_icon vl_icon_retrieval_01"></i>{{sItem.shotTime.slice(-8)}}</p>
                        <div><i class="vl_icon vl_icon_retrieval_03"></i>{{sItem.semblance ? (sItem.semblance * 1).toFixed(2) : '0.00'}}%</div>
                      </div>
                    </div>
                    <div class="address"><i class="el-icon-location-outline"></i>{{sItem.bayonetAddress ? sItem.bayonetAddress : sItem.address}}</div>
                    <div class="del_icon el-icon-delete" @click.stop="updateLine(sItem)"></div>
                  </div>
                </li>
              </ul>
              <p style="line-height: 40px;color: #0C70F8;text-align: center;" v-if="loading">加载中...</p>
              <p style="line-height: 40px;color: #999999;text-align: center;" v-if="noMore">没有更多了</p>
            </div>
            <p v-show="leftEvData.length === 0" style="line-height: 40px;color: #999999;text-align: center;">暂无数据</p>
          </div>
          <!--</vue-scroll>-->
        </div>
        <div class="insetLeft2 vl_icon vl_icon_vehicle_02" :class="{'vl_icon_vehicle_03': hideleft}" @click="hideResult"></div>
      </div>
    </div>
    <!--地图操作按钮-->
    <ul class="map_rrt_u2">
      <li @click="resetZoom"><i class="el-icon-aim"></i></li>
      <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
      <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
    </ul>
    <!-- 视频接力---速度信息tab选择 -->
    <div class="speed_info_box" :class="{'hide_speed': hideleft}" v-show="showLeft">
      <ul class="speed_info_list">
        <li :class="{'isCheck_li': isCheckedVideo}" @click="showVideoList">
          <i class="vl_icon vl_icon_clgj_video"></i>
          <span>视频接力</span>
        </li>
        <li>
          <el-checkbox v-model="isCheckedSpeed">速度信息</el-checkbox>
        </li>
      </ul>
    </div>
    <!--右侧区域列表-->
    <!-- 车速信息 -->
    <div class="speed_info_right" v-if="isCheckedSpeed">
      <vue-scroll>
        <div class="speed_box">
          <ul class="simple_speed">
            <li class="speed_title">
              <p>2019-9-30 15:05:18</p>
              <p>平均速度</p>
            </li>
            <li class="speed_addr">
              <p class="addr_name">新姚南路与黑石铺路交叉路口</p>
              <p class="num">35</p>
            </li>
            <li class="speed_distance">
              <p class="dis_desc">两次抓拍距离: <span class="dis_num">0.7 KM</span></p>
              <p>KM/H</p>
            </li>
          </ul>
          <ul class="simple_speed">
            <li class="speed_title">
              <p>2019-9-30 15:05:18</p>
              <p>平均速度</p>
            </li>
            <li class="speed_addr">
              <p class="addr_name">新姚南路与黑石铺路交叉路口</p>
              <p class="num">35</p>
            </li>
            <li class="speed_distance">
              <p class="dis_desc">两次抓拍距离: <span class="dis_num">0.7 KM</span></p>
              <p>KM/H</p>
            </li>
          </ul>
          <ul class="simple_speed">
            <li class="speed_title">
              <p>2019-9-30 15:05:18</p>
              <p>平均速度</p>
            </li>
            <li class="speed_addr">
              <p class="addr_name">新姚南路与黑石铺路交叉路口</p>
              <p class="num">35</p>
            </li>
            <li class="speed_distance">
              <p class="dis_desc">两次抓拍距离: <span class="dis_num">0.7 KM</span></p>
              <p>KM/H</p>
            </li>
          </ul>
        </div>
      </vue-scroll>
    </div>

    <!--人工筛选-->
    <el-dialog
      title="人工筛选"
      :visible.sync="filterDialog"
      :close-on-click-modal="false"
      width="900px">
      <div style="height: 350px;">
        <div style="height: 96%">
          <vue-scroll>
            <div class="plane_main">
              <!--可以展开列表-->
              <div class="infinite-list-wrapper">
                <ul>
                  <li class="p_main_list" :class="{'is_open': item.isOpen}" v-for="item in curAllLeftEvData" :key="item.id">
                    <div class="p_main_head" @click="item.isOpen = !item.isOpen">
                      <i :class="{'el-icon-caret-right': !item.isOpen, 'el-icon-caret-bottom': item.isOpen}"></i>{{item.label}}({{item.times}}次)
                      <span class="del_icon el-icon-delete" @click.stop="delOneDay(item)"></span>
                    </div>
                    <div class="p_main_item p_main_dialog_item" v-for="(sItem, sIndex) in item.list" :key="sItem.id">
                      <div class="info">
                        <div class="info_left">
                          <img :src="sItem.subStoragePath" alt="">
                        </div>
                        <div class="info_right">
                          <p class="time"><i class="vl_icon vl_icon_retrieval_01"></i>{{sItem.shotTime.slice(-8)}}</p>
                          <div><i class="vl_icon vl_icon_retrieval_03"></i>{{sItem.semblance ? (sItem.semblance * 1).toFixed(2) : '0.00'}}%</div>
                        </div>
                      </div>
                      <div class="address"><i class="el-icon-location-outline"></i>{{sItem.bayonetAddress ? sItem.bayonetAddress : sItem.address}}</div>
                      <div class="del_icon el-icon-delete" @click.stop="delSitem(item, sItem, sIndex)"></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </vue-scroll>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseCancel">取 消</el-button>
        <el-button type="primary" @click="chooseOk">确 定</el-button>
      </span>
    </el-dialog>

    <snapDialog ref="snapDialogComp" :snapObj="snapObj"></snapDialog>
  </div>
</template>
<script>
  import vlUpload from '@/components/common/upload.vue';
  import vlBreadcrumb from '@/components/common/breadcrumb.vue';
  import snapDialog from './components/snapDetail';
  // import flvplayer from '@/components/common/flvplayer.vue';
  import { mapXupuxian } from "@/config/config.js";
  import { objDeepCopy, formatDate, dateOrigin } from "@/utils/util.js";
  // import { cityCode } from "@/utils/data.js";
  import {PortraitPostPersonTrace} from "@/views/index/api/api.portrait.js";
  import { getPeopleTaskDetail } from '@/views/index/api/api.analysis.js';
  export default {
    components: {vlBreadcrumb, vlUpload, snapDialog},
    data() {
      return {
        showNewTask: false, // 展示修改任务

        isCheckedSpeed: false, // 是否勾选了速度信息
        isCheckedVideo: false, // 是否选择了视频接力
        snapObj: {}, // 弹框抓拍详情内容

        taskDetail: {},
        imgData: null,
        uploadClear: {},
        filterDialog: false,
        showLeft: false,
        loading: false,
        count: 3,
        totalAddressNum: 0,
        totalMapNum: 4,
        searchLoading: false,
        amap: null,
        reselt: false,
        hideleft: false,
        timeOrder: false,
        ruleForm: {
          data1: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)),
          data2: new Date(),
          input3: '',
          value1: null,
        },
        pickerOptions: {
          disabledDate (time) {
            return time > new Date();
          }
        },
        evData: [],
        leftEvData: [],
        allLeftEvData: [],
        marks: [[], []],
        markerLine: [], // 地图线集合
        markerPoint: [], // 地图点集合
      };
    },
    computed: {
      noMore () {
        return this.count >= this.totalMapNum;
      },
      // 过滤allLeftEvData里面list为空的数据，人工筛选的时候全部删除自动去除一列
      curAllLeftEvData () {
        return this.allLeftEvData.filter(x => x.list.length)
      }
    },
    mounted() {
      this.renderMap();
      if (this.$route.query.uid) {
        this.getDetail();
      }
    },
    methods: {
      //详情弹窗
      toSnapDetail(i) {
        this.snapObj = {
          personDetailList: this.evData,
          index: i,
          type: '轨迹分析'
        };
        this.$refs["snapDialogComp"].toogleVisiable(true);
      },
      // 视频接力
      showVideoList () {
        this.isCheckedVideo = !this.isCheckedVideo;
      },
      // 获取离线任务详情
      getDetail () {
        const id = this.$route.query.uid
        if (id) {
          getPeopleTaskDetail(id)
            .then(res => {
              if (res) {
                this.$set(res.data, 'taskResult', JSON.parse(res.data.taskResult));
                this.$set(res.data, 'taskWebParam', JSON.parse(res.data.taskWebParam));
                res.data.taskWebParam.deviceNames = res.data.taskWebParam.deviceNames ? res.data.taskWebParam.deviceNames.split(',') : '';
                this.taskDetail = res.data.taskWebParam;
                let {startTime, endTime} = res.data.taskWebParam;
                this.ruleForm.data1 = new Date(startTime).getTime();
                this.ruleForm.data2 = new Date(endTime).getTime();
                console.log(res.data)
                this.imgData = {
                  cname: '带图' + Math.random(),
                  filePathName: '带图' + Math.random(),
                  path: this.taskDetail.uploadImgUrls
                }
                this.reselt = true;
                this.evData = res.data.taskResult;
                this.evData.forEach(x => {
                  if (x.bayonetName) {
                    x.DeviceID = x.bayonetName;
                  }
                })
                this.evData.sort(this.compare("shotTime", this.timeOrder ? false : true));
                this.shotAddressAndTimes(this.evData)

                //  重组数据，给左边列表使用
                this.operData(true);
                if (this.evData.length) {
                  this.filterDialog = true;
                }
              }
            })
        }
      },
      uploadEmit (data) {
        if (data && data.path) {
          this.ruleForm.input3 = data.path;
        } else {
          this.ruleForm.input3 = '';
        }
      },
      chooseEndTime (e) {
        if (e < this.ruleForm.data1) {
          this.$message.info('结束时间必须大于开始时间才会有结果')
        }
      },
      scrollIt (e) {
        if(e.srcElement.scrollTop + e.srcElement.offsetHeight > e.srcElement.scrollHeight - 10){
          if (!this.loading && !this.noMore) {
            this.loading = true;
            setTimeout(() => {
              this.count += 2;
              this.operData();
              this.loading = false;
            }, 2000)
          }
        }
      },
      setDTime () {
        this.ruleForm.data1 = dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000));
        this.ruleForm.data2 = new Date();
      },
      hideResult() {
        this.reselt = false;
        this.hideleft = true;
      },
      showResult() {
        this.reselt = true;
        this.hideleft = false;
      },
      submitForm() {
        if(this.ruleForm && this.ruleForm.data1 && this.ruleForm.data2 && this.ruleForm.input3){
          let pg = {
          }
          pg['startTime'] = formatDate(this.ruleForm.data1);
          pg['endTime'] = formatDate(this.ruleForm.data2);
          pg['uploadImgUrls'] = this.ruleForm.input3;
          pg['taskId'] = this.$route.query.uid;
          pg['taskName'] = this.taskDetail.taskName;
          pg['taskOperateType'] = 1;
          this.getVehicleShot(pg);
        }else{
          this.$message.info("请上传图片");
        }
      },
      resetForm(){
        this.setDTime();
        this.ruleForm.input3 = '';
        this.ruleForm.value1 = [];
        this.uploadClear = {};
        this.setDTime ();
        this.showNewTask = false;
      },
      renderMap() {
        let map = new window.AMap.Map("rightGjfxJgMap", {
          zoom: 10,
          center: mapXupuxian.center
        });
        map.setMapStyle("amap://styles/whitesmoke");
        this.amap = map; 
      },
      compare  (prop, bool) {
        return function (obj1, obj2) {
          var val1 = obj1[prop];
          var val2 = obj2[prop];
          if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
          }
          if (val1 < val2) {
            if (bool) {
              return -1;
            } else {
              return 1;
            }
          } else if (val1 > val2) {
            if (bool) {
              return 1;
            } else {
              return -1;
            }
          } else {
            return 0;
          }
        }
      },
      getVehicleShot(d) {
        this.searchLoading = true;
        PortraitPostPersonTrace(d).then((res) => {
          this.searchLoading = false;
          if (res.data) {
            this.$message({
              type: 'success',
              message: '修改成功',
              customClass: 'request_tip'
            });
            this.$router.push({name: 'portrait_gjfx'});
          }
        }).catch(() => {
          this.searchLoading = false;
        });
      },
      shotAddressAndTimes (data) {
        this.totalMapNum = data.length;
        // 计算经过多少个地方
        let dvIds = [];
        this.totalAddressNum = 0;
        data.forEach(x => {
          if(!dvIds.includes(x.DeviceID)) {
            this.totalAddressNum += 1;
            dvIds.push(x.DeviceID);
          }
        })
      },
      operData (isAll) {
        this.leftEvData = [];
        this.allLeftEvData = [];
        let keyArr = [];
        this.evData.forEach((x, index) => {
          if (!isAll) {
            if (index <= this.count) {
              let key = x.shotTime.slice(0, 10);
              if (!keyArr.includes(key)) {
                keyArr.push(key);
                let obj = {label: key,isOpen: true};
                obj.list = [];
                obj.times = 1;
                obj.list.push(x);
                this.leftEvData.push(obj);
              } else {
                this.leftEvData.find(y => y.label === key).list.push(x);
                this.leftEvData.find(y => y.label === key).times += 1;
              }
            }
          } else {
            let key = x.shotTime.slice(0, 10);
            if (!keyArr.includes(key)) {
              keyArr.push(key);
              let obj = {label: key,isOpen: true};
              obj.list = [];
              obj.times = 1;
              obj.list.push(x);
              this.allLeftEvData.push(obj);
            } else {
              this.allLeftEvData.find(y => y.label === key).list.push(x);
              this.allLeftEvData.find(y => y.label === key).times += 1;
            }
          }
        })
      },
      delOneDay (item) {
        item.list.forEach((x, index) => {
          this.delSitem(item, x, index)
        })
      },
      delSitem (item, sItem, index) {
        item.list.splice(index, 1);
        item.times--;
        this.evData.splice(this.evData.findIndex(x => x === sItem), 1);
        this.shotAddressAndTimes(this.evData);
      },
      chooseCancel () {
        this.filterDialog = false;
        this.evData = [];
        this.reselt = false;
        this.amap.clearMap();
      },
      chooseOk () {
        this.showLeft = true;
        this.filterDialog = false;
        this.drawMapMarker(this.evData);
        this.operData();
      },
      //查询所有的设备
      objSetItem (list, obj) {
        list.map(z => {
          for (let key in obj) {
            z[key] = z[obj[key]] ? z[obj[key]] : obj[key]
          }
          // 都加上markSid , 方便处理移动端发起的通话
          if (!z['markSid']) {
            z['markSid'] = 'mapMark' + z['dataType'] + z['uid'];
          }
          return z;
        })
        return list;
      },
      //查询所有的卡口设备
      timeOrderS () {
        this.timeOrder = !this.timeOrder;
        this.getVehicleShot(this.storeParam)
      },
      drawMapMarker (oData) {
        let data = this.fitlerSXT(oData);
        for (let  i = 0; i < data.length; i++) {
          let obj = data[i];
          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            // 抓拍时间
            let _time = '';
            _time = '<p class="vl_map_mark_time">';
            obj.shotTime.split(',').forEach(j => {
              _time += `<span>${j}</span>`
            })
            _time += '</p>';

            let sClass = 'vl_icon_map_mark0';
            if (obj.bayonetName) {
              sClass = 'vl_icon_map_mark1';
            }
            let _content = `<div class="vl_icon ` + sClass + `">` + _time + `</div>`
            let point = new window.AMap.Marker({ // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              // 自定义点标记覆盖物内容
              content: _content
            });
            point.on('click', () => {
              this.toSnapDetail(i);
            })
            this.markerPoint[i] = [point];
          }
        }
        this.amap.setFitView();
        this.drawLine(oData);
      }, // 覆盖物（窗体和checkbox
      fitlerSXT (oData) {
        let data = objDeepCopy(oData), _arr = [];
        data.forEach(x => {
          let _i = _arr.findIndex(y => y.DeviceID === x.DeviceID);
          if (_i === -1) {
            _arr.push(x)
          } else {
            _arr[_i]['shotTime'] += ',' + x.shotTime;
          }
        })
        return _arr;
      },
      drawLine (oData) {
        let path = [];
        oData.forEach(obj => {
          let _path = [obj.shotPlaceLongitude, obj.shotPlaceLatitude];
          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            path.push(_path);
          }
        })
        var polyline = new window.AMap.Polyline({
          path: path,
          showDir: true,
          strokeColor: '#61C772',
          strokeWeight: 6
        });
        this.markerLine.push(polyline);
        this.amap.add([polyline]);
      }, // 画线
      updateLine (obj) {
        this.amap.clearMap();
        let _i = this.evData.indexOf(obj);
        this.evData.splice(_i, 1);
        this.shotAddressAndTimes(this.evData);
        this.operData();
        this.drawMapMarker(this.evData)
      }, // 更新画线
      mapZoomSet (val) {
        if (this.amap) {
          this.amap.setZoom(this.amap.getZoom() + val);
        }
      },
      resetZoom () {
        if (this.amap) {
          this.amap.setZoomAndCenter(14, mapXupuxian.center);
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
/* 车速信息 */
.speed_info_right {
  position: absolute;
  top: 70px;
  right: 20px;
  width: 380px;
  background-color: #fff;
  box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39);
  .speed_box {
    max-height: 4.2rem;
    .simple_speed {
      padding: 12px 0;
      margin: 0 20px;
      border-bottom: 1px solid #f2f2f2;
      li {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 0 2px 0 4px;
      }
      .speed_title {
        color: #999;
        font-size: 12px;
      }
      .speed_addr {
        font-size: 16px;
        color: #333;
        .addr_name {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          padding-right: 20px;
        }
        .num {
          font-size: 32px;
          color: #0C70F8;
        }
      }
      .speed_distance {
        font-size: 14px;
        color: #333;
        .dis_desc {
          color: #666;
        }
        .dis_num {
          color: #0C70F8;
        }
      }
    }
  }
}
/* 视频接力--速度信息 tab * */
.speed_info_box {
  z-index: 111;
  animation: fadeInLeft 0.7s ease-out 0.6s both;
  background-color: #ffffff;
  box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39);
  width: 238px;
  position: absolute;
  top: 74px;
  left: 593px;
  height: 50px;
  line-height: 50px;
  .speed_info_list {
    width: 220px;
    margin-left: 16px;
    margin-top: 10px;
    >li {
      width: 50%;
      float: left;
      color: #666666;
      height: 30px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
      &:first-child {
        border-right: 1px solid #F2F2F2;
      }
      .vl_icon_clgj_video {
        margin-right: 5px;
        width: 14px;
        height: 14px;
        background-position: -1064px -1538px;
        background-color: #666;
        border-radius: 50%;
        line-height: 1;
        vertical-align: middle;
        margin-bottom: 2px;
      }
    }
    .isCheck_li {
      background-color: #0C70F8;
      color: #ffffff;
      border-radius: 4px;
      .vl_icon_clgj_video {
        background-color: #0C70F8;
      }
    }
  }
}
.hide_speed {
  left: 300px !important;
}
  .vl_gjfx_jg_left {
    position: absolute;
    left: 0;
    width: 272px;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    height: calc(100% - 56px);
    min-height: 788px;
    background: #ffffff;
    box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
    animation: fadeInLeft .4s ease-out .3s both;
    z-index: 9;
    > ul {
      width: 100%;
      margin-bottom: 20px;
      // padding-left: 20px;
      li:nth-child(1) {
        img {
          display: inline-block;
          width: 232px;height: 232px;
          border-radius: 10px;
        }
      }
      li {
        padding-bottom: 10px;
        span:nth-child(1) {
          color: #999;
          display: inline-block;
          width: 75px;
          vertical-align: top;
        }
        span:nth-child(2) {
          display: inline-block;
          width: calc(100% - 75px);
          color: #555;
        }
      }
    }
    .plane {
      .task_name {
        margin-bottom: 10px;
        span:first-child {
          color: #999999;
        }
        span:last-child {
          color: #333333;
        }
      }
    }
    // > img {
    //   width: 232px;
    //   height: 232px;
    //   -webkit-border-radius: 4px;
    //   -moz-border-radius: 4px;
    //   border-radius: 4px;
    //   margin-bottom: 30px;
    // }
    // .vl_ytsr_left_line {
    //   color: #555555;
    //   margin-bottom: 20px;
    //   display: flex;
    //   span {
    //     /*width: 70px;*/
    //     text-align: right;
    //     display: block;
    //     color: #999999;
    //     p {
    //       color: #555555;
    //       text-align: left;
    //     }
    //     &:first-child {
    //       width: 85px;
    //     }
    //   }
    // }
    .update_task {
      text-align: center;
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
  .upload_warp {
    position: relative;
    .del_icon {
      display: none;
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: rgba(0, 0, 0, 0.4);
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      color: #ffffff;
    }
    &:hover {
      .del_icon {
        display: block;
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
  .full {
    width: 100%;
  }
  .insetPadding {
    padding: 10px;
    height: 100%;
  }
  .right.hide {
    width: calc(100% - 272px);
    height: calc(100% - 54px);
    float: right;
    min-height: 560px;
  }
  .right {
    width: calc(100% - 272px);
    height: calc(100% - 54px);
    float: right;
  }
  .reselt {
    width: 290px;
    height: calc(100% - 54px);
    background-color: #ffffff;
    position: absolute;
    left: 273px;
    z-index: 2;
    /*box-shadow: 4px 0px 10px 0px #838383;*/
    /*box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);*/
    animation: fadeInLeft 0.4s ease-out 0.3s both;
    .title {
      font-size: 16px;
      font-weight: bold;
      padding-top: 10px;
      padding-bottom: 19px;
      color: #333333;
      p {
        color: #999999;
        font-size: 12px;
        font-weight: normal;
        margin-left: 20px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .sup_title {
      height: 40px;
      line-height: 40px;
      background: #F6F6F6;
      color: #333333;
      > div {
        display: inline-block;
        width: 50%;
        text-align: center;
        &:first-child {
          cursor: pointer;
          >span {
            display: inline-block;
            height: 25px;
            vertical-align: middle;
            i {
              display: block;
              height: 10px;
            }
            .active {
              color: #2580FC;
            }
          }
        }
      }
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
  .insetLeft2 {
    position: absolute;
    right: -28px;
    width: 28px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    cursor: pointer;
  }
  .select_btn {
    background-color: #0c70f8;
    color: #ffffff;
  }
  .plane_main_box {
    height: calc(100% - 44px);
    padding-top: 10px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .plane_main {
    // min-height: 700px;
    .p_main_list {
      height: 40px;
      overflow: hidden;
      -webkit-transition: all .3s;
      -moz-transition: all .3s;
      -ms-transition: all .3s;
      -o-transition: all .3s;
      transition: all .3s;
      border: 1px solid #D3D3D3;
      margin-bottom: 10px;
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
        span {
          margin-left: 30px;
          font-size: 20px;
          color: #999999;
          vertical-align: middle;
          &:hover {
            color: #0C70F8;
          }
        }
      }
      .p_main_item {
        width: 100%;
        cursor: pointer;
        position: relative;
        &:hover{
          background: #E0F3FF;
          .del_icon{
            display: block;
          }
          .info {
            .info_right{
              .time {
                background: #E0F3FF;
              }
            }
          }
        }
        .info {
          width: 100%;
          padding: 10px;
          .info_left {
            display: inline-block;
            width: 100px;
            height: 100px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .info_right {
            display: inline-block;
            width: 130px;
            height: 46px;
            padding-left: 10px;
            float: right;
            >div {
              font-size: 20px;
              color: #0C70F8;
              font-weight: bold;
              margin-top: 10px;
              i {
                margin: 0 4px;
                vertical-align: text-bottom;
              }
            }
            .time {
              color: #333333;
              vertical-align: bottom;
              background: #FAFAFA;
              border: 1px solid #F2F2F2;
              height: 24px;
              line-height: 24px;
              i{
                color: #999999;
                vertical-align: middle;
                margin: 0 4px;
              }
            }
          }
        }
        .address {
          line-height: 39px;
          color: #666666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          /*border-bottom: 1px solid #F2F2F2;*/
          padding: 0 30px 0 10px;
        }
        .del_icon {
          font-size: 20px;
          position: absolute;
          bottom: 10px;
          right: 4px;
          display: none;
          color: #999999;
          &:hover {
            color: #0C70F8;
          }
        }
      }
      .p_main_dialog_item {
        width: 32%;
        display: inline-block;
        border: 1px solid #D3D3D3;
        margin: 5px;
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
          background: url(../../../../assets/img/vehicle/cut1.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut1.hover {
          background: #f2f9ff url(../../../../assets/img/vehicle/cut1m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut2 {
          background: url(../../../../assets/img/vehicle/cut2.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut2.hover {
          background: #f2f9ff url(../../../../assets/img/vehicle/cut2m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut3 {
          background: url(../../../../assets/img/vehicle/cut3.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut4 {
          background: url(../../../../assets/img/vehicle/cut4.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut5 {
          background: url(../../../../assets/img/vehicle/cut5.png) center
          no-repeat;
          background-size: 80% 80%;
        }
        .cut3.hover {
          background: #f2f9ff url(../../../../assets/img/vehicle/cut3m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut4.hover {
          background: #f2f9ff url(../../../../assets/img/vehicle/cut4m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut5.hover {
          background: #f2f9ff url(../../../../assets/img/vehicle/cut5m.png) center
          no-repeat;
          background-size: 80% 80%;
        }
      }
    }
  }
</style>
<style lang="scss">
.speed_info_box {
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #0C70F8;
  }
}
.vl_gjfx_jg_left {
  .plane {
    .el-form-item {
      margin-bottom: 10px;
    }
  } 
}
  #rightGjfxJgMap {
    .vl_icon {
      width: 47px;
      position: relative;
      // >.video_list_info {
      //   background: red;
      //   position: absolute;
      //   top: 10px;
      //   left: 98%;
      //   width: 218px;
      //   height: 122px;
      //   border-radius: 3px;
      //   font-size: 12px;
      //   color: #fff;
      //   >img {
      //     width: 100%;
      //     height: 100%;
      //   }
      //   >p {
      //     width:218px;
      //     height:26px;
      //     background:rgba(0,0,0,1);
      //     opacity:0.7;
      //     position: absolute;
      //     bottom: 0;
      //     line-height: 26px;
      //     >span {
      //       display: inline-block;
      //       height:26px;
      //     }
      //   }
      // }
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
  }
  .struc_detail_dialog_gjfx {
    .el-dialog {
      max-width: 13.06rem;
      width: 100%!important;
      /* 祖先元素设置了transform属性则会导致固定定位属性position: fixed失效。 */
      transform: none !important;
      top: calc(100% - 8.8rem);
      left: calc((100% - 13.06rem)/2);
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
      height: 5rem;
      margin: 0 auto;
      border-bottom: 1px solid #F2F2F2;
      .struc_c_detail {
        width:  100%;
        height: 3.6rem;
        position: relative;
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
            border: .5rem solid #0C70F8;
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
              height: 2.75rem;
              ul {
                overflow: hidden;
                > li {
                  float: left;
                  width: 50%;
                  overflow: hidden;
                  margin-bottom: 15px;
                  display: flex;
                  > span {
                    line-height: 26px; height: 28px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    float: left;
                    overflow: hidden;
                    font-size: 14px;
                    &:first-child {
                      width: 68px;
                      background-color: #FAFAFA;
                      text-align: center;
                      border: 1px solid #f2f2f2;
                      border-radius: 4px 0 0 4px;
                      color: #999;
                    }
                    &:last-child {
                      max-width: 94px;
                      border: 1px solid #f2f2f2;
                      border-left: 0;
                      background-color: #fff;
                      padding: 0 9px 0 9px;
                      border-radius: 0 4px 4px 0;
                      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; word-break: break-all;
                    }
                  }
                }
              }
            }
            /*.struc_cdi_line {*/
              /*flex: none;*/
              /*width: 50%;*/
              /*display: inline-block;*/
              /*p {*/
                /*max-width: 100%;*/
                /*overflow: hidden;*/
                /*display: table;*/
                /*min-height: 30px;*/
                /*margin-bottom: 0.08rem;*/
                /*padding-right: 10px;*/
                /*margin-right: 0.08rem;*/
                /*border: 1px solid #f2f2f2;*/
                /*border-radius: 3px;*/
                /*font-size: 12px;*/
                /*> b {*/
                  /*width: 70px;*/
                  /*background: #fafafa;*/
                  /*color: #999;*/
                  /*font-weight: normal;*/
                  /*padding-right: 10px;*/
                  /*padding-left: 10px;*/
                  /*display: table-cell;*/
                  /*vertical-align: middle;*/
                  /*border-right: 1px solid #f2f2f2;*/
                /*}*/
                /*>span {*/
                  /*display: table-cell;*/
                  /*vertical-align: middle;*/
                  /*padding-left: 5px;*/
                /*}*/
              /*}*/
            /*}*/
          }
          &:before {
            display: block;
            content: none;
            position: absolute;
            top: -.7rem;
            right: -.7rem;
            transform: rotate(-46deg);
            border: .7rem solid #0c70f8;
            border-color: transparent transparent transparent #0C70F8;
          }
          &:after {
            display: block;
            content: none;
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
        .struc_t_btn {
          margin-top: .2rem;
          float: right;
          a {
            display: inline-block;
            text-align: center;
            line-height: .38rem;
            border: solid 1px #eeeeee;
            border-radius: 4px;
            margin-top: 10px;
            padding: 0px .15rem;
            text-decoration: none;
            margin-left: 10px;
            background: rgba(246, 248, 249, 1);
            border: 1px solid rgba(211, 211, 211, 1);
            cursor: pointer;
          }
          a:hover {
            background: #0c70f8;
            border: solid 1px #0c70f8;
            color: #ffffff;
          }
        }
      }
      // .struc_c_address {
      //   height: 100%;
      //   #capMap {
      //     width:  100%;
      //     height: 100%;
      //   }
      // }
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
</style>