<template>
  <div class="mapbox">
    <div class="mapbox" id="mapSelect"></div>
    <div class="setPost">
      <div>
        <el-input placeholder="请输入地名，快速定位地址" v-model="input3" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" class="select_btn" @click="setCenter()"></el-button>
        </el-input>
      </div>
      <div class="drawBox">
        <p>请选择框选图形</p>
        <div class="items">
          <span @click="clickTab('cut1')" :class="['cut1',{'hover':hover=='cut1'}]"></span>
          <span @click="clickTab('cut2')"  :class="['cut2',{'hover':hover=='cut2'}]"></span>
          <span @click="clickTab('cut3')"  :class="['cut3',{'hover':hover=='cut3'}]"></span>
          <span @click="clickTab('cut4')"  :class="['cut4',{'hover':hover=='cut4'}]"></span>
          <span @click="clickTab('cut5')"  :class="['cut5',{'hover':hover=='cut5'}]"></span>
        </div>
      </div>
    </div>
    <div class="shrink">
      <span class="el-icon-plus" @click="mapZoomSet(1)"></span>
      <span class="el-icon-minus" @click="mapZoomSet(-1)"></span>
    </div>
  </div>
</template>
<script>
import { mapXupuxian } from "@/config/config.js";
export default {
  name: "mapselect",
  props: [],
  data() {
    return {
      amap: null,
      input3: null,
      hover:null,
      // 选择区域
      mouseTool: null,
      selAreaPolygon: null,
      delSelAreaIcon: null,
      lnglat:null
    };
  },
  mounted() {
    this.renderMap();
  },
  methods: {
    clickTab(val){
      this.hover = this.hover==val?'':val
      if(!this.hover){
        this.amap.setDefaultCursor();
        this.mouseTool.close(false);
      }else{
         this.selArea(val)
      }
     
    },
    // 选择区域
    selArea (v) {
      var _this=this
      this.amap.setDefaultCursor('crosshair');
      switch (v){
        case 'cut1' :
          this.mouseTool.rectangle({
            strokeColor:'#FA453A',
            strokeOpacity:1,
            strokeWeight: 1,
            fillColor:'#FA453A',
            fillOpacity:0.2,
            strokeStyle: 'solid',
          })
          break ;
        case 'cut2' :
          this.mouseTool.circle({
            strokeColor: "#FA453A",
            strokeOpacity: 1,
            strokeWeight: 1,
            strokeOpacity: 0.2,
            fillColor: '#FA453A',
            fillOpacity: 0.2,
            strokeStyle: 'solid',
            // 线样式还支持 'dashed'
            // strokeDasharray: [30,10],
          })
          break ;
        case 'cut3' :
          this.mouseTool.polyline({
            strokeColor: "#FA453A", 
            strokeOpacity: 1,
            strokeWeight: 2,
            // 线样式还支持 'dashed'
            strokeStyle: "solid",
            // strokeStyle是dashed时有效
            // strokeDasharray: [10, 5],
          })
        
          break ;
        case 'cut4' :
          this.mouseTool.polygon({
            zIndex: 13,
            strokeColor: '#FA453A',
            strokeOpacity: 1,
            bubble: true,
            strokeWeight: 1,
            fillColor: '#FA453A',
            fillOpacity: 0.2,
            isRing: false
          });
          break ;
        case 'cut5' :
          
          break ;

      }
      
      
      
    },

    setCenter(){
       var _this=this
      // console.log(this.input3);
       var placeSearch = new AMap.PlaceSearch({
      // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
      city: '021'
    })
    placeSearch.search(this.input3, function (status, result) {
       // 查询成功时，result即对应匹配的POI信息
      //  console.log(result)
       var pois = result.poiList.pois;
       if(pois.length>0){
         let new_center=pois[0].location
        _this.amap.setZoomAndCenter(16, new_center);
       }
       
        // for(var i = 0; i < pois.length; i++){
        //     var poi = pois[i];
        //     var marker = [];
        //     marker[i] = new AMap.Marker({
        //         position: poi.location,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        //         title: poi.name
        //     });
        //     // 将创建的点标记添加到已有的地图实例：
        //     _this.amap.add(marker[i]);
        // }
        // _this.amap.setFitView();

    })
      
    },
    mapZoomSet(val) {
      if (this.amap) {
        this.amap.setZoom(this.amap.getZoom() + val);
      }
    },
    renderMap() {
      let map = new window.AMap.Map("mapSelect", {
        zoom: 10,
        center: mapXupuxian.center
      });
      map.setMapStyle("amap://styles/whitesmoke");
      this.amap = map;
      // 在地图中添加MouseTool插件
     this.mouseTool = new window.AMap.MouseTool(map);
     let _this=this
      this.amap.on( 'click',   function (e) {
                //lnglatInput.value = e.lnglat.toString();
                if(_this.hover=='cut5'){
                  var circle = new AMap.Circle({
                    center:e.lnglat,
                    radius: 5000, //半径
                    borderWeight: 3,
                    strokeColor: "#FF33FF", 
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    strokeOpacity: 0.2,
                    fillOpacity: 0.4,
                    strokeStyle: 'solid',
                    // strokeDasharray: [10, 10], 
                    // 线样式还支持 'dashed'
                    fillColor: '#1791fc',
                    zIndex: 50,
                  })
                  circle.setMap(_this.amap)
                }
                
      });
    },
    // 关闭图片放大弹出框
    closeImgDialog() {
      this.$emit("emitCloseImgDialog", false);
    }
  }
};
</script>
<style lang="scss" scoped>
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
.setPost{
    position: absolute;
    left: 20px;
    top: 20px;
    width: 300px;
   .drawBox{
     margin-top: 20px;
     background: #ffffff;
     padding: 10px;
     .items{
       padding-top: 20px;
       span{
         display: inline-block;
         width: 55px;
         height: 55px;
         text-align: center;
         line-height: 55px;
         border-right: solid 1px #eeeeee;
         cursor: pointer;
         &:last-child{
           border-right: none;
         }
       }
       .cut1{
         background: url(../../../../assets/img/vehicle/cut1.png) center no-repeat;
         background-size: 100% 100%;
       }
       .cut1.hover{
         background: #F2F9FF url(../../../../assets/img/vehicle/cut1m.png) center no-repeat;
         background-size: 100% 100%;
       }
       .cut2{
         background: url(../../../../assets/img/vehicle/cut2.png) center no-repeat;
         background-size: 100% 100%;
       }
       .cut2.hover{
         background:#F2F9FF url(../../../../assets/img/vehicle/cut2m.png) center no-repeat;
         background-size: 100% 100%;
       }
       .cut3{
         background: url(../../../../assets/img/vehicle/cut3.png) center no-repeat;
         background-size: 100% 100%;
       }
       .cut4{
         background: url(../../../../assets/img/vehicle/cut4.png) center no-repeat;
         background-size: 100% 100%;
       }
       .cut5{
         background: url(../../../../assets/img/vehicle/cut5.png) center no-repeat;
         background-size: 80% 80%;
       }
       .cut3.hover{
         background:#F2F9FF url(../../../../assets/img/vehicle/cut3m.png) center no-repeat;
         background-size: 100% 100%;
       }
       .cut4.hover{
         background:#F2F9FF url(../../../../assets/img/vehicle/cut4m.png) center no-repeat;
         background-size: 100% 100%;
       }
       .cut5.hover{
         background:#F2F9FF url(../../../../assets/img/vehicle/cut5m.png) center no-repeat;
         background-size: 80% 80%;
       }
     }
   }

}
</style>
<style lang="scss">
</style>


