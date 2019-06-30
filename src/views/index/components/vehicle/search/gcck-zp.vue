<template>
  <div class="vehicle_content">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '过车查看', routerName: 'vehicle_search_gcck'}, {name: '全部抓拍'}]"></div>
    <div class="vc_gcck">
      <div class="vc_gcck_con">
        <div class="gcck_s">
          <el-form :inline="true" :model="formInline" ref="formInline" class="dl_hi_sf" size="small">
            <el-form-item>
              <el-date-picker style="width: 250px;"
                v-model="formInline.time"
                type="daterange"
                align="left"
                unlink-panels
                :editable="false"
                :clearable="false"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <!-- deptList -->
              <el-select v-model="formInline.lb" placeholder="请选择车辆类别" style="width: 150px;">
                <el-option v-for="(item, index) in lbList" :label="item.name" :key="'dept-list-' + index" :value="item.uid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.lx" placeholder="请选择车辆类型" style="width: 150px;">
                <el-option v-for="(item, index) in lxList" :label="item.name" :key="'user-list-' + index" :value="item.uid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-right: 2px;">
              <el-checkbox class="gcck_ck_f" v-model="formInline.no">非</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="请输入车牌" style="width: 200px;" v-model="formInline.cp">
                <el-select style="width: 70px;" v-model="formInline.cpp" slot="prepend" placeholder="">
                  <el-option label="湘" value="1"></el-option>
                  <el-option label="京" value="2"></el-option>
                  <el-option label="沪" value="3"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button :loading="searchLoading" type="primary" @click="searchSubmit">查询</el-button>
              <el-button @click="searchReset('formInline')">重置</el-button>
            </el-form-item>
          </el-form>
          <el-button class="gcck_s_dc" size="small" type="primary" @click="searchSubmit">导出</el-button>
        </div>
        <ul class="gcck_l">
          <li>
            <div class="gcck_lt"><i class="el-icon-caret-right gcck_lt_op"></i>今天&nbsp;2019-6-27&nbsp;<span>(31231张)</span></div>
            <ul class="gcck_ll">
              <li v-for="item in 10" :key="item">
                <div class="vc_gcck_rbl">
                  <img src="../../../../../assets/img/temp/video_pic.png" alt="">
                  <div><i class="vl_icon gcck_sxt"></i>环保路摄像头002</div>
                  <div><i class="vl_icon gcck_sj"></i>18-12-24 14:12:17</div>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <div class="gcck_lt"><i class="el-icon-caret-right"></i>昨天&nbsp;2019-6-26&nbsp;<span>(31231张)</span></div>
            <ul class="gcck_ll gcck_ll_hide">
              <li v-for="item in 10" :key="item">
                <div class="vc_gcck_rbl">
                  <img src="../../../../../assets/img/temp/video_pic.png" alt="">
                  <div><i class="vl_icon gcck_sxt"></i>环保路摄像头002</div>
                  <div><i class="vl_icon gcck_sj"></i>18-12-24 14:12:17</div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import vehicleBreadcrumb from '../breadcrumb.vue';
import flvplayer from '@/components/common/flvplayer.vue';
export default {
  components: {vehicleBreadcrumb, flvplayer},
  data () {
    return {
      formInline: {
        time: '',
        lb: '',
        lx: '',
        no: false,
        cpp: '1',
        cp: ''
      },
      searchLoading: false,
      lbList: [{name: '类别1', uid: '1'}],
      lxList: [{name: '类型1', uid: '1'}]
    }
  },
  methods: {
    searchSubmit () {
    },
    searchReset () {
    }
  }
}
</script>
<style lang="scss" scoped>
.vc_gcck {
  height: 100%;
  padding-top: 50px;
  > .vc_gcck_con {
    height: 100%;
    position: relative;
    padding-top: 10px;
  }
}
.gcck_s {
  position: relative;
  background-color: #fff;
  box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
  padding: 18px 10px 0 20px;
  margin: 5px 10px 10px 10px;
  .gcck_s_dc {
    position: absolute; top: 20px; right: 10px;
  }
}
.gcck_lt {
  position: relative;
  height: 40px; line-height: 40px;
  padding-left: 44px; margin: 5px 10px 0 10px;
  color: #333;
  background-color: #fff;
  box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
  > i {
    position: absolute; top: 10px; left: 20px;
    font-size: 20px; color: #666; cursor: pointer;
    transition: all .4s ease-out;
    &.gcck_lt_op {
      transform: rotate(90deg);
      top: 8px;
    }
  }
  > span { color: #999; }
}
.gcck_ll {
  overflow: hidden;
  padding: 5px;
  > li {
    float: left;
    padding: 5px;
    > div {
      width: 205px;
      padding: 10px;
      background-color: #fff;
      box-shadow:0px 2px 10px 0px rgba(131,131,131,0.12);
      > img {
        width: 185px; height: 185px;
        margin-bottom: 5px;
      }
      > div {
        position: relative;
        text-align: left;
        padding-left: 18px;
        color: #999; font-size: 12px;
        height: 22px; line-height: 22px;
        > i {
          position: absolute; top: 3px; left: 0;
          width: 12px; height: 15px;
          &.gcck_sxt { background-position: -325px -377px; }
          &.gcck_sj { background-position: -787px -376px; }
        }
      }
    }
  }
  &.gcck_ll_hide { display: none; }
}
</style>
<style lang="scss">
.gcck_ck_f {
  padding-left: 5px;
  color: #000;
  .el-checkbox__label { padding-left: 1px; }
}
</style>