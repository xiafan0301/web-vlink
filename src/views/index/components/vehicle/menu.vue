<template>
  <div class="vl_judge_index vl_content_pad clearfix">
    <ul>
      <li>
        <span>查询</span>
        <ul class="ji_anm ji_anm1">
          <li>
            <router-link :to="{name: 'vehicle_search_tzsc'}">
              <i class="vl_icon2 vl_icon2_002"></i><span>特征搜车</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_ycsc'}">
              <i class="vl_icon2 vl_icon2_003"></i><span>以图搜车</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_mhsc'}">
              <i class="vl_icon2 vl_icon2_008"></i><span>模糊搜车</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_gcck'}">
              <i class="vl_icon2 vl_icon2_004"></i><span>过车查看</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_clcx'}">
              <i class="vl_icon2 vl_icon2_001"></i><span>车辆查询</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_lxwf'}">
              <i class="vl_icon2 vl_icon2_006"></i><span>连续违章</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_clxx'}">
              <i class="vl_icon2 vl_icon2_005"></i><span>车辆档案</span>
            </router-link>
          </li>
          <!-- <li>
            <router-link :to="{name: 'vehicle_search_pfgc'}">
              <i class="vl_icon2 vl_icon2_007"></i><span>频繁过车</span>
            </router-link>
          </li> -->
        </ul>
      </li>
      <li>
        <span>分析</span>
        <ul class="ji_anm ji_anm2">
          <li>
            <router-link :to="{name: 'vehicle_analysis_clgj'}">
              <i class="vl_icon2 vl_icon2_011"></i><span>车辆轨迹分析</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_ljd'}">
              <i class="vl_icon2 vl_icon2_012"></i><span>落脚点分析</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_qy'}">
              <i class="vl_icon2 vl_icon2_013"></i><span>区域碰撞</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_xcgl'}">
              <i class="vl_icon2 vl_icon2_014"></i><span>行车规律分析</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_tpc'}">
              <i class="vl_icon2 vl_icon2_015"></i><span>套牌车分析</span>
            </router-link>
          </li>
          <!-- <li>
            <router-link :to="{name: 'vehicle_search_txcl'}">
              <i class="vl_icon2 vl_icon2_016"></i><span>同行车辆分析</span>
            </router-link>
          </li> -->
          <li>
            <router-link :to="{name: 'vehicle_search_ws'}">
              <i class="vl_icon2 vl_icon2_017"></i><span>尾随分析</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_dctx'}">
              <i class="vl_icon2 vl_icon2_018"></i><span>多车同行分析</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_qyph'}">
              <i class="vl_icon2 vl_icon2_007"></i><span>区域徘徊</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_restrict_driving'}">
              <i class="vl_icon2 vl_icon2_007"></i><span>车辆限行</span>
            </router-link>
          </li>
        </ul>
      </li>
      <li>
        <span>统计</span>
        <ul class="ji_anm ji_anm3">
          <li>
            <router-link :to="{name: 'vehicle_search_cll'}">
              <i class="vl_icon2 vl_icon2_021"></i><span>车流量统计</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_ccrc'}">
              <i class="vl_icon2 vl_icon2_022"></i><span>入城统计</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_bkclcc'}">
              <i class="vl_icon2 vl_icon2_023"></i><span>出城统计</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_gcsj'}">
              <i class="vl_icon2 vl_icon2_024"></i><span>过车数据统计</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_search_ycxc'}">
              <i class="vl_icon2 vl_icon2_025"></i><span>夜间行车统计</span>
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'vehicle_report'}">
              <i class="vl_icon2 vl_icon2_026"></i><span>车辆综合分析报告</span>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .vl_judge_index {
    > ul {
      padding-top: 10px;
      > li {
        position: relative;
        margin-bottom: 10px;
        background-color: #fff;
        box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        > span {
          position: absolute; top: 50%; left: 28px;
          margin-top: -15px;
          width: 50px; height: 24px;
          font-size: 16px; color: #333; font-weight: bold;
          text-align: center;
        }
        > ul {
          padding-left: 100px;
          overflow: hidden; padding-top: 20px; padding-bottom: 20px;
          > li {
            float: left;
            padding: 20px 0 0 0;
            width: 140px; height: 180px;
            > a {
              display: block;
              margin-top: 10px;
              text-align: center;
              > i {}
              > span {
                display: block;
                position: relative; top: -8px;
                color: #333; font-size: 14px;
              }
              &:hover { text-decoration: none; }
            }
          }
        }
      }
    }
  }

  .ji_anm {
    > li {
      animation: fadeInUp .4s ease-out both;
    }
  }
  .ji_anm1 {
    > li {
      &:nth-child(1) { animation-delay: 0.1s; }
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.3s; }
      &:nth-child(4) { animation-delay: 0.4s; }
      &:nth-child(5) { animation-delay: 0.5s; }
      &:nth-child(6) { animation-delay: 0.6s; }
      &:nth-child(7) { animation-delay: 0.7s; }
      &:nth-child(8) { animation-delay: 0.8s; }
      &:nth-child(9) { animation-delay: 0.9s; }
    }
  }
  .ji_anm2 {
    > li {
      &:nth-child(1) { animation-delay: 0.5s; }
      &:nth-child(2) { animation-delay: 0.6s; }
      &:nth-child(3) { animation-delay: 0.7s; }
      &:nth-child(4) { animation-delay: 0.8s; }
      &:nth-child(5) { animation-delay: 0.9s; }
      &:nth-child(6) { animation-delay: 1s; }
      &:nth-child(7) { animation-delay: 1.1s; }
      &:nth-child(8) { animation-delay: 1.2s; }
      &:nth-child(9) { animation-delay: 1.3s; }
      &:nth-child(10) { animation-delay: 1.4s; }
    }
  }
  .ji_anm3 {
    > li {
      &:nth-child(1) { animation-delay: 0.8s; }
      &:nth-child(2) { animation-delay: 0.9s; }
      &:nth-child(3) { animation-delay: 1s; }
      &:nth-child(4) { animation-delay: 1.1s; }
      &:nth-child(5) { animation-delay: 1.2s; }
      &:nth-child(6) { animation-delay: 1.3s; }
      &:nth-child(7) { animation-delay: 1.4s; }
    }
  }
</style>