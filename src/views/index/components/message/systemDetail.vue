<template>
  <div class="mes_system_det">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)">公告管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="system_det_box">
      <div><span class="vl_f_666">消息标题：</span><span class="vl_f_333">这是一个消息标题，文字限制20字</span></div>
      <div><span class="vl_f_666">消息内容：</span><span class="vl_f_333">一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十</span></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    
    }
  },
  mounted () {
   
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    }
  }
}
</script>
<style lang="scss" scoped>
.mes_system_det{
  width: 100%;
  position: relative;
  .system_det_box{
    margin: 0 20px 20px 20px;
    padding: 20px;
    min-height:760px;
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    > div{
      width: 50%;
    }
    > div:nth-child(1){
      margin-bottom: 15px;
    }
    > div:nth-child(2){
      display: flex;
      > span:nth-child(1){
        width: 11.5%;
        flex-shrink: 0;
      }
      > span:nth-child(2){
        width: 88.5%;
        line-height: 20px;
        flex-shrink: 1;
      }
    }
  }
}
</style>
