<template>
  <div class="yjxc_container">
    <!-- 夜间行车分析页面 -->
    <template v-if="pageType === 1">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{name: 'vehicle'}">车辆侦查</el-breadcrumb-item>
          <el-breadcrumb-item>夜间行车分析</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="con_box">
        <div class="con_left">
          <el-select
            style="width: 100%;"
            v-model="queryForm.devIdData"
            multiple
            popper-class="statistics_select_list"
            @remove-tag="removeSeletedDev"
            @click.native="showChange"
            collapse-tags
            placeholder="请选择设备">
            <el-option value="0" label=" "></el-option>
          </el-select>
          <div class="search_item" v-show="isShowSelectList">
            <div class="tab_box">
              <div @click="changeTab(1)">摄像头</div>
              <div @click="changeTab(2)">卡口</div>
            </div>
            <vue-scroll>
              <el-tree
                v-show="tabIndex === 1"
                :data="data1"
                class="select_tree"
                ref="selectTree1"
                @check-change="changeSeletedStatus"
                show-checkbox
                node-key="label">
              </el-tree>
              <el-tree
                v-show="tabIndex === 2" 
                :data="data2"
                class="select_tree"
                ref="selectTree2"
                @check-change="changeSeletedStatus"
                show-checkbox
                node-key="label">
              </el-tree>
            </vue-scroll>
          </div>
          <div class="left_time">
            <el-date-picker
              placeholder="请选择日期"
              v-model="queryForm.queryDate"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </div>
          <div class="left_time">
            <el-time-select
              v-model="queryForm.queryTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30'
              }"
              placeholder="选择时间">
            </el-time-select>
          </div>
          <div class="left_num">
            <el-input v-model="queryForm.queryNum"></el-input>
            <span>次（范围2-100）</span>
          </div>
          <el-select v-model="queryForm.carType" placeholder="请选择车辆类型" style="width: 100%;">
            <el-option
              v-for="item in carTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="queryForm.controlCarId" placeholder="请选择布控车辆" style="width: 100%;">
            <el-option
              v-for="item in controlCarList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="left_btn">
            <el-button class="reset_btn">重置</el-button>
            <el-button class="select_btn">查询</el-button>
          </div>
        </div>
        <div class="con_right">
          <div class="right_box table_box">
            <el-table
              v-loading="loading"
              :data="bkclccList"
              >
              <el-table-column
                type="index"
                label="序号">
              </el-table-column>
              <el-table-column
                label="车牌号码"
                prop="area"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="车辆类型"
                prop="摄像头"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="过车次数"
                prop="监控箱"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="操作"
                show-overflow-tooltip
                >
                <template>
                  <span class="operation_btn" @click="pageType = 2">抓拍记录</span>
                  <span class="operation_wire">|</span>
                  <span class="operation_btn">车辆信息</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="cum_pagination"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="30">
            </el-pagination>
          </div>
        </div>
      </div>
    </template>
    <!-- 抓拍记录页面 -->
    <template v-if="pageType === 2">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{name: 'vehicle'}">侦查</el-breadcrumb-item>
          <el-breadcrumb-item class="con_back" @click.native="pageType = 1;">夜间行车</el-breadcrumb-item>
          <el-breadcrumb-item>抓拍记录</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="zpjl_list">
        <div class="list_sort">
          <div><span>时间排序</span><span class="sort_icon"><i class="el-icon-caret-top"></i><i class="el-icon-caret-bottom"></i></span></div>
          <div><span>监控排序</span><span class="sort_icon"><i class="el-icon-caret-top"></i><i class="el-icon-caret-bottom"></i></span></div>
        </div>
        <div class="list_box">
          <div class="list_item" v-for="item in '123123123123123'" :key="item.id" @click="strucDetailDialog = true;">
            <img src="//via.placeholder.com/32x32" alt="">
            <p>2018.-11-12  13:14:15</p>
            <div><span>抓拍设备：</span><span>京广高速收费站京广高速收费站京广高速收费站</span></div>
          </div>
          <el-pagination
            style="width: 100%;text-align: center;padding-bottom: 20px;"
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="50">
          </el-pagination>
        </div>
       
      </div>
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
              <img src="" alt="">
              <span>{{showSim ? '上传图' : '全景图'}}</span>
            </div>
            <div class="struc_c_d_box">
              <div class="struc_c_d_img">
                <img :src="showSim ? sturcDetail.uploadPath : sturcDetail.panoramaPath" alt="">
                <i v-show="showSim">全景图</i>
              </div>
              <div class="struc_c_d_info">
                <h2>抓拍信息<div class="vl_jfo_sim"  v-show="showSim"><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? sturcDetail.semblance : 98.32}}<span style="font-size: 12px;">%</span></div></h2>
                <div class="struc_cdi_line">
                  <span :title="sturcDetail.feature">{{sturcDetail.feature}}</span>
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
                <img style="width: 100%; height: .88rem;" :src="item.photoPath" alt="">
                <div class="vl_jfo_sim"  v-show="showSim"><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? item.semblance : 92}}<span style="font-size: 12px;">%</span></div>
              </div>
            </swiper-slide>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </swiper>
        </div>
      </el-dialog>
    </template>
  </div>
</template>
<script>
export default {
  data () {
    return {
      /* 夜间行车分析页面参数 */
      pageType: 1,
      queryForm: {
        devIdData: [],
        queryDate: null,
        queryTime: null,
        queryNum: null,
        carType: null,
        controlCarId: null
      },
      carTypeList: [],
      controlCarList: [],
      isShowSelectList: false,
      tabIndex: 1, // select 下拉 tab 切换下标
      data1: [{
        id: 1,
        label: '一级 1',
        children: [{
            id: 4,
            label: '二级 1-1'
        }]
        }, {
        id: 2,
        label: '一级 2',
        children: [{
            id: 5,
            label: '二级 2-1'
        }, {
            id: 6,
            label: '二级 2-2'
        }]
        }, {
        id: 3,
        label: '一级 3',
        children: [{
            id: 7,
            label: '二级 3-1'
        }, {
            id: 8,
            label: '二级 3-2'
        }]
      }],
      data2: [{
        id: 1,
        label: '一级 3',
        children: [{
            id: 4,
            label: '二级 1-1'
        }]
        }, {
        id: 2,
        label: '一级 4',
        children: [{
            id: 5,
            label: '二级 2-1'
        }, {
            id: 6,
            label: '二级 2-2'
        }]
        }, {
        id: 3,
        label: '一级 5',
        children: [{
            id: 7,
            label: '二级 3-1'
        }, {
            id: 8,
            label: '二级 3-2'
        }]
      }],
      provinceId: null,
      provinceList: [],
      provinceName: null,
      loading: false,
      bkclccList: [{name: 'xxxxxxx'}],
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      /* 抓拍记录页面参数 */
      // 抓拍记录弹窗
      strucDetailDialog: false,
      strucCurTab: 1,
      showSim: false,
      playing: false,
      curImgIndex: null,
      strucInfoList: [{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县兴隆路5号154(故障)","photoPath":"http://10.116.126.13/parastor300s/public/PRH259/PRH2590.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-03 16:12:44","panoramaPath":"http://10.116.126.13/parastor300s/public/PRH259/f00000.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县兴隆路5号","longitude":110.595111,"latitude":27.90289,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"龙潭镇神龙大酒店","photoPath":"http://10.116.126.13/parastor300s/public/PJH119/PRH2590.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":94,"shotTime":"2019-06-09 01:29:16","panoramaPath":"http://10.116.126.13/parastor300s/public/PJH119/f00007.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县龙潭镇神龙大酒店","longitude":110.542891,"latitude":27.411462,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"长沙创谷广告园44","photoPath":"http://10.116.126.13/parastor300s/public/PRH259/PRH2594.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 11:41:04","panoramaPath":"http://10.116.126.13/parastor300s/public/PRH259/f00008.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"长沙市创谷广告软件园","longitude":112.973795,"latitude":28.094549,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县第一中学48","photoPath":"http://10.116.126.13/parastor300s/public/PYR682/P8A5660.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-07 13:25:00","panoramaPath":"http://10.116.126.13/parastor300s/public/PYR682/f00026.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县第一中学","longitude":110.612834,"latitude":27.910003,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县张家湾路口(故障)","photoPath":"http://10.116.126.13/parastor300s/public/PCS113/P8A5661.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":94,"shotTime":"2019-06-06 09:28:55","panoramaPath":"http://10.116.126.13/parastor300s/public/PCS113/f00021.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县张家湾路口","longitude":110.587558,"latitude":27.930365,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县气象局(故障)","photoPath":"http://10.116.126.13/parastor300s/public/PJH119/P8A5661.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-03 14:54:53","panoramaPath":"http://10.116.126.13/parastor300s/public/PJH119/f00011.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县气象局","longitude":110.604443,"latitude":27.908643,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县张家湾路口(故障)","photoPath":"http://10.116.126.13/parastor300s/public/PHD376/P9E1630.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-07 14:22:36","panoramaPath":"http://10.116.126.13/parastor300s/public/PHD376/f00039.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县张家湾路口","longitude":110.587558,"latitude":27.930365,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县兴隆路5号154(故障)","photoPath":"http://10.116.126.13/parastor300s/public/PHD376/P9E1631.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-10 14:24:28","panoramaPath":"http://10.116.126.13/parastor300s/public/PHD376/f00042.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县兴隆路5号","longitude":110.595111,"latitude":27.90289,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县龙潭镇汽车站(故障)","photoPath":"http://10.116.126.13/parastor300s/public/PYR682/P9E1630.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-03 04:30:08","panoramaPath":"http://10.116.126.13/parastor300s/public/PYR682/f00033.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县龙潭镇汽车站","longitude":110.539961,"latitude":27.411443,"cname":null,"uploadPath":null}],
      sturcDetail: {"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县政府41","photoPath":"http://10.116.126.13/parastor300s/public/PRH259/PRH2590.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 19:29:55","panoramaPath":"http://10.116.126.13/parastor300s/public/PRH259/f00000.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县警予东路169号","longitude":110.597638,"latitude":27.910355,"cname":null,"uploadPath":null},
      videoUrl: null,
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
    }
  },
  methods: {
    showChange () {
      this.isShowSelectList = !this.isShowSelectList;
    },
    changeTab (tabIndex) {
      this.tabIndex = tabIndex;
      // this.cameraData = this.tabIndex === 1 ? this.data1 : this.data2;
    },
    removeSeletedDev (data) {
      console.log(data, 'removeSeletedDev')
      this.$refs.selectTree1.setChecked(data, false);
    },
    changeSeletedStatus (data, isSelNode1, isSelNode2) {
      console.log(data, isSelNode1, isSelNode2, 'changeSeletedStatus');
      setTimeout(() => {
        if (!isSelNode1) {
          if (data.children) {
            for (let item of data.children) {
              this.devIdData = this.devIdData.filter(f => f !== item.label);
            }
          } else {
            this.devIdData = this.devIdData.filter(f => f !== data.label);
          }
          return;
        };
      })
      if (!data.children) return;
      const labelList = data.children.map(m => m.label);
      setTimeout(() => {
        for (let f of labelList) {
          this.devIdData.push(f);
        }
        console.log(this.devIdData, 'this.devIdData')
      })
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    handleCurrentChange (page) {
      
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
  }
}
</script>
<style lang="scss" scoped>
.yjxc_container{
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  .breadcrumb_heaer{
    border-bottom: 1px solid #D3D3D3;
  }
  .con_box{
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: calc(100% - 55px);
    .con_left{
      width: 272px;
      height: 100%;
      padding: 20px;
      > .left_time{
        padding-bottom: 10px;
        .el-date-editor{
          width: 100%;
        }
      }
      .el-select{
        padding-bottom: 10px;
      }
      .left_num{
        display: flex;
        padding-bottom: 10px;
        .el-input{
          width: 133px;
        }
        > span{
          margin-left: 4px;
          line-height: 40px;
          color: #999;
          font-size: 12px;
        }
      }
      .search_item {
        height: 120px;
        width: 232px;
        .tab_box{
          width: 100%;
          display: flex;
          > div{
            width: 50%;
            text-align: center;
            border: 1px solid #e6e6e6;
          }
        }
        .select_tree {
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          background-color: #fff;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
      }
      .left_btn{
        padding-top: 10px;
        .select_btn, .reset_btn {
          width: 110px;
        }
        .select_btn {
          background-color: #0C70F8;
          color: #ffffff;
        }
        .reset_btn {
          background-color: #ffffff;
          color: #666666;
          border-color: #DDDDDD;
        }
      }
    }
    .con_right{
      width: calc(100% - 272px);
      height: 100%;
      background: #F7F9F9;
      .right_box{
        height: calc(100% - 40px);
        margin: 20px;
        padding: 20px;
        background: #fff;
      }
    }
  }
  .zpjl_list{
    width: 100%;
    height: calc(100% - 55px);
    padding: 0 20px 20px 0;
    background: #f7f9f9;
    .list_sort{
      display: flex;
      justify-content: flex-end;
      line-height: 45px;
      > div:nth-child(1){
        margin-right: 70px;
      }
      > div{
        display: flex;
        > span{
          color: #999999;
        }
        .sort_icon{
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 12px 0;
          > i{
            height: 8px;
            cursor: pointer;
            color: #999999;
          }
        }
      }
    }
    .list_box{
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      flex-flow: row wrap;
      height: calc(100% - 45px);
      .list_item{
        width: 3.56rem;
        height: 3.2rem;
        padding: .15rem;
        margin-left: .2rem;
        margin-bottom: .2rem;
        background: #fff;
        img{
          width: 3.28rem;
          height: 2.19rem;
        }
        > div > span{
          color: #333;
        }
        > p{
          color: #333;
        }
      }
    }
  }
}
</style>
<style lang="scss">
// 重置下拉列表样式
.statistics_select_list {
  display: none!important;
}
// 重置面包屑样式
.con_back.el-breadcrumb__item .el-breadcrumb__inner{
  color: #999!important;
  cursor: pointer;
  &:hover{
    color: #409EFF!important;
  }
}
html {
  font-size: 100px;
}
@media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
@media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
@media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
@media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
@media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
// 抓拍详情弹窗样式
.yjxc_container{
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
        }
        .struc_c_d_qj {
          margin-right: .3rem;
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
              span {
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
            .vl_jfo_sim {
              color: #0C70F8;
            }
          }
        }
      }
    }
  }
}
</style>