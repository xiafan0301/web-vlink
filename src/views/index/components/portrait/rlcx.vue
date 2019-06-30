<template>
  <div class="portrait_content">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '人脸查询'}]"></div>
    <div class="rlcx_main clearfix">
      <div class="rlcx_l">
        <el-form ref="form" class="pt_rlcx_fm" :model="searchForm" size="small">
          <el-form-item>
            <el-date-picker
              style="width: 240px;"
              v-model="searchForm.time"
              type="daterange"
              :editable="false" :clearable="false"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="区域：" label-width="55px">
            <el-radio-group v-model="searchForm.type">
              <el-radio :value="1" label="列表选择"></el-radio>
              <el-radio :value="2" label="地图选择"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-select style="width: 100%;" v-model="searchForm.area" placeholder="选择区域">
              <el-option :label="'所有区域'" :value="0"></el-option>
              <el-option :label="'行政区域1'" :value="1"></el-option>
              <el-option :label="'行政区域2'" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select style="width: 100%;" v-model="searchForm.sex" placeholder="选择性别">
              <el-option :label="'不限'" :value="0"></el-option>
              <el-option :label="'男'" :value="1"></el-option>
              <el-option :label="'女'" :value="2"></el-option>
              <el-option :label="'未知'" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select style="width: 100%;" v-model="searchForm.age" placeholder="选择年龄段">
              <el-option :label="'不限'" :value="0"></el-option>
              <el-option :label="'儿童'" :value="1"></el-option>
              <el-option :label="'少年'" :value="2"></el-option>
              <el-option :label="'青年'" :value="3"></el-option>
              <el-option :label="'中年'" :value="4"></el-option>
              <el-option :label="'老年'" :value="5"></el-option>
              <el-option :label="'未知'" :value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select style="width: 100%;" v-model="searchForm.eyeglass" placeholder="选择眼镜">
              <el-option :label="'不限'" :value="0"></el-option>
              <el-option :label="'戴眼镜'" :value="1"></el-option>
              <el-option :label="'不戴眼镜'" :value="2"></el-option>
              <el-option :label="'未知'" :value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select style="width: 100%;" v-model="searchForm.hat" placeholder="选择帽子">
              <el-option :label="'不限'" :value="0"></el-option>
              <el-option :label="'戴帽子'" :value="1"></el-option>
              <el-option :label="'不戴帽子'" :value="2"></el-option>
              <el-option :label="'未知'" :value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div style="text-align: center; padding-top: 10px;">
              <el-button @click="searchReset">&nbsp;&nbsp;重&nbsp;&nbsp;置&nbsp;&nbsp;</el-button>
              <el-button type="primary" @click="searchSubmit">&nbsp;&nbsp;确&nbsp;&nbsp;定&nbsp;&nbsp;</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="rlcx_r">
        <span class="rlcx_r_msg">检索结果<span>（{{pagination.total}}）</span></span>
        <div class="rlcx_r_order">
          <ul>
            <li @click="orderHandler(1)" :class="{'rlcx_r_order_sed': orderType === 1}">时间排序&nbsp;<i class="el-icon-arrow-down" :class="{'rlcx_r_order_up': order === 2}"></i></li>
            <li @click="orderHandler(2)" :class="{'rlcx_r_order_sed': orderType === 2}">监控排序&nbsp;<i class="el-icon-arrow-down" :class="{'rlcx_r_order_up': order === 2}"></i></li>
            <span :class="{'rlcx_r_order_line2': orderType === 2}"></span>
          </ul>
        </div>
        <ul class="rlcx_r_list clearfix">
          <li v-for="item in 12" :key="item">
            <div>
              <img src="../../../../assets/img/666.jpg" alt="">
              <div>
                <h4>检索资料</h4>
                <div><i class="vl_icon rlcx_sj"></i>18-12-24 14:12:17</div>
                <div><i class="vl_icon rlcx_sxt"></i>环保路摄像头002</div>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="pagination.total > pagination.pageSize" style="text-align: center; padding: 10px 0 20px 0;">
          <el-pagination
            class="dl_hi_pa"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vehicleBreadcrumb from './breadcrumb.vue';
export default {
  components: {vehicleBreadcrumb},
  data () {
    return {
      searchForm: {
        time: [new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), new Date()],
        type: '列表选择',
        area: '',
        sex: '',
        age: '',
        eyeglass: '',
        hat: '',
      },
      dataList: [],
      orderType: 1, // 1时间排序 2监控排序
      order: 1, // 1desc 2asc
      pagination: {
        currentPage: 1,
        pageSize: 12,
        total: 2312
      }
    }
  },
  methods: {
    searchSubmit () {
    },
    searchReset () {
      this.searchForm = {
        time: '',
        type: '列表选择',
        area: '',
        sex: '',
        age: '',
        eyeglass: '',
        hat: '',
      };
    },
    orderHandler (type) {
      if (type === this.orderType) {
        if (this.order === 1) {
          this.order = 2;
        } else {
          this.order = 1;
        }
      } else {
        this.orderType = type;
      }
    },
    handleCurrentChange () {
    }
  }
}
</script>
<style lang="scss" scoped>
.rlcx_main {
  height: 100%;
  padding-top: 50px;
}
.rlcx_l {
  float: left;
  width: 272px; height: 100%;
  padding: 20px 15px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
}
.rlcx_r {
  position: relative;
  height: 100%;
  margin-left: 273px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
  > .rlcx_r_list {
    padding: 5px;
    > li {
      padding: 5px;
      float: left;
      > div {
        position: relative;
        width: 380px; height: 180px;
        padding: 10px;
        background-color: #fff;
        box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        > img {
          position: absolute; top: 10px; left: 10px;
          width: 160px; height: 160px;
        }
        > div {
          height: 100%;
          margin-left: 180px; padding-right: 10px;
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
  > .rlcx_r_msg {
    position: absolute; top: 20px; left: 20px;
    color: #333;
    > span { color: #666; }
  }
  > .rlcx_r_order {
    padding-top: 20px; padding-bottom: 10px;
    > ul {
      position: relative;
      margin: 0 auto;
      width: 200px;
      overflow: hidden;
      > li {
        width: 100px; height: 40px;
        float: left;
        text-align: center;
        cursor: pointer;
        font-size: 15px;
        transition: all .3s ease-out;
        > i {
          opacity: 0;
          transition: all .3s ease-out;
          &.rlcx_r_order_up {
            transform: rotate(180deg);
          } 
        }
        &.rlcx_r_order_sed {
          cursor: default;
          color: #2580FC;
          > i {
            opacity: 1;
            cursor: pointer;
          }
        }
      }
      > span {
        position: absolute; bottom: 5px; left: 8px;
        width: 80px; height: 2px;
        overflow: hidden;
        background-color: #2580FC;
        transition: all .3s ease-out;
        &.rlcx_r_order_line2 {
          left: 108px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.pt_rlcx_fm {
  .el-form-item{
    margin-bottom: 6px;
  }
  .el-form-item__label {
    padding-right: 5px;
  }
  .el-radio {
    margin-right: 15px;
  }
  .el-radio__label {
    padding-left: 5px;
  }
}
</style>
