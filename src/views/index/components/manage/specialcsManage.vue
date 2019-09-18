<template>
  <div class="special_csmanage">
   <div class="special_csmanage_cot">
     <div class="special_csmanage_right">
       <el-input size="small" suffix-icon="el-icon-search"></el-input>
       <div class="add_zu">
         <i class="vl_icon vl_icon_manage_4"></i>
         <span>新增分组</span>
       </div>
       <ul class="fen_zu">
         <li>分组1</li>
         <li>分组1</li>
       </ul>
     </div>
     <div class="special_csmanage_right_r special_csmanage_right">

     </div>
     <div class="map_rm" id="mapMap"></div>
   </div>
  </div>
</template>

<script>
  export default {
    name: "specialcsManage",
    data() {
      return {
        mapCenter: [110.594419,27.908869],
      }
    },
    mounted() {
      let _this = this;
      let map = new window.AMap.Map('mapMap', {
        zoom: 14, // 级别
        center: _this.mapCenter, // 中心点坐标
        // viewMode: '3D' // 使用3D视图
      });
      map.setMapStyle('amap://styles/whitesmoke');
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
        padding: 20px;
        width: 260px;
        z-index: 99;
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
          padding-left: 25px;
          li{
            padding-bottom: 10px;
          }
        }
      }
      .special_csmanage_right_r{
        left: 260px;
        border-right: 0
      }
      #mapMap{
        height: 100%;
        width: 100%;
        border-radius:4px;
      }
    }
  }
</style>