<template>
  <div class="vehicle_content">
    <div class="vc_rep_bd" is="vehicleBreadcrumb" :oData="[{name: '车辆侦察报告'}]"></div>
    <div class="vc_rep">
      <div class="vc_rep_t">
        <div class="vc_rep_sc">
          <el-input style="width: 200px;" v-model="searchForm.plateNo" placeholder="请输入车牌信息" size="small"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-date-picker style="width: 280px;" size="small" 
            v-model="searchForm.time"
            type="daterange"
            align="left"
            unlink-panels
            :editable="false"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            :picker-options="pickerOptions"
            end-placeholder="结束日期">
          </el-date-picker>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button size="small" :disabled="!searchForm.plateNo" :loading="searchLoading" type="primary" @click="searchSubmit">查询</el-button>
        </div>
        <ul class="vc_rep_mu">
          <li><span :class="{'vc_rep_mu_sed': showType === 1}" @click="changeShowType(1)">车辆档案信息</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 2}" @click="changeShowType(2)">车辆入城信息</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 3}" @click="changeShowType(3)">车辆出城信息</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 4}" @click="changeShowType(4)">车辆行驶轨迹</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 5}" @click="changeShowType(5)">夜间活动规律</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 6}" @click="changeShowType(6)">频繁出没分析</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 7}" @click="changeShowType(7)">套牌车分析</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 8}" @click="changeShowType(8)">同行车辆分析</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 9}" @click="changeShowType(9)">区域碰撞</span></li>
        </ul>
      </div>
      <div class="vc_rep_c">
        <div id="report_content">
          <div>
            <!-- 车辆档案信息-车辆信息  showType 1 -->
            <div class="vc_rep_cl" id="report_showtype_1">
              <div>
                <h2>车辆档案信息-车辆信息</h2>
                <div>
                  <ul class="rep_clxx">
                    <li><span>车牌号码：</span><p>湘A51790</p></li>
                    <li><span>车辆所有人：</span><p>杨华</p></li>
                    <li><span>中文品牌：</span><p>雪佛兰科鲁兹</p></li>
                    <li><span>车身颜色：</span><p>黑色</p></li>
                    <li><span>车身形式：</span><p>车身形式车身形式</p></li>
                    <li><span>车门数：</span><p>4</p></li>
                    <li><span>发动机号：</span><p>3567G75756</p></li>
                    <li><span>车辆类型：</span><p>SUV</p></li>
                    <li><span>年款：</span><p>2018年</p></li>
                    <li><span>座位数：</span><p>4</p></li>
                    <li><span>车辆状态：</span><p>良好</p></li>
                    <li><span>使用性质：</span><p>2020-02-20</p></li>
                    <li><span>车型：</span><p>车型车型车型</p></li>
                    <li><span>厂商名称：</span><p>雪佛兰科鲁兹</p></li>
                    <li><span>有效期止：</span><p>2019年2月5日</p></li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- 车辆档案信息-违章信息 -->
            <div class="vc_rep_cl">
              <div>
                <h2>车辆档案信息-违章信息</h2>
                <div>
                  <el-table :data="wzList" max-height="300">
                    <el-table-column label="序号" type="index" width="100"></el-table-column>
                    <el-table-column label="违法时间" prop="date" show-overflow-tooltip></el-table-column>
                    <el-table-column label="违法地点" prop="address" show-overflow-tooltip></el-table-column>
                    <el-table-column label="城市名称" prop="name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="罚款金额" prop="name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="违章归属地" prop="name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="违法行为" prop="name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="分类类型" prop="name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="采集机关" prop="name" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!-- 车辆入城分析-入城记录 showType 2 -->
            <div class="vc_rep_cl" id="report_showtype_2">
              <div>
                <h2>车辆入城分析-入城记录</h2>
                <div>
                  <el-table :data="rcList">
                    <el-table-column label="序号" type="index" width="100"></el-table-column>
                    <el-table-column label="入城时间" prop="date" show-overflow-tooltip></el-table-column>
                    <el-table-column label="入城卡口" prop="address" show-overflow-tooltip></el-table-column>
                    <el-table-column label="抓拍摄像头" prop="name" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!-- 车辆出城分析-出城记录 showType 3 -->
            <div class="vc_rep_cl" id="report_showtype_3">
              <div>
                <h2>车辆出城分析-出城记录</h2>
                <div>
                  <el-table :data="ccList">
                    <el-table-column label="序号" type="index" width="100"></el-table-column>
                    <el-table-column label="出城时间" prop="date" show-overflow-tooltip></el-table-column>
                    <el-table-column label="出城卡口" prop="address" show-overflow-tooltip></el-table-column>
                    <el-table-column label="抓拍摄像头" prop="name" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!-- 车辆行驶轨迹-车辆轨迹 showType 4 -->
            <div class="vc_rep_cl" id="report_showtype_4">
              <div>
                <h2>车辆行驶轨迹-车辆轨迹</h2>
                <div>
                  车辆轨迹
                </div>
              </div>
            </div>
            <!-- 夜间活动规律-夜间出没记录 showType 5 -->
            <div class="vc_rep_cl" id="report_showtype_5">
              <div>
                <h2>夜间活动规律-夜间出没记录</h2>
                <div>
                  <el-table :data="yjcmList">
                    <el-table-column label="设备名称" prop="name"></el-table-column>
                    <el-table-column label="过车时间" prop="date" show-overflow-tooltip></el-table-column>
                    <el-table-column label="时间间隔" prop="name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="参考时间" prop="name" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!-- 夜间活动规律-出没点分布 -->
            <div class="vc_rep_cl">
              <div>
                <h2>夜间活动规律-出没点分布</h2>
                <div>
                  出没点分布
                </div>
              </div>
            </div>
            <!-- 夜间活动规律-夜间出没结论 -->
            <div class="vc_rep_cl">
              <div>
                <h2>夜间活动规律-夜间出没结论</h2>
                <div>
                  <ul class="rep_yjcm">
                    <li>
                      <span>较常在出没时间段：</span>
                      <div><span>03:00-05:00</span>|<span>05:00-07:00</span></div>
                    </li>
                    <li>
                      <span>较常出没地点为：</span>
                      <div><span>摄像头地点1摄像头地点</span>|<span>摄像头地点1摄像头地点2</span></div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 频繁出没分析 showType 6 -->
            <div class="vc_rep_cl" id="report_showtype_6">
              <div>
                <h2>频繁出没分析</h2>
                <div>
                  频繁出没分析
                </div>
              </div>
            </div>
            <!-- 套牌车分析 showType 7 -->
            <div class="vc_rep_cl" id="report_showtype_7">
              <div>
                <h2>套牌车分析</h2>
                <div>
                  套牌车分析
                </div>
              </div>
            </div>
            <!-- 同行车辆分析 showType 8 -->
            <div class="vc_rep_cl" id="report_showtype_8">
              <div>
                <h2>同行车辆分析</h2>
                <div>
                  同行车辆分析
                </div>
              </div>
            </div>
            <!-- 区域碰撞 showType 9 -->
            <div class="vc_rep_cl" id="report_showtype_9">
              <div>
                <h2>区域碰撞</h2>
                <div>
                  区域碰撞
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
import vehicleBreadcrumb from '../breadcrumb.vue';
import {formatDate} from '@/utils/util.js';
export default {
  components: {vehicleBreadcrumb},
  data () {
    return {
      searchForm: {
        plateNo: '',
        time: [new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), new Date()]
      },
      searchLoading: false,

      clInfo: null,
      wzList: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      rcList: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      ccList: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      yjcmList: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],

      showType: 1,

      pickerOptions: {
        disabledDate (d) {
          return d > new Date();
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    changeShowType (val) {
      if (val != this.showType) {
        this.showType = val;
        let $tar = $('#report_showtype_' + val);
        if ($tar && $tar.length > 0) {
          let osTop = $tar.offset().top -250;
          let sTop = $('#report_content').scrollTop();
          // $('#report_content').scrollTop(osTop + sTop);
          $('#report_content').animate({scrollTop: (osTop + sTop) + 'px'}, 500);
        }
      }
    },
    searchSubmit () {
    }
  }
}
</script>
<style lang="scss" scoped>
.vc_rep {
  position: relative;
  height: 100%;
  padding-top: 50px;
  > .vc_rep_t {
    position: absolute; top: 50px; left: 0;
    width: 100%;
    background-color: #fff;
  }
  > .vc_rep_c {
    padding-top: 99px;
    height: 100%;
    > div {
      height: 100%;
      padding: 10px 0 10px 0;
      overflow: auto;
      overflow-x: hidden;
      overflow-y: auto;
      > div {
      }
    }
  }
}
.vc_rep_sc {
  padding: 20px 0 5px 20px;
}
.vc_rep_mu {
  overflow: hidden;
  border-bottom: 1px solid #eee;
  > li {
    float: left;
    padding: 0 20px;
    > span {
      color: #333;
      display: inline-block;
      height: 40px; line-height: 40px;
      padding: 0 2px;
      border-bottom: 2px solid #fff;
      cursor: pointer;
      &.vc_rep_mu_sed {
        cursor: default;
        color: #0C70F8;
        border-bottom-color: #0C70F8;
      }
    }
  }
}
.vc_rep_cl {
  padding: 10px 20px;
  > div {
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    > h2 {
      height: 48px; line-height: 48px;
      color: #333; font-size: 16px;
      padding-left: 20px;
      border-bottom: 1px solid #eee;
    }
    > div {
      padding: 20px 20px;
    }
  }

  .rep_clxx {
    overflow: hidden;
    > li {
      width: 25%;
      float: left;
      padding: 8px 0;
      > span {
        float: left;
        width: 120px;
        padding-right: 15px;
        color: #666;
        text-align: right;
      }
      > div {
        margin-left: 120px;
        color: #333;
      }
    }
  }

  .rep_yjcm {
    > li {
      overflow: hidden;
      padding: 5px 0;
      > span {
        float: left;
        width: 150px;
        padding-right: 5px;
        color: #666;
        text-align: right;
      }
      > div {
        margin-left: 150px;
        color: #333;
        > span {
          display: inline-block;
          padding: 0 10px;
        }
      }
    }
  }
}
</style>