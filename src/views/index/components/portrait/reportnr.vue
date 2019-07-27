<template>
  <div class="vehicle_content_nr">
    <div class="vc_rep_bd" is="vehicleBreadcrumb" :oData="[{name: '人员侦察报告内容'}]"></div>
    <div style="height: 50px"></div>
    <div class="vehicle_content_nr_box">
      <div class="vehicle_content_nr_box_left">
        <el-upload
            class="vl_jtc_upload_gjfx gjfx_upload"
            multiple
            :show-file-list="false"
            accept="image/*"
            :action="uploadAcion"
            list-type="picture-card">
          <div>
            <i
                style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;"
                class="vl_icon vl_icon_vehicle_01"
            ></i>
            <span style="position: absolute; top: 132px; left: 72px; color: #999999">点击上传图片</span>
          </div>
        </el-upload>
        <div style="color: #999999; text-align: center; margin-top: 8px">请上传全身照搜索更精准</div>
        <div style="margin-top: 10px">
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">开 始</span>
          <el-date-picker
              v-model="value1"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 212px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div style="margin-top: 10px">
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">结 束</span>
          <el-date-picker
              v-model="value2"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 212px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <el-button type="primary" style=" width: 100%; margin-top: 10px">档案分析</el-button>
      </div>
      <div class="vehicle_content_nr_box_right">
        <div class="vehicle_content_nr_box_right_top">
          <ul class="tab-menu">
            <li
                v-for="(item,index) in tabList"
                :key="index"
                :class="{'is-active': selectIndex === item.value}"
                @click="selectTab(item.value)"
            >{{item.label}}</li>
          </ul>
        </div>
        <div class="vehicle_content_nr_box_right_bot" id="report_content">
          <div class="cont" id="report_showtype_1">
            <div class="top">
              最相似人员档案
            </div>
            <div class="message">
              <div class="text">1：基本信息</div>
              <div class="message_cont">
                <img src="../../../../../public/static/img/vis-eg.png" height="200" width="200"/>
                <div style="padding-left: 20px; width: 320px">
                  <div class="subdata">
                    <i class="vl_icon vl_icon_retrieval_03" style="height: 24px"></i>
                    <b>99.12</b>%
                  </div>
                  <ul class="mes_cot">
                    <li><span>姓名：</span><p>冉金敏</p></li>
                    <li><span>证件类型：</span><p>冉金敏</p></li>
                    <li><span>证件号码：</span><p>432501199111110011</p></li>
                    <li><span>性别：</span><p>冉金敏</p></li>
                    <li><span>民族：</span><p>冉金敏</p></li>
                  </ul>
                </div>
                <div class="mes_cot_1">
                  <p>备注：</p>
                  <div>
                    人物简介，简单介绍先进集体中的每个先进人物，或单个英雄、模范人物时，运用的一种应用文样式。目的在于激励先进，促使人们互相学习，互相鼓励，共同前进。正文内容，通常包括被介绍人的姓名、性别、年龄、职业、突出贡献、获得的荣誉称号等。在介绍完人物的上述情况之后，必要的可以写一句半句歌颂、赞扬的话。对其贡献作出评价，以表明作者态度。
                  </div>
                </div>
              </div>
            </div>
            <div class="message_1 message">
              <div class="text">1：基本信息</div>
              <p>底库信息：底库1，底库2</p>
              <p>分组信息：分组1，分组2</p>
            </div>

          </div>
          <div class="cont1" id="report_showtype_2">
            <div style="background-color: white; color: #333333;
              font-weight: bold;
              padding: 20px;
              border-bottom: 1px solid #F2F2F2;
              font-size: 16px; margin-bottom: 10px">同行分析</div>
            <div>
              <div class="list-box">
                <ul class="rlcx_r_list clearfix">
                  <li v-for="item in 12" :key="item">
                    <div style="">
                      <img src="../../../../assets/img/666.jpg" alt="">
                      <div>
                        <h4>检索资料</h4>
                        <div><i class="vl_icon rlcx_sj"></i>18-12-24 14:12:17</div>
                        <p>
                          <span style="height: 30px;line-height: 30px;padding: 0 10px;display: inline-block;background: #fafafa;border: 1px solid #f2f2f2;border-radius: 3px;">男性</span>
                          <span style="height: 30px;line-height: 30px;padding: 0 10px;display: inline-block;background: #fafafa;border: 1px solid #f2f2f2;border-radius: 3px;margin-left: 8px;">青年</span>
                        </p>
                        <p><img src="../../../../assets/img/txfx_pao.png" alt=""><b style="color: #0C70F8;font-size: 34px;padding-left: 8px;">04</b><span style="color: #0C70F8;"> 同行次</span></p>
                        <div style="margin-top: 15px; cursor: pointer;border:1px solid #D3D3D3;border-radius:4px;background:rgba(246,248,249,1);color: #666;">查看同行记录</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
          <div class="cont2" id="report_showtype_3">
            <div style="background-color: white; color: #333333;
              font-weight: bold;
              padding: 20px;
              border-bottom: 1px solid #F2F2F2;
              font-size: 16px;">落脚点分析</div>
            <div class="cont2_map_box">
              <div class="mes">
                <el-collapse v-model="activeNames">
                  <el-collapse-item title="创谷广告园(2次)" name="1">
                    <div class="mes_cot">
                      <div class="cot_1">
                        <img src="../../../../../public/static/img/vis-eg.png">
                        <div style="padding-left: 10px">
                          <div style="background-color: #F6F6F6; padding: 0 8px"><i class="icon"></i>2018-12-27 15:46:07</div>
                          <div class="subdata">
                            <i class="vl_icon vl_icon_retrieval_03" style="height: 24px"></i>
                            <b>99.12</b>%
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
            <div id="container"></div>
          </div>
          <div class="cont3 cont2" id="report_showtype_4">
            <div style="background-color: white; color: #333333;
              font-weight: bold;
              padding: 20px;
              border-bottom: 1px solid #F2F2F2;
              font-size: 16px;">轨迹分析</div>
            <div class="cont2_map_box">
              <vue-scroll>
                <div class="mes">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="创谷广告园(2次)" name="1">
                      <div class="mes_cot">
                        <div class="cot_1">
                          <img src="../../../../../public/static/img/vis-eg.png">
                          <div style="padding-left: 10px">
                            <div style="background-color: #F6F6F6; padding: 0 8px"><i class="icon"></i>2018-12-27 15:46:07</div>
                            <div class="subdata">
                              <i class="vl_icon vl_icon_retrieval_03" style="height: 24px"></i>
                              <b>99.12</b>%
                            </div>
                          </div>
                        </div>
                        <div style="margin: 15px 0; border-bottom: 1px solid #F2F2F2"></div>
                        <div class="cot_1">
                          <img src="../../../../../public/static/img/vis-eg.png">
                          <div style="padding-left: 10px">
                            <div style="background-color: #F6F6F6; padding: 0 8px"><i class="icon"></i>2018-12-27 15:46:07</div>
                            <div class="subdata">
                              <i class="vl_icon vl_icon_retrieval_03" style="height: 24px"></i>
                              <b>99.12</b>%
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </vue-scroll>
            </div>
            <div id="rightMap"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vehicleBreadcrumb from './breadcrumb.vue';
import {PortraitPostPersonTrace} from "@/views/index/api/api.portrait.js";
import { mapXupuxian,ajaxCtx } from "@/config/config.js";
export default {
  components: {vehicleBreadcrumb},
  data () {
    return {
      evData: [],
      value1: '',
      value2: '',
      reselt: true,
      uploadAcion: ajaxCtx.base + '/new',
      amap: null,
      markerPoint: [], // 地图点集合
      activeNames: ['1'],
      tabList: [
        {
          label: "人员档案",
          value: 1
        },
        {
          label: "同行分析",
          value: 2
        },
        {
          label: "落脚点分析",
          value: 3
        },
        {
          label: "轨迹分析",
          value: 4
        }
      ],
      map: null,
      strucInfoList: [{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县兴隆路5号154(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-03 16:12:44","panoramaPath":"http://10.116.126.13/parastor300s/public/PRH259/f00000.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县兴隆路5号","longitude":110.595111,"latitude":27.90289,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"龙潭镇神龙大酒店","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":94,"shotTime":"2019-06-09 01:29:16","panoramaPath":"http://10.116.126.13/parastor300s/public/PJH119/f00007.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县龙潭镇神龙大酒店","longitude":110.542891,"latitude":27.411462,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"长沙创谷广告园44","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 11:41:04","panoramaPath":"http://10.116.126.13/parastor300s/public/PRH259/f00008.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"长沙市创谷广告软件园","longitude":112.973795,"latitude":28.094549,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县第一中学48","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-07 13:25:00","panoramaPath":"http://10.116.126.13/parastor300s/public/PYR682/f00026.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县第一中学","longitude":110.612834,"latitude":27.910003,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县张家湾路口(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":94,"shotTime":"2019-06-06 09:28:55","panoramaPath":"http://10.116.126.13/parastor300s/public/PCS113/f00021.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县张家湾路口","longitude":110.587558,"latitude":27.930365,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县气象局(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县气象局","longitude":110.604443,"latitude":27.908643,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县张家湾路口(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-07 14:22:36","panoramaPath":"http://10.116.126.13/parastor300s/public/PHD376/f00039.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县张家湾路口","longitude":110.587558,"latitude":27.930365,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县兴隆路5号154(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-10 14:24:28","panoramaPath":"http://10.116.126.13/parastor300s/public/PHD376/f00042.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县兴隆路5号","longitude":110.595111,"latitude":27.90289,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县龙潭镇汽车站(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-03 04:30:08","panoramaPath":"http://10.116.126.13/parastor300s/public/PYR682/f00033.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县龙潭镇汽车站","longitude":110.539961,"latitude":27.411443,"cname":null,"uploadPath":null}],
      sturcDetail: {vehicleDto:{},"id":null,"vehicleNumber": "粤PRH259","deviceCode":null,"structureType":null,"deviceName":"溆浦县政府41","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 19:29:55","panoramaPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县警予东路169号","longitude":110.597638,"latitude":27.910355,"cname":null,"uploadPath":'http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg'},
      selectIndex: 1,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      taskForm: {
        reportTime: "", // 日期
        taskName: "" // 任务名称
      },
      list: [], //已完成列表
      userInfo: {}, // 存储的用户信息
      deleteDialog: false,
      interruptDialog: false,    //中断任务
      isLoading: false,
      taskObj: '',     //单个列表任务
    }
  },
  created() {
    this.userInfo = this.$store.state.loginUser;
  },
  mounted () {
    this.initMap()
    this.renderMap()
  },
  methods: {
    hideResult () {
      this.reselt = false;
    },
    //tab切换
    selectTab(val) {
      this.selectIndex = val;
      let $tar = $('#report_showtype_' + val);
      if ($tar && $tar.length > 0) {
        let osTop = $tar.offset().top -250;
        let sTop = $('#report_content').scrollTop();
        // $('#report_content').scrollTop(osTop + sTop);
        $('#report_content').animate({scrollTop: (osTop + sTop) + 'px'}, 500);
      }
    },
    /**
     * 弹框地图初始化
     */
    initMap () {
      // this.map.setZoomAndCenter(iZoom, aCenter);
      let map = new window.AMap.Map('container', {
        zoom: 14, // 级别
        center: [this.sturcDetail.longitude, this.sturcDetail.latitude,], // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;
      this.drawPoint(this.sturcDetail)
    },
    /**
     * 地图描点
     */
    drawPoint (data) {
      console.log(data)
      if (this.markerPoint) {
        this.map.remove(this.markerPoint)
      }
      let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
      this.markerPoint = new window.AMap.Marker({ // 添加自定义点标记
        map: this.map,
        position: [data.longitude, data.latitude], // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: _content
      });
      this.map.setZoomAndCenter(16, [data.longitude, data.latitude]); // 自适应点位置
      let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
      this.infoWindow = new window.AMap.InfoWindow({
        map: this.map,
        isCustom: true,
        closeWhenClickMap: false,
        position: [data.longitude, data.latitude],
        offset: new window.AMap.Pixel(0, -70),
        content: sConent
      })
    },
    submitForm(v) {
      if(v == 1){
        let pg = {
        }
        pg['startTime'] = "2019-07-11 00:00:00";
        pg['endTime'] = "2019-07-11 23:59:59";
        pg['imageUrl'] = "http://file.aorise.org/vlink/image/cc78ae27-dca1-4291-85be-782941ae9ab2.jpg";
        pg['areaUid']= "431224100,431224102,431224103,431224104,431224105,431224106,431224107,431224108"
        this.getVehicleShot(pg);
      }else{
        this.$message.info("请上传图片");
      }
    },
    getVehicleShot(d) {
      this.searchLoading = true;
      PortraitPostPersonTrace(d).then(res => {
        if (res) {
          if (!res.data || res.data.length === 0) {
            this.$message.info("抱歉，没有找到匹配结果");
            return false;
          }
          this.evData = res.data.list;
          this.drawMapMarker(this.evData);
        }
      }).catch(() => {
      });
    },
    drawMapMarker (data) {
      let path = [];
      for (let  i = 0; i < data.length; i++) {
        let obj = data[i];
        let _path = [obj.shotPlaceLongitude, obj.shotPlaceLatitude];
        if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
          let _sContent = `
            <div class="vl_jtc_mk">
              <img src="${obj.subStoragePath}"/>
              <p>${obj.shotTime}</p>
            </div>`;
          // 窗体
          let winInfo = new AMap.Marker({ // 添加自定义点标记
            map: this.amap,
            position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(20, -80), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            content: _sContent
          });
          // winInfo.on('click', () => {
          //   this.showStrucInfo(obj, i)
          // })
          path.push(_path);
          let _content = `<div class="vl_icon vl_icon_sxt"></div>`
          let point = new AMap.Marker({ // 添加自定义点标记
            map: this.amap,
            position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            // 自定义点标记覆盖物内容
            content: _content
          });
          this.markerPoint[i] = [point,winInfo];
        }
      }
      this.amap.setFitView();
      console.log(path)
      this.drawLine(path);
    }, // 覆盖物（窗体和checkbox
    drawLine (path) {
      var polyline = new AMap.Polyline({
        path: path,
        showDir: true,
        strokeColor: '#61C772',
        strokeWeight: 6
      });
      polyline.setMap(this.amap)
      this.markerLine.push(polyline);
      this.amap.add([polyline]);
    }, // 画线
    renderMap() {
      let map = new window.AMap.Map("rightMap", {
        zoom: 10,
        center: mapXupuxian.center
      });
      map.setMapStyle("amap://styles/whitesmoke");
      this.amap = map;
    },
  }
}
</script>
<style lang="scss" scoped>
  .vehicle_content_nr{
    height: 100%;
    .vehicle_content_nr_box{
      height: calc(100% - 50px);
      display: flex;
      .vehicle_content_nr_box_left{
        height: 100%;
        width: 272px;
        /*margin-right: 10px;*/
        background-color: white;
        box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
        padding: 20px;
        padding-top: 15px;
        .vl_jtc_upload_gjfx {
          text-align: center;
          /deep/ .el-upload--picture-card {
            width: 100%;
            padding-top: 100%;
            position: relative;
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
        .gjfx_upload {
          &:hover {
            /deep/ .el-upload--picture-card {
              background: #0C70F8;
            }
          }
        }
      }
      .vehicle_content_nr_box_right{
        height: 100%;
        width: calc(100% - 272px);
        .vehicle_content_nr_box_right_top{
          width: 100%;
          box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
          .tab-menu {
            background-color: #fff;
            padding-top: 10px;
            overflow: hidden;
            border-bottom: 1px solid #f2f2f2;
            li {
              float: left;
              width: auto;
              font-size: 16px;
              margin: 0 10px;
              padding: 0 30px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              color: #333333;
              cursor: pointer;
              background-color: #F7F7F7;
              border-radius:2px 2px 0px 0px;
            }
            .is-active {
              color: white;
              background-color: #0A6DF0;
            }
          }
        }
        .vehicle_content_nr_box_right_bot{
          padding: 20px;
          height: calc(100% - 53px);
          overflow: auto;
          .cont{
            background: #ffffff;
            box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
            .top{
              color: #333333;
              font-weight: bold;
              padding: 20px;
              border-bottom: 1px solid #F2F2F2;
              font-size: 16px;
            }
            .message{
              padding-top: 10px;
              padding-left: 20px;
              padding-bottom: 15px;
              border-bottom: 1px solid #F2F2F2;
              .text{
                color: #333333;
                font-size: 14px;
                font-weight:bold;
                padding-bottom: 5px;
              }
              .message_cont{
                display: flex;
                .subdata{
                  color: #0c70f8;
                  line-height: 36px;
                  b{
                    padding-left: 5px;
                    font-size: 28px;

                  }
                }
                .mes_cot{
                  flex: 0;
                  p{
                    white-space: nowrap;
                  }
                  li{
                    padding-bottom: 15px;
                    color: #666666;
                  }
                  span{
                    float: left;
                    padding-right: 10px;
                    text-align: right;
                    width: 85px;
                  }
                }
                .mes_cot_1{
                  width: 490px;
                  color: #666666;
                  p{
                    padding-bottom: 5px;
                  }
                }
              }
            }
            .message_1{
              border: none !important;
              color: #666666;
              p{
                padding-bottom: 10px;
              }
            }
          }
          .cont1{
            padding-top: 20px;
            box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
            .list-box {
              display: flex;
              flex-wrap: wrap;
              // justify-content: space-between;
              flex-flow: row wrap;
              // height: calc(100% - 45px);
              > .rlcx_r_list {
                > li {
                  padding: 5px;
                  float: left;
                  > div {
                    position: relative;
                    width: 380px; height: 210px;
                    padding: 10px;
                    background-color: #fff;
                    box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
                    > img {
                      position: absolute; top: 10px; left: 10px;
                      width: 190px; height: 190px;
                    }
                    > div {
                      height: 100%;
                      margin-left: 210px; padding-right: 10px;
                      > h4 {
                        color: #999;
                        margin-bottom: 10px;
                      }
                      > div {
                        position: relative;
                        height: 30px; line-height: 30px;
                        margin-bottom: 10px; padding-left: 30px;
                        font-size: 12px;
                        background:rgba(250,250,250,1);
                        border:1px solid rgba(242,242,242,1);
                        border-radius:3px;
                        > i {
                          position: absolute; top: 7px; left: 10px;
                          width: 12px; height: 15px;
                          &.rlcx_sxt { background-position: -325px -377px; }
                          &.rlcx_sj { background-position: -787px -376px; }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          .cont2{
            height: 100%;
            position: relative;
            margin-top: 20px;
            box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
            #container{
              height: calc(100% - 62px);
              width: 100%;
            }
            .cont2_map_box{
              height: calc(100% - 62px);
              padding-top: 20px;
              width: 340px;
              background-color: white;
              position: absolute;
              z-index: 9999;
              box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
              .mes{
                padding: 20px;
                padding-top: 0;
                /deep/ .el-collapse-item{
                  border:1px solid rgba(211,211,211,1);
                  margin-bottom: 10px;
                }
                /deep/ .el-collapse{
                  border: 0;
                }
                /deep/ .el-collapse-item:last-child {
                }
                /deep/ .el-collapse-item__header{
                  border: 0;
                  background-color: #F6F6F6;
                  height: 38px;
                  padding-left: 10px;
                  color: #333333;
                  font-size: 14px;
                }
                /deep/ .el-collapse-item__content{
                  padding-bottom: 0;
                }
                .mes_cot{
                  padding: 10px;
                  .cot_1{
                    img{
                      width: 92px;
                      height: 92px;
                    }
                    >div{
                      display: inline-block;
                      vertical-align: top;
                      .icon{
                        background: url("../../../../assets/img/the-time.png") no-repeat;
                        background-size: 15px 15px;
                        display: inline-block;
                        height: 19px;
                        margin-right: 5px;
                        width: 15px;
                        vertical-align: middle;
                      }
                      .subdata{
                        color: #0c70f8;
                        line-height: 36px;
                        padding-top: 5px;
                        b{
                          padding-left: 5px;
                          font-size: 28px;

                        }
                      }
                    }
                  }
                }
              }
            }
          }
          .cont3{
            height: 100%;
            position: relative;
            #rightMap{
              height: calc(100% - 62px);
              width: 100%;
            }
          }
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
  .vl_jtc_mk {
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
</style>