<template>
  <div id="vehicle_report_save_c" v-loading="dataloading">
    <div class="vehicle_content_nr">
      <div class="vehicle_content_nr_box">
        <div class="vehicle_content_nr_box_left">
          <div class="img">
            <img :src="taskWebParam.targetPicUrl" height="232" width="232" class="bigImg" crossorigin = anonymous title="点击放大图片" />
          </div>
          <div style="color: #333333; font-size: 18px; font-weight: bold; padding: 16px 0">{{taskWebParam.taskName}}</div>
          <div style="color: #333333; padding-bottom: 8px"><span style="color: #999999">从</span> {{taskWebParam.startTime}}</div>
          <div style="color: #333333"><span style="color: #999999">至</span> {{taskWebParam.endTime}}</div>
        </div>
        <div class="vehicle_content_nr_box_right">
          <div class="vehicle_content_nr_box_right_bot">
            <div class="cont">
              <div class="top">
                最相似人员档案
              </div>
              <div class="message">
                <div class="text">1：基本信息</div>
                <div class="message_cont">
<!--                  <img src="../../../../../public/static/img/vis-eg.png" height="155"-->
<!--                                               width="255"/>-->
                  <img :src="portrailInfoDto.photoUrl" height="200" width="200" class="bigImg" crossorigin = anonymous title="点击放大图片"/>
                  <div style="padding-left: 20px; width: 320px">
                    <div class="subdata">
                      <i class="vl_icon vl_icon_retrieval_03" style="height: 24px"></i>
                      <b>{{portrailInfoDto.semblance}}</b>%
                    </div>
                    <ul class="mes_cot">
                      <li class="clearfix"><span>姓名：</span><p>{{portrailInfoDto.name}}</p></li>
                      <li class="clearfix"><span>证件类型：</span><p></p></li>
                      <li class="clearfix"><span>证件号码：</span><p>{{portrailInfoDto.idNo}}</p></li>
                      <li class="clearfix"><span>性别：</span><p>{{portrailInfoDto.sex}}</p></li>
                      <li class="clearfix"><span>民族：</span><p>{{portrailInfoDto.nation}}</p></li>
                    </ul>
                  </div>
                  <div class="mes_cot_1">
                    <p>备注：</p>
                    <div>
                      {{portrailInfoDto.remarks}}
                    </div>
                  </div>
                </div>
              </div>
              <div class="message_1 message">
                <div class="text">1：分组信息</div>
                <p>底库信息：{{repertoryGroupDto.repertories.join(',')}}</p>
                <p>分组信息：{{repertoryGroupDto.groups.map((item)=>{
                  return item.groupName
                  }).join(',')}}</p>
              </div>
            </div>
            <div class="cont1">
              <div style="background-color: white; color: #333333;
              font-weight: bold;
              padding: 20px;
              border-bottom: 1px solid #F2F2F2;
              font-size: 16px; margin-bottom: 10px">同行分析</div>
              <div>
                <div class="list-box">
                  <ul class="rlcx_r_list clearfix">
                    <li v-for="item in taskResult" :key="item.uid">
                      <div style="">
                        <img :src="item.subStoragePath" alt="" class="bigImg" title="点击放大图片">
                        <div>
                          <h4>检索资料</h4>
                          <div><i class="vl_icon rlcx_sj"></i>{{item.shotTime}}</div>
                          <p>
                            <span style="height: 30px;line-height: 30px;padding: 0 10px;display: inline-block;background: #fafafa;border: 1px solid #f2f2f2;border-radius: 3px;">{{item.sex}}</span>
                            <span style="height: 30px;line-height: 30px;padding: 0 10px;display: inline-block;background: #fafafa;border: 1px solid #f2f2f2;border-radius: 3px;margin-left: 8px;">{{item.age}}</span>
                          </p>
                          <p><img src="../../../../assets/img/txfx_pao.png" alt=""><b style="color: #0C70F8;font-size: 34px;padding-left: 8px;">{{item.peerNumber}}</b><span style="color: #0C70F8;"> 同行次</span></p>
                          <div style="margin-top: 15px; cursor: pointer;border:1px solid #D3D3D3;border-radius:4px;background:rgba(246,248,249,1);color: #666;" @click="goRecord(item)">查看同行记录</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
            <div class="cont2">
              <div style="background-color: white; color: #333333;
              font-weight: bold;
              padding: 20px;
              border-bottom: 1px solid #F2F2F2;
              font-size: 16px;">落脚点分析</div>
<!--             struGroupResultDtoList-->
              <div class="cont2_map_box">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                  <el-table-column
                      type="index"
                      label="序号"
                      width="50">
                  </el-table-column>
                  <el-table-column
                      label="落脚点位置"
                      prop="address">
                  </el-table-column>
                  <el-table-column
                      prop="stopOverTime"
                      label="停留时间分钟">
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="cont3 cont2">
              <div style="background-color: white; color: #333333;
              font-weight: bold;
              padding: 20px;
              border-bottom: 1px solid #F2F2F2;
              font-size: 16px;">轨迹分析</div>
              <div class="cont2_map_box">
                <div style="display: flex; height: 40px; line-height: 40px;background-color: #F7F7F7">
                  <div style="width: 50%; padding-left: 30px">时间</div>
                  <div style="width: 50%;">抓拍地址</div>
                </div>
                <div v-for="(item, index) in gat1400FaceExpDtoList" :key="index">
                  <div style="padding-bottom: 20px; padding-left: 30px">{{item.shotTime}}</div>
                  <div style="display: flex" v-for="(ite, ind) in item.list" :key="ind">
                    <div style="width: 50%; padding-bottom: 20px;padding-left: 30px">{{ite.shotTime&&ite.shotTime.substring(11,19)}}</div>
                    <div style="width: 50%">{{ite.address}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapXupuxian,ajaxCtx } from "@/config/config.js";
  import { objDeepCopy } from "@/utils/util.js";
  import { getdetailbg } from "../../api/api.analysis.js";
  import flvplayer from '@/components/common/flvplayer.vue';
  import {formatDate} from '@/utils/util.js';
  export default {
    components: {flvplayer},
    data () {
      return {
        tableData: [],
        evData: [],
        dataloading: false,
        value1: '',
        value2: '',
        reselt: true,
        uploadAcion: ajaxCtx.base + '/new',
        amap: null,
        markerPoint: [], // 地图点集合
        markerLine: [],
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
        strucDetailDialog: false,
        strucCurTab: 1,
        playerData: null,
        curImgIndex: 0,
        map1: null,
        supMarkerPoint: null,
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
        portrailInfoDto: {},
        repertoryGroupDto: {repertories: [], groups:[{groupName: 'kkk'}]},
        analysisTaskInfoWithBLOBsList: [],
        taskResult: [],
        struGroupResultDtoList: [{personDetailList: [{shotPlaceLongitude: 1,shotPlaceLatitude: 2 }]}],
        gat1400FaceExpDtoList: [],
        data: [],
        taskWebParam: {},
        time: [],
        pn: ''

      }
    },
    created() {
      this.userInfo = this.$store.state.loginUser;
      $('body').css({'position':'fixed',"width":"100%"});
    },
    mounted () {
      this.getdetailbgg()
      console.log(this.$route.query.uid,this.$route.query.targetUrl, this.$route.query.startTime)
      this.pn = this.$route.query.uid;
      this.time = [this.$route.query.startTime, this.$route.query.endTime];
    },
    methods: {
      getBase64 (img){
        function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
          var canvas = document.createElement("canvas");
          canvas.width = width ? width : img.width;
          canvas.height = height ? height : img.height;

          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          var dataURL = canvas.toDataURL();
          return dataURL;
        }
        var image = new Image();
        image.crossOrigin = '';
        image.src = img;
        var deferred=$.Deferred();
        if(img){
          image.onload =function (){
            deferred.resolve(getBase64Image(image));//将base64传给done上传处理
          }
          return deferred.promise();//问题要让onload完成后再return sessionStorage['imgTest']
        }
      },
      getdetailbgg () {
        let params = {
          uid: this.$route.query.uid,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          targetUrl: this.$route.query.targetUrl
        },_this = this;
        this.dataloading = true
        getdetailbg(params).then(res => {
          if(res.data){
            console.log(res.data)
            if (res.data.portrailInfoDto) {
              this.portrailInfoDto = res.data.portrailInfoDto
            }
            if (res.data.repertoryGroupDto) {
              this.repertoryGroupDto = res.data.repertoryGroupDto
            }
            this.analysisTaskInfoWithBLOBsList = res.data.analysisTaskInfoWithBLOBsList
            this.taskResult = JSON.parse(res.data.analysisTaskInfoWithBLOBsList[0].taskResult)
            this.struGroupResultDtoList = res.data.struGroupResultDtoList
            this.struGroupResultDtoList.forEach((item)=>{
              item.stayPointList.forEach((ite)=>{
                this.tableData.push(ite)
              })
            })
            console.log(this.tableData)
            this.taskWebParam =JSON.parse(res.data.analysisTaskInfoWithBLOBsList[0].taskWebParam)
            if(this.taskWebParam.targetPicUrl){
              this.getBase64(this.taskWebParam.targetPicUrl)
                .then((base64) => {
                  _this.taskWebParam.targetPicUrl = base64
                },function(err){
                  console.log(err);//打印异常信息
                });
            }
            if (this.portrailInfoDto.photoUrl) {
              this.getBase64(this.portrailInfoDto.photoUrl)
                .then((base64) => {
                  _this.portrailInfoDto.photoUrl = base64
                },function(err){
                  console.log(err);//打印异常信息
                });
            }
            if (this.taskResult.length > 0) {
              this.taskResult.forEach((item, index) => {
                this.getBase64(item.subStoragePath)
                  .then((base64) => {
                    _this.taskResult[index].subStoragePath = base64
                  },function(err){
                    console.log(err);//打印异常信息
                  });
              })
            }
            let list = []
            res.data.gat1400FaceExpDtoList.forEach((item)=>{
              list.push(item.shotTime.substring(0,10))
            })
            list = Array.from(new Set(list))
            for (let i =0; i<list.length; i++) {
              let index = list[i]
              this.gat1400FaceExpDtoList[i] = {}
              this.gat1400FaceExpDtoList[i].shotTime= index
              this.gat1400FaceExpDtoList[i].list = []
              for (let k =0; k<res.data.gat1400FaceExpDtoList.length; k++) {
                if (res.data.gat1400FaceExpDtoList[k].shotTime.substring(0,10) === index) {
                  (this.gat1400FaceExpDtoList[i].list).push(res.data.gat1400FaceExpDtoList[k])
                }
              }
              this.gat1400FaceExpDtoList[i].num = this.gat1400FaceExpDtoList[i].list.length
            }
            this.gat1400FaceExpDtoList.forEach((item)=>{
              item.list.forEach((ite)=>{
                this.data.push(ite)
              })
            })
            console.log(this.gat1400FaceExpDtoList)
            if (localStorage.getItem("temp")) {
              JSON.parse(localStorage.getItem("temp")).forEach((item)=>{
                this.updateLine(item)
              })
              localStorage.removeItem('temp')
            }
            this.dataloading = false
            $('body').css({'position':'relative'});
            setTimeout(()=>{
              this.$nextTick(() => {
                this.$msgbox({
                  title: '确认',
                  message: '确认导出吗？',
                  showCancelButton: true,
                  confirmButtonText: ' 确定 ',
                  cancelButtonText: ' 取消 ',
                  beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true;
                      instance.confirmButtonText = '正在生成文件...';
                      let _this = this;
                      let pdf = new window.jsPDF('p','pt','a3');
                      // 设置打印比例 越大打印越小
                      pdf.internal.scaleFactor = 2;
                      let options = {
                        pagesplit: true, //设置是否自动分页
                        background: '#FFFFFF'   //如果导出的pdf为黑色背景，需要将导出的html模块内容背景 设置成白色。
                      };
                      pdf.addHTML($('#vehicle_report_save_c')[0], 0, 0, options, function () {
                        pdf.save('人员侦察报告_' + _this.pn + '_' +
                          formatDate(params.startTime, 'yyyyMMdd') + '-'  + formatDate(params.endTime, 'yyyyMMdd') + '.pdf');
                      });
                      setTimeout(() => {
                        done();
                        setTimeout(() => {
                          instance.confirmButtonLoading = false;
                          // this.$router.push({name: 'portrait_report'})
                        }, 300);
                      }, 1000);
                    } else {
                      done();
                    }
                  }
                }).then(() => {
                });
              });
            },200)
          }
          this.$nextTick(() => {
            this.dataloading = false
          })
        }).catch(error => {
          console.log(error)
          this.dataloading = false
        })
      },
      goRecord (obj) {
        // console.log(obj)
        // obj.uid = 1
        this.$router.push({name: 'peer_analysis_record', query: {uid: this.$route.query.uid, id: obj.uid}})
      },
      /**
       * 弹框地图初始化
       */
      initMap () {
        // this.map.setZoomAndCenter(iZoom, aCenter);
        let map = new window.AMap.Map('container1', {
          zoom: 14, // 级别
          center: [110.597638, 27.910355,], // 中心点坐标
        });
        map.setMapStyle('amap://styles/whitesmoke');
        this.map = map;
        for (let i= 0; i< this.struGroupResultDtoList.length; i++){
          this.drawPoint(this.struGroupResultDtoList[i])
        }
      },
      /**
       * 地图描点
       */
      drawPoint (data) {
        let _content = `<div class="vl_icon vl_icon_judge_02"></div><div class="cap_info_win"><p>${data.groupName}</p><p>${data.totalNum}次</p></div>`
        this.markerPoint = new window.AMap.Marker({ // 添加自定义点标记
          map: this.map,
          position: [data.stayPointList[0].shotPlaceLongitude, data.stayPointList[0].shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        // this.map.setZoomAndCenter(16, [data.personDetailList[0].shotPlaceLongitude, data.personDetailList[0].shotPlaceLatitude]); // 自适应点位置
        this.map.setFitView();
      },
      updateLine (obj) {
        this.amap.clearMap();
        let _i = this.data.indexOf(obj);
        // list.splice(index, 1)
        this.data.splice(_i, 1);
        let list1 = []
        this.data.forEach((item)=>{
          list1.push(item.shotTime.substring(0,10))
        })
        list1 = Array.from(new Set(list1))
        this.gat1400FaceExpDtoList =[]
        for (let i =0; i<list1.length; i++) {
          let index = list1[i]
          this.gat1400FaceExpDtoList[i] = {}
          this.gat1400FaceExpDtoList[i].shotTime= index
          this.gat1400FaceExpDtoList[i].list = []
          for (let k =0; k<this.data.length; k++) {
            if (this.data[k].shotTime.substring(0,10) === index) {
              (this.gat1400FaceExpDtoList[i].list).push(this.data[k])
            }
          }
          this.gat1400FaceExpDtoList[i].num = this.gat1400FaceExpDtoList[i].list.length
        }
        this.drawMapMarker(this.data)
      }, // 更新画线
      drawMapMarker (oData) {
        let data = this.fitlerSXT(oData);
        for (let  i = 0; i < data.length; i++) {
          let obj = data[i];
          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            let _time = '';
            _time = '<p class="vl_map_mark_time">';
            obj.shotTime.split(',').forEach(j => {
              _time += `<span>${j}</span>`
            })
            _time += '</p>';
            let _content = `<div class="vl_icon vl_icon_sxt">` + _time + `</div>`
            let point = new window.AMap.Marker({ // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              // 自定义点标记覆盖物内容
              content: _content
            });
            point.on('click', () => {
              let newObj = objDeepCopy(obj);
              newObj.shotTime = newObj.shotTime.split(',')[0];
              this.showStrucInfo(newObj, i)
            })
            this.markerPoint[i] = [point];
          }
        }
        this.amap.setFitView()
        this.drawLine(oData);
      }, // 覆盖物（窗体和checkbox
      showStrucInfo (data, index) {
        this.amap.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude])
        this.curImgIndex = index;
        this.strucDetailDialog = true;
        this.sturcDetail = data;
        this.strucCurTab = 1;
        this.drawPoint1(data);
        this.setPlayerData();
      },
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
      drawPoint1 (data) {
        this.$nextTick(() => {
          $('.struc_c_address').append($('#capMap'))
        })
        if (this.supMarkerPoint) {
          this.map1.remove(this.supMarkerPoint)
        }
        let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
        this.supMarkerPoint = new window.AMap.Marker({ // 添加自定义点标记
          map: this.map1,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        this.map1.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
        let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
        new window.AMap.InfoWindow({
          map: this.map1,
          isCustom: true,
          closeWhenClickMap: false,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
          offset: new window.AMap.Pixel(0, -70),
          content: sConent
        })
      },
      imgListTap (data, index) {
        this.curImgIndex = index;
        this.sturcDetail = data;
        this.drawPoint1(data);
        this.setPlayerData();
      },
      fitlerSXT (oData) {
        let data = objDeepCopy(oData), _arr = [];
        data.forEach(x => {
          let _i = _arr.findIndex(y => y.deviceID === x.deviceID);
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
      renderMap() {
        let map = new window.AMap.Map("rightMap1", {
          zoom: 10,
          center: mapXupuxian.center
        });
        map.setMapStyle("amap://styles/whitesmoke");
        this.amap = map;
        this.drawMapMarker(this.data)
      },
    }
  }
</script>
<style lang="scss" scoped>
  .vehicle_content_nr{
    height: 100%;
    .vehicle_content_nr_box{
      height: 100%;
      display: flex;
      .vehicle_content_nr_box_left{
        height: 100%;
        width: 272px;
        /*margin-right: 10px;*/
        background-color: white;
        box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
        padding: 20px;
        padding-top: 15px;
        .img{
          img{
            border-radius: 10px;
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
          padding: 0 20px;
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
                    width: 395px; height: 210px;
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
            #container1{
              height: 500px;
              width: 100%;
            }
            .cont2_map_box{
              height: calc(100% - 62px);
              background-color: white;
              z-index: 99;
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
            .del_icon {
              font-size: 20px;
              position: absolute;
              bottom: 17px;
              right: 4px;
              display: none;
              color: #999999;
              &:hover {
                color: #0C70F8;
              }
            }
            height: 100%;
            position: relative;
            #rightMap1{
              height: 500px;
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
    padding: 18px;
    font-size: 14px;
    color: #666666;
    position: relative;
    white-space: nowrap;
    left: -52px;
    top: -173px;
    min-width: 140px;
    p{
      text-align: center;
    }
    p:last-child{
      text-align: center;
      padding-top: 10px;
      font-weight: bold;
      font-size: 20px;
    }
    &:after {
      display: block;
      content: '';
      border: .1rem solid #FFFFFF;
      border-color: #FFFFFF transparent transparent;
      position: absolute;
      bottom: -.2rem;
      left: calc(50% - .05rem);
    }
    &:hover{
      background-color: #0C70F8;
      color: white;
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
  #rightMap1 {
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
  }
  .struc_detail_dialog_gjfx {
    z-index: 99999;
    .el-dialog {
      max-width: 13.06rem;
      width: 100%!important;
      z-index: 99999;
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
            }
            .struc_cdi_line {
              flex: none;
              width: 50%;
              display: inline-block;
              p {
                max-width: 100%;
                overflow: hidden;
                display: table;
                min-height: 30px;
                margin-bottom: 0.08rem;
                padding-right: 10px;
                margin-right: 0.08rem;
                border: 1px solid #f2f2f2;
                border-radius: 3px;
                font-size: 12px;
                > b {
                  width: 70px;
                  background: #fafafa;
                  color: #999;
                  font-weight: normal;
                  padding-right: 10px;
                  padding-left: 10px;
                  display: table-cell;
                  vertical-align: middle;
                  border-right: 1px solid #f2f2f2;
                }
                >span {
                  display: table-cell;
                  vertical-align: middle;
                  padding-left: 5px;
                }
              }
            }
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
</style>