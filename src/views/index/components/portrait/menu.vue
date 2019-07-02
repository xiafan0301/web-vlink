<template>
  <ul class="vl_port_index clearfix">
    <li>
      <router-link :to="{name: 'portrait_rlcx'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_101"></span>
        <span class="ptt_li_text">人脸查询</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'vehicle_search_clcx'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_101"></span>
        <span class="ptt_li_text">特征搜人</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'indenty_recog'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_102"></span>
        <span class="ptt_li_text">身份核实</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'vehicle_search_clcx'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_103"></span>
        <span class="ptt_li_text">以图搜人</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'vehicle_search_clcx'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_104"></span>
        <span class="ptt_li_text">人像对比</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'vehicle_search_clcx'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_105"></span>
        <span class="ptt_li_text">轨迹分析</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'portrait_pfcm'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_106"></span>
        <span class="ptt_li_text">频繁出没</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'vehicle_search_clcx'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_107"></span>
        <span class="ptt_li_text">落脚点分析</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'vehicle_search_clcx'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_108"></span>
        <span class="ptt_li_text">重点人群关注</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'portrait_qyryfx'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_109"></span>
        <span class="ptt_li_text">区域人群分析</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'peer_analysis'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_110"></span>
        <span class="ptt_li_text">同行分析</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'portrait_rlsjfx'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_111"></span>
        <span class="ptt_li_text">人脸数据分析</span>
      </router-link>
    </li>
    <li>
      <router-link :to="{name: 'gzws_portrait'}">
        <img src="../../../../assets/img/portrait_li_bg.png" alt="">
        <span class="ptt_li_icon vl_icon2 vl_icon2_112"></span>
        <span class="ptt_li_text">跟踪尾随</span>
      </router-link>
    </li>
  </ul>
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
.vl_port_index {
  height: 100%;
  position: relative;
  padding: 8px;
  > li {
    float: left;
    width: 20%; 
    padding: 8px;
    > a {
      display: block;
      position: relative;
      min-height: 100px; max-height: 300px;
      background-color: #fff;
      box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
      border-radius: 4px;
      overflow: hidden;
      > img { width: 5%; }
      > .ptt_li_icon {
        position: absolute; top: 50%; left: 50%;
        width: 118px; height: 118px;
        margin-top: -70px; margin-left: -59px;
        animation: fadeInUp .4s ease-out .4s both;
      }
      > .ptt_li_text {
        display: block;
        position: absolute; top: 50%; left: 50%;
        width: 150px; height: 24px; line-height: 24px;
        margin-left: -75px; margin-top: 52px;
        text-align: center;
        font-size: 18px; color: #333;
        animation: fadeIn .6s ease-out .6s both;
      }
    }
  }
}
</style>