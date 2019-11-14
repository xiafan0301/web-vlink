<template>
  <div class="special_csmanage">
   <div class="special_csmanage_cot">
     <div class="special_csmanage_right">
       <div style="padding: 20px; padding-bottom: 0">
         <el-input size="small" type="text" v-model="value"><i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="serchone"></i></el-input>
       </div>
       <div class="add_zu" @click="addzu('新增')">
         <i class="vl_icon vl_icon_manage_4"></i>
         <span>新增分组</span>
       </div>
       <ul class="fen_zu">
         <li v-for="(item, index) in fenzulist" :key ="index" @click="qieh(item,index)" :class="{'active': index === showind}">{{item.groupName}}
           <i class="operation_btn del_btn vl_icon vl_icon_manage_8" @click="delfenzu(item)"></i>
           <i class="operation_btn edit_btn vl_icon vl_icon_manage_7" @click="addzu('修改', item.uid)"></i>
         </li>
       </ul>
     </div>
     <div class="special_csmanage_right_r special_csmanage_right" :class="{'hideResult': Result}">
       <vue-scroll>
         <div v-for="(item, index) in czdatalist" :key ="index" :class="['special_csmanage_right_r_tree', 'special_csmanage_right_r_tree_'+ index]">
           <div class="special_csmanage_right_r_tree_hd" @click="oo(item,index)" :class="{'opencolor': item.isopen }"><i :class="[{'el-icon-arrow-right': !item.isopen},{'el-icon-arrow-down':item.isopen}]"></i>{{item.areaName}}</div>
           <div :class="['special_csmanage_right_r_tree_i_tal_'+ index, 'special_csmanage_right_r_tree_i_tal']" style="height: 0; overflow: hidden">
             <div class="special_csmanage_right_r_tree_i" v-for="(ite, inde) in item.deviceList" :key ="inde">
               <div @click="createInfoWindow(ite)">{{ite.deviceName}}</div>
             </div>
           </div>
         </div>
       </vue-scroll>
       <div class="insetLeft vl_icon vl_icon_vehicle_02" @click="hideResult" :class="{'vl_icon_vehicle_03': Result}"></div>
     </div>
     <div class="map_rm" id="mapMap"></div>
   </div>
    <!--删除任务弹出框-->
    <el-dialog
        title="删除任务确认"
        :visible.sync="deleteDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
    >
      <span style="color: #999999;">是否确定删除该分组</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button @click="delConfirm(item)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {Jtcgettsc} from '@/views/index/api/api.judge.js';
import {delfezu } from '@/views/index/api/api.base.js';
import { mapXupuxian} from "@/config/config.js";
export default {
  name: "specialcsManage",
  data() {
    return {
      mapCenter: [110.594419,27.908869],
      Result: false,
      hide: false,
      fenzulist: [],
      deleteDialog: false,
      item: {},
      showind: 0,
      zidi: [],
      czdatalist: [],
      value: '',
      map: null,
      data:[],
    }
  },
  created () {
    this.getlist()
  },
  mounted() {
    let map = new window.AMap.Map('mapMap', {
      zoom: 14, // 级别
      center: mapXupuxian.center, // 中心点坐标
      // viewMode: '3D' // 使用3D视图
    });
    this.map = map;
    map.setMapStyle('amap://styles/whitesmoke');
  },
  methods: {
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
          map: this.map,
          position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
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
      this.map.setFitView();
    },
    createInfoWindow (obj) {
      let _sContent = `<div class="cap_info_win"><p>设备名称：${obj.deviceName}</p><p>抓拍地址：${obj.address}</p></div>`
      this.hoverWindow = new window.AMap.InfoWindow({
        isCustom: true,
        closeWhenClickMap: true,
        offset: new window.AMap.Pixel(-2, -50), // 相对于基点的偏移位置
        content: _sContent
      });
      this.hoverWindow.open(this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
      this.map.setCenter([obj.longitude, obj.latitude])
    },
    qieh (val, i) {
      this.showind = i
      // this.item1.push(val)
      this.czdatalist = []
      this.zidi = val.deviceList
      this.zcdata()
      $('.special_csmanage_right_r_tree_i_tal').height(0)
      val.isopen = false
    },
    serchone () {
      this.getlist ()
      console.log(this.$data)
    },
    getlist () {
      let params = {
        keyword: this.value
      }
      Jtcgettsc(params)
        .then(res => {
          if (res) {
            this.fenzulist = res.data
            this.fenzulist.forEach((item)=>{
              item.deviceList.forEach((ite)=>{
                this.data.push(ite)
              })
            })
            console.log(this.data)
            this.drawMarkers(this.data)
            this.fenzulist.map((item)=>{
              this.$set(item, 'isopen', false)
              return item
            })
            this.zidi = res.data[0].deviceList
            this.czdatalist = []
            this.zcdata ()
          }
        })
    },
    zcdata () {
      let _arr = this.zidi.map((item)=>{
        return item.areaName
      })
      let _arr1 = []
      for (let i= 0; i<_arr.length; i++){
        if (_arr1.indexOf(_arr[i]) === -1){
          _arr1.push(_arr[i])
        }
      }
      for (let i =0; i<_arr1.length; i++) {
        let flg = _arr1[i]
        let obj = {areaName: _arr1[i], deviceList: [], isopen: false}
        for (let k =0 ; k< this.zidi.length; k++) {
          if (this.zidi[k].areaName === flg ) {
            obj.deviceList.push(this.zidi[k])
          }
        }
        this.czdatalist.push(obj)
      }
    },
    delfenzu (val) {
      this.deleteDialog = true
      this.item = val
    },
    delConfirm (val) {
      let deviceList = val.deviceList.map((item)=>{
        return item.uid
      })
      let params = {
        delIdList: deviceList.join(),
        groupId: val.uid,
        groupName: val.groupName
      }
      delfezu (params)
        .then(res => {
          if (res) {
            this.$message.success('删除成功');
            this.deleteDialog = false
            this.getlist()
          }
        })
    },
    addzu (val, item) {
      if (val === '修改') {
        this.$router.push({name: 'special_csmanageadd',  query: {uid :item, isadd: 0}})
      }else{
        this.$router.push({name: 'special_csmanageadd', query: {isadd: 1}})
      }
    },
    hideResult () {
      this.Result = !this.Result
    },
    oo (val,index) {
      val.isopen = !val.isopen
      let _heght = val.deviceList.length * 34
      if (val.isopen) {
        $('.special_csmanage_right_r_tree_i_tal_' + index).animate({height:_heght}, 300, "linear")
      } else {
        $('.special_csmanage_right_r_tree_i_tal_' + index).animate({height:0}, 300, "linear")
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .special_csmanage{
    height: 100%;
    width: 100%;
    padding: 15px;
    .special_csmanage_cot{
      height: 100%;
      background:rgba(255,255,255,1);
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      position: relative;
      .special_csmanage_right{
        width: 260px;
        z-index: 999;
        position: absolute;
        top: 0;
        bottom: 0;
        background-color: white;
        border-radius:4px;
        border-right:1px solid rgba(242,242,242,1);
        /deep/ .el-input__inner{
          border-radius: 20px;
          background-color: #F2F2F2;
        }
        .add_zu{
          padding-left: 20px;
          padding-top: 20px;
          cursor: pointer;
          padding-bottom: 5px;
          .vl_icon_manage_4{
            padding-bottom: 27px;
            margin-right: 5px;
            vertical-align: middle;
          }
        }
        .fen_zu{
          .active{
            background-color:  #E0F2FF;
          }
          li{
            padding-left: 48px;
            padding-top: 5px;
            padding-bottom: 5px;
            cursor: pointer;
            .vl_icon_manage_7{
              background-position: -584px -377px;
            }
            .vl_icon_manage_8{
              background-position: -694px -376px;
            }
            &:hover{
              background-color: #E0F2FF;
              .operation_btn {
                display: block;
              }
            }
            .del_btn {
              &:hover {
                background-position: -694px -349px !important;
              }
            }
            .edit_btn {
              &:hover {
                background-position: -584px -350px !important;
              }
            }
            .operation_btn {
              display: none;
              float: right;
              margin: 5px 5px 0;
            }
          }
        }
      }
      .special_csmanage_right_r{
        padding: 20px;
        left: 260px;
        border-right: 0;
        z-index: 999;
        transition: left linear .3s;
        .insetLeft{
          position: absolute;
          left: 260px;
          top: 50%;
          margin-top: -89px;
        }
        .special_csmanage_right_r_tree{
          cursor: pointer;
          padding-bottom: 20px;
          overflow: hidden;
          .special_csmanage_right_r_tree_hd{
          }
          .opencolor{
            color: #0C70F8;
          }
          .special_csmanage_right_r_tree_i{
            padding-top: 15px;
            padding-left: 14px;
            div{
              &:hover{
                background-color: #f2f2f2;
              }
            }
          }
        }
      }
      .hideResult{
        left: 0;
        z-index: 90;
        transition: left linear .3s;
      }
      #mapMap{
        height: 100%;
        width: 100%;
        border-radius:4px;
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
    left: -3px;
    top: 2px;
    min-width: 140px;
    z-index: 99;
  p{
    text-align: left;
  }
  p:last-child{
    text-align: left;
    padding-top: 10px;
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
</style>