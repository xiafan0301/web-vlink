<template>
  <div class="ljd point">
    <div is="vlBreadcrumb"
         :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
        {name: '落脚点分析', routerName: 'portrait_ljd'},{name: '搜索结果'}]">
    </div>
    <div class="left">
      <div class="plane">
        <template v-if="showNewTask">
          <el-form
                  :model="ruleForm"
                  status-icon
                  ref="ruleForm"
                  label-width="0px"
                  class="demo-ruleForm"
          >
            <el-form-item  prop="data1">
              <el-date-picker
                      v-model="ruleForm.data1"
                      type="datetime"
                      time-arrow-control
                      :clearable="false"
                      placeholder="开始时间"
                      :picker-options="pickerOptions"
                      class="full vl_date"
              ></el-date-picker>
            </el-form-item>
            <el-form-item  prop="data2">
              <el-date-picker
                      v-model="ruleForm.data2"
                      type="datetime"
                      time-arrow-control
                      :clearable="false"
                      :picker-options="pickerOptions"
                      placeholder="结束时间"
                      class="full vl_date vl_date_end"
              ></el-date-picker>
            </el-form-item>
            <el-form-item style="text-align: center;">
              <div style="padding: 0 15px; height: 210px;">
                <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit" :imgData="imgData"></div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-button @click="resetForm" class="full">取消</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" :loading="isload" @click="submitForm" class="select_btn full">确定</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </template>
        <template v-else >
          <img :src="taskDetail.faceUrl" alt="">
          <!--<img src="http://file.aorise.org/vlink/image/447e505b-03f9-4775-8416-68ca3f9e6ee5.jpg" alt="">-->
          <div class="vl_p_ljd_left_line" v-show="taskDetail.taskName">
            <span>任务名称：</span>{{taskDetail.taskName}}
          </div>
          <div class="vl_p_ljd_left_line">
            <span>所选时间：</span>
            <span>
              <p>{{taskDetail.startTime}}</p>
              <p>{{taskDetail.endTime}}</p>
            </span>
          </div>
          <div class="update_task">
            <el-button type="primary" @click="initParams">修改任务</el-button>
          </div>
        </template>
      </div>
    </div>
    <div :class="['vl_ljd_right']">
      <div class="frequent-a-content">
        <div class="vl_jig_right" :class="{'hide': !reselt}">
          <ul class="map_rrt_u2">
            <li  @click="resemt"><i class="el-icon-aim"></i></li>
            <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
            <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
          </ul>
          <div class="reselt" v-if="reselt">
            <div class="plane insetPadding">
              <h3 class="title">分析结果</h3>
              <el-table :data="chooseData" style="width: 100%;" :height="tableHeight" @row-click="createInfoWindow($event)">
                <el-table-column  type="index" width="38px" label="序号"></el-table-column>
                <el-table-column  prop="address" :show-overflow-tooltip="true" label="落脚点位置"></el-table-column>
                <el-table-column prop="stopOverTime" width="120px" sortable label="停留时长">
                  <template slot-scope="scope">
                    <span>{{ scope.row.stopOverTime | transMinute }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="insetLeft2" @click="reselt = false"></div>
            </div>
          </div>
          <div class="insetLeft" v-show="!reselt" @click="reselt = true"></div>
        </div>
      </div>
    </div>
    <div id="mapBox"></div>

    <!-- 人工筛选 -->
    <el-dialog
            title="人工筛选"
            :visible.sync="dialogChoose"
            :close-on-click-modal="false"
            width="900px">
      <div style="height: 350px;">
        <div style="height: 96%">
          <vue-scroll>
            <div class="ljd_plane_main">
              <!--可以展开列表-->
              <div class="infinite-list-wrapper">
                <ul>
                  <li class="p_main_list" :class="{'is_open': !item.isClose}" v-for="item in curAllLeftEvData" :key="item.id">
                    <div class="p_main_head" @click="item.isClose = !item.isClose">
                      <i :class="{'el-icon-caret-right': item.isClose, 'el-icon-caret-bottom': !item.isClose}"></i>{{item.time}}({{item.count}}次)
                      <span class="del_icon el-icon-delete" @click.stop="delOneDay(item)"></span>
                    </div>
                    <div class="p_main_item p_main_dialog_item" v-for="(sItem, sIndex) in item.records" :key="sItem.id">
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

    <!-- 视频播放 -->
    <div is="mapVideoPlay" :oData="mapVideoData"></div>
  </div>
</template>
<script>
  import { mapXupuxian } from "@/config/config.js";
  import vlBreadcrumb from '@/components/common/breadcrumb.vue';
  import mapVideoPlay from '@/components/common/mapVideoPlay.vue';
  import {
    PortraitPostStayPointTask,
    PortraitGetStayPointTaskByUid
  } from '@/views/index/api/api.portrait.js'
  import {formatDate, dateOrigin, transMinute} from '@/utils/util.js';
  import vlUpload from '@/components/common/upload.vue';
  export default {
    components: {
      vlBreadcrumb,
      vlUpload,
      mapVideoPlay
    },
    data() {
      return {
        taskDetail: {},
        showNewTask: false, // 展示修改任务
        hoverWindow: null,
        tableHeight: 400,
        curInfoWinVideoPath: '',
        pagination: { total: 0, pageSize: 10, pageNum: 1 },
        mapVideoData: null,

        uploadClear: {},
        seData:null,
        isload:false,
        dialogChoose:false,
        showDetail:false,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now();
          }
        },

        imgData: null,
        amap: null,
        // select: "",
        reselt: false,
        ruleForm: {
          data1: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)),
          data2: new Date()
        },
        activeChoose: [],
        chooseData:[],
        evData: []
      };
    },
    mounted() {
      let map = new window.AMap.Map("mapBox", {
        zoom: 10,
        center: mapXupuxian.center
      });
      map.setMapStyle("amap://styles/whitesmoke");
      this.amap = map;
      this.randerMap();
      this.getDetail();
      // 监听地图信息窗体点击事件
      $('body').on('click', '.vl_vehicle_ljd_mk_p', () => {
        this.showVideo(this.curInfoWinVideoPath);
      })
    },
    computed: {
      choosedHisPic() {
        return this.historyPicList.filter(x => x.checked);
      },
      // 过滤allLeftEvData里面list为空的数据，人工筛选的时候全部删除自动去除一列
      curAllLeftEvData () {
        return this.evData.filter(x => x.records.length)
      }
    },
    methods: {
      initParams () {
        this.showNewTask = true;
        let {startTime, endTime, faceUrl} = this.taskDetail;
        this.ruleForm.data1 = new Date(startTime).getTime();
        this.ruleForm.data2 = new Date(endTime).getTime();
//        this.curImageUrl = faceUrl;
        this.imgData = {
          path: faceUrl
        }
      },
      // 获取离线任务详情
      getDetail () {
        const id = this.$route.query.uid
        if (id) {
          PortraitGetStayPointTaskByUid({uid: id})
            .then(res => {
              if (res && res.data) {
                this.$set(res.data, 'taskResult', JSON.parse(res.data.taskResult));
                this.$set(res.data, 'taskWebParam', JSON.parse(res.data.taskWebParam));
                this.taskDetail = res.data.taskWebParam;
                if (!res.data.taskResult || res.data.taskResult.length === 0) {
                  this.$message.info("抱歉，没有找到匹配结果");
                  this.chooseData = [];
                  this.evData = [];
                  //this.searching = false;
                  return false;
                }else{
                  this.dialogChoose = true;
                  res.data.taskResult.forEach(x => {
                    x.isClose = false;
                  });
                  this.evData = res.data.taskResult;
                }
              }
            })
        }
      },
      createInfoWindow (obj) {
        let _sContent = `<div class="vl_vehicle_ljd_mk_p"><img class="igm" src="${obj.storagePath}"><p class='addres'>${obj.address} <i class='el-icon-caret-right'></i></p><p class='times'>${transMinute(obj.stopOverTime)}</p></div>`;
        this.hoverWindow = new window.AMap.InfoWindow({
          isCustom: true,
          closeWhenClickMap: true,
          offset: new window.AMap.Pixel(-2, -50), // 相对于基点的偏移位置
          content: _sContent
        });
        this.hoverWindow.open(this.amap, new window.AMap.LngLat(obj.shotPlaceLongitude, obj.shotPlaceLatitude));
        this.curInfoWinVideoPath = obj.videoPath;
        this.amap.setCenter([obj.shotPlaceLongitude, obj.shotPlaceLatitude])
      },
// 跳至分析结果页面
      skipResultPage (obj) {
        this.$router.push({name: 'portrait_ljd_jg', query: { id: obj.uid }});
      },

      randerMap () {
        this.$nextTick(() => {
          $('.vl_jig_right').append($('#mapBox'))
//        this.amap.clearMap();
//        this.drawMarkers(this.chooseData);
          this.tableHeight = $('#mapBox').height() - 140;
        })
      },
      uploadEmit (data) {
        console.log('uploadEmit data', data);
        if (data && data.path) {
          this.curImageUrl = data.path;
        }
      },
      mapZoomSet(val) {
        if (this.amap) {
          this.amap.setZoom(this.amap.getZoom() + val);
        }
      },
      resemt(){
        if (this.amap) {
          this.amap.setZoomAndCenter(14, mapXupuxian.center);
        }
      },
      submitForm() {
        if (
            this.ruleForm &&
            this.ruleForm.data1 &&
            this.ruleForm.data2  &&
            this.curImageUrl
        ) {
          let params = {
            startTime: formatDate(this.ruleForm.data1),
            endTime: formatDate(this.ruleForm.data2),
            faceUrl: this.curImageUrl
          };
          this.isload = true;
          params.taskId = this.$route.query.uid;
          params.taskName = this.taskDetail.taskName;
          PortraitPostStayPointTask(params).then(res => {
            this.isload = false;
            if (res && res.data) {
              this.$message({
                type: 'success',
                message: '修改成功',
                customClass: 'request_tip'
              })
              this.$router.push({name: 'portrait_ljd'})
            }
          })
        } else {
          this.$message.info("请上传图片。");
        }
      },
      resetForm() {
        this.curImageUrl = "";
        this.ruleForm.data1 = dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000));
        this.ruleForm.data2 = new Date();
        this.uploadClear = {};
        this.showNewTask = false;
      },
      compare(prop) {
        return function(obj1, obj2) {
          var val1 = obj1[prop];
          var val2 = obj2[prop];
          if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
          }
          if (val1 < val2) {
            return 1;
          } else if (val1 > val2) {
            return -1;
          } else {
            return 0;
          }
        };
      },
      //分析结果删除
      delItems(d,index){
        //this.chooseData.
        let arr=this.evData[index].personDetailList
        arr.splice(d, 1)
        this.evData[index].totalNum -=1;
        if(this.evData[index].totalNum==0){
          this.evData.splice(index,1)
        }
        this.amap.clearMap();
        this.drawMarkers(this.evData);
      },
      //人工筛选删除
      delOneDay (item) {
        item.records.forEach((x, index) => {
          this.delSitem(item, x, index)
        })
      },
      delSitem (item, sItem, index) {
        item.records.splice(index, 1);
        item.times--;
        this.evData.splice(this.evData.findIndex(x => x === sItem), 1);
      },
      chooseCancel () {
        this.dialogChoose = false;
        this.evData = [];
        this.chooseData = [];
        this.reselt = false;
        this.amap.clearMap();
      },
      chooseOk(){
        this.reselt = true;
        this.dialogChoose = false
        this.chooseData = [];
        this.evData.forEach(x => {
          x.records.forEach(y => {
            this.chooseData.push(y)
          })
        })
        this.drawMarkers(this.chooseData);
      },
      drawMarkers(data) {
        console.log(data)
        let _this = this
        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          // 摄像头
          let _id = "vlPortraitLjdSxt" + i;
          let _content =
              "<div id=" +
              _id +
              ' class="vl_icon vl_jfo_sxt vl_icon_judge_04"></div>';
          let marker = new window.AMap.Marker({
            // 添加自定义点标记
            map: this.amap,
            position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new window.AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _content,
            zIndex: 100
          });
          marker.on('mouseover', function () {
            $("#" + _id).addClass("vl_icon_judge_02");
            _this.createInfoWindow(obj)
          })
          marker.on('mouseout', function () {
            $("#" + _id).removeClass("vl_icon_judge_02");
          })
        }
        this.amap.setFitView();
      },
      showVideo(path){
        this.mapVideoData = {
          name: Math.random(),
          url: path
        }
      }
    },
    beforeDestroy () {
      if (this.amap) {
        this.amap.destroy();
      }
      $('body').unbind('click');
    }
  };
</script>
<style lang="scss" scoped>
  .ljd_plane_main {
    min-height: 700px;
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
        width: 33%;
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
  .vl_ljd_right {
    display: inline-block;
    width: calc(100% - 272px);
    height: calc(100% - 59px);
    position: relative;
    .frequent-a-content {
      height: calc(100% - 20px);
      min-height: 760px;
      margin: 20px;
      margin-bottom: 0px;
      background: #ffffff;
      box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
      .tab-menu {
        background-color: #fff;
        padding-top: 8px;
        overflow: hidden;
        border-bottom: 1px solid #f2f2f2;
        li {
          float: left;
          width: auto;
          font-size: 16px;
          margin: 0 20px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          color: #333;
          cursor: pointer;
        }
        .is-active {
          color: #0c70f8;
          border-bottom: 2px solid #0c70f8;
        }
      }
      .search_box {
        width: 100%;
        padding: 20px;
        .event_form {
          width: 100%;
          .select_btn,
          .reset_btn {
            width: 80px;
          }
          .select_btn {
            background-color: #0c70f8;
            color: #ffffff;
          }
          .reset_btn {
            background-color: #ffffff;
            color: #666666;
            border-color: #dddddd;
          }
        }
        .divide {
          border: 1px dashed #fafafa;
        }
      }
      .content-box {
        padding: 0 20px;
        .table_box {
          margin-top: 10px;
          .operation_btn {
            display: inline-block;
            padding: 0 10px;
            border-right: 1px solid #f2f2f2;
            &:last-child {
              border-right: none;
            }
          }
        }
      }
      .vl_jig_right {
        width: 100%;
        height: calc(100% - 53px);
        position: relative;
        #mapBox {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .ljd_left_search_type {
    display: flex;
    color: #666666;
    margin: 10px 0px;
    span {
      display: block;
      width: 50%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid #D3D3D3;
      cursor: pointer;
      &:first-child {
        border-right: none;
        -webkit-border-radius: 4px 0px 0px 4px;
        -moz-border-radius: 4px 0px 0px 4px;
        border-radius: 4px 0px 0px 4px;
      }
      &:last-child {
        border-left: none;
        -webkit-border-radius: 0px 4px 4px 0px;
        -moz-border-radius: 0px 4px 4px 0px;
        border-radius: 0px 4px 4px 0px;
      }
    }
    .active {
      background: #0C70F8;
      color: #ffffff;
      border-color: #0C70F8;
    }
  }
  .ljd_left_radio {
    margin: 20px 0;
    display: flex;
    height: 40px;
    >span {
      display: block;
      &:first-child {
        width: 108px;
        line-height: 40px;
      }
    }
  }
  .el-radio__label { padding-left: 0; }
  .fz12{
    font-size: 12px;
  }
  .point {
    width: 100%;
    height: 100%;
    // overflow: hidden;
  }
  .breadcrumb_heaer {
    background: #ffffff;
  }
  .full {
    width: 100%;
  }
  .insetPadding {
    padding: 10px;
  }
  .right {
    width: 100%;
    height: calc(100% - 54px);
    float: right;
  }
  .reselt {
    width: 272px;
    height: calc(100% - 54px);
    background-color: #ffffff;
    position: absolute;
    left: 0px;
    z-index: 2;
    // overflow: hidden;
    box-shadow: 4px 0px 10px 0px #838383;
    box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
    animation: fadeInLeft 0.4s ease-out 0.3s both;
    .title {
      font-size: 14px;
      font-weight: bold;
      padding-bottom: 12px;
    }
  }
  .left {
    position: relative;
    width: 272px;
    height: calc(100% - 54px);
    min-height: 763px;
    background-color: #ffffff;
    float: left;
    z-index: 1;
    margin-left: 0px;
    /*box-shadow: 4px 0px 10px 0px #838383;*/
    /*box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);*/
    animation: fadeInLeft 0.4s ease-out 0.3s both;
    transition: marginLeft 0.3s ease-in;
    .plane {
      // padding: 20px;
      // position: relative;
      // height: 100%;
      // overflow: auto;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px;
      position: relative;
      height: 100%;
      > img {
        width: 232px;
        height: 232px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        margin-bottom: 30px;
      }
      .vl_p_ljd_left_line {
        color: #555555;
        margin-bottom: 20px;
        display: flex;
        span {
          /*width: 70px;*/
          text-align: right;
          display: block;
          color: #999999;
          p {
            color: #555555;
            text-align: left;
          }
          &:first-child {
            width: 85px;
          }
        }
      }
      .update_task {
        text-align: center;
      }
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
  .insetLeft2{
    position: absolute;
    right: -28px;
    width: 25px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    background-repeat: no-repeat;
    transform: rotate(180deg);
    background-image: url(../../../../assets/img/icons.png);
    background-position: -380px -1269px;
    cursor: pointer;
  }
  .insetLeft {
    position: absolute;
    left: 0px;
    z-index: 3;
    width: 25px;
    height: 178px;
    top: 50%;
    margin-top: -128px;
    display: inline-block;
    background-repeat: no-repeat;
    transform: rotate(180deg);
    background-image: url(../../../../assets/img/icons.png);
    background-position: -380px -1269px;
    cursor: pointer;
  }
  .insetLeft2:hover{
    transform: rotate(180deg);
    background-position: -318px -1269px;
  }
  .hide {
    .insetLeft,.insetLeft2 {
      transform: rotate(180deg);
      background-position: -504px -1269px;
    }
    .insetLeft,.insetLeft2:hover{
      transform: rotate(180deg);
      background-position: -440px -1269px;
    }
  }
  .select_btn {
    background-color: #0c70f8;
    color: #ffffff;
  }
  .select_btn:hover{
    background-color: #0466de;
  }
  .plane{
    height: 100%;
  }
  .imgInfo{
    position: relative;
    .timedata{
      padding: 2px 6px;
      display: inline-block;
      background:rgba(250,250,250,1);
      border:1px solid rgba(242,242,242,1);
      border-radius:2px;
      i{
        margin-right: 2px;
        color: #999999;
      }
    }
    .subdata{
      color: #0c70f8;
      line-height: 36px;
      b{
        padding-left: 5px;
        font-size: 28px;

      }
    }
    .img{
      float: left;
      width: 62px;
      height: 62px;
      margin-right: 8px;
      // margin-bottom: 8px
      display: block;
    }
    &:after{
      display: block;
      content: "";
      clear: both;
    }
  }
  .itembox{
    margin-bottom: 10px;
    padding-bottom: 10px;
    padding-top: 10px;
    border-bottom: solid 1px #f2f2f2;
    .del_list_icon {
      display: none;
    }
    &:hover {
      background-color: #E0F1FF;
      .timedata {
        border-color: transparent;
        background-color: transparent;
      }
      .del_list_icon {
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
  .result_device_name {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
<style lang="scss">
  .vl_vehicle_ljd_mk_p {
    /*display: none;*/
    position: relative;
    width: 180px;
    height: auto;
    background: #ffffff;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    box-shadow: 4px 0px 10px 0px #838383;
    box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
    .times{
      position: absolute;
      left: 10px;
      top: 10px;
      background: #50CC62;
      padding: 0px 8px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      color: #ffffff;
    }
    .addres{
      right: 10px;
      text-align: left;
      position: absolute;
      left: 10px;
      bottom: 10px;
      color: #ffffff;
      i{
        float: right;
        font-size: 24px;;
      }
    }
    .igm{
      width: 100%;
      height: 100px;
      background: #666666;
    }
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
    &.vl_jig_mk_img_show{
      display: block;
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
  .choose{
    .el-collapse-item__content{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
  .limitBox{
    height: 96%;

    .el-collapse-item{
      .el-collapse-item__header{
        background: #F6F6F6;
        padding-left: 10px;
        height: 40px;
        line-height: 40px;
      }
    }
    .el-collapse-item__content{
      padding: 10px;
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
  .ljd {
    .el-date-editor .el-range-input{
      font-size: 13px;
    }
    .insetIput.el-input--prefix .el-input__inner {
      padding-left: 90px;
    }
    .el-dialog__wrapper .el-dialog__body {
      padding: 0px;
    }
    .el-dialog__header {
      padding: 0px 20px 3px;
    }
    .el-dialog__headerbtn {
      z-index: 1;
    }
    .el-dialog__title{
      line-height: 48px;
    }
    // 上传
    .upload_warp .vl_jtc_upload {
      .el-upload {
        width: 100%;
        height: 100%;
        background: #f2f2f2;
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
      .el-upload:hover{
        background: #0c70f8;
        span{
          color: #ffffff;
        }
      }
    }
    .el-form-item__label{
      padding-right: 0px;
    }
    .history-pic-dialog {
      .el-dialog {
        max-width: 12.6rem;
        width: 100% !important;
      }
      .el-dialog__title {
        font-size: 0.16rem;
        color: #333333;
      }
      .el-dialog__body {
        padding: 0 0.76rem 0.3rem;
      }
      .his-pic-box {
        width: 100%;
        height: 4.6rem !important;
        .his-pic-item {
          float: left;
          width: 1.38rem;
          height: 1.38rem;
          border: 0.02rem solid #ffffff;
          margin-right: 0.2rem;
          margin-bottom: 0.2rem;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .active {
          border-color: #0c70f8;
        }
      }
      .el-dialog__footer {
        button {
          width: 1.4rem !important;
          height: 0.4rem;
          line-height: 0.4rem;
          padding: 0;
        }
      }
    }
  }
</style>
<style>
  .ljd .demo-ruleForm .el-radio__label { padding-left: 0; }
</style>