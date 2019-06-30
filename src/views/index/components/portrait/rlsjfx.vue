<template>
  <div class="portrait_rlsjfx">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '人脸数据分析'}]"></div>
    <div class="rlsjfx_box">
      <div class="box">
        <h1>布控库数据统计</h1>
        <div class="info_list_box">
          <div class="item" v-for="item in '1234'" :key="item.id">
            <i class="el-icon-platform-eleme"></i>
            <div>
              <p>人像总数</p>
              <h1>43154</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="box">
        <h1>基础信息库数据统计</h1>
        <div class="info_list_box">
          <div class="item" v-for="item in '1234'" :key="item.id">
            <i class="el-icon-platform-eleme"></i>
            <div>
              <p>人像总数</p>
              <h1>43154</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="box">
        人脸抓拍统计
      </div>
      <div class="box">
        人脸布控告警数据分析
      </div>
      <div class="box"></div>
      <div class="box"></div>
    </div>
  </div>
</template>
<script>
import vehicleBreadcrumb from './breadcrumb.vue';
export default {
  components: {vehicleBreadcrumb},
  data () {
    return {
    
    }
  },
  methods: {
  
  
  }
}
</script>
<style lang="scss" scoped>
.portrait_rlsjfx {
  height: 100%;
  width: 100%;
  padding-top: .5rem;
  .rlsjfx_box{
    width: 100%;
    height: calc(100% - .5rem);
    padding: 0.4rem 0.2rem 0.2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .box{
      background: #fff;
      flex: 0 1 49.5%;
      margin-bottom: .2rem;
      padding: .15rem;
      &:nth-child(1), &:nth-child(2){
        height: 112px;
      }
      &:nth-child(3), &:nth-child(4){
        height: 110px;
      }
      &:nth-child(5), &:nth-child(6){
        height: 200px;
      }
      > h1{
        line-height: 30px;
        color: #333;
        font-family:MicrosoftYaHei-Bold;
      }
      .info_list_box{
        width: 100%;
        height: calc(100% - 30px);
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        .item{
          flex: 0 1 23.8%;
          height: 100%;
          background: #0C70F8;
          display: flex;
          flex-wrap: nowrap;
          padding: .1rem;
          > i{
            width: 30%;
            font-size: 29px;
            line-height: 22px;
            padding-top: .15rem;
          }
          > div{
            width: 70%;
            text-align: center;
            > p{
              color: #FFFFFF;
              font-size: 12px;
            }
            > h1{
              color: #FFFFFF;
              font-size: 20px;
            }
          }
          &:nth-child(1){
            background: #0C70F8;
          }
          &:nth-child(2){
            background: #0D9DF4;
          }
          &:nth-child(3){
            background: #6262FF;
          }
          &:nth-child(4){
            background: #8949F3;
          }
        }
      }
    }
  }
}

</style>
<style lang="scss">
html {
  font-size: 100px;
}
@media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
@media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
@media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
@media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
@media screen and (min-width: 1920px) {html {font-size: 100px !important;}}
</style>
