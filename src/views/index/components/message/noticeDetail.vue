<template>
  <div class="mes_notice_det">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)">公告管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="notice_det_box">
      <div><span class="vl_f_666">消息标题：</span><span class="vl_f_333">这是一个消息标题，文字限制20字</span></div>
      <div>
        <div class="vl_f_666">消息内容：</div>
        <div>
          <div class="vl_f_333">任务内容示意：调度指挥方案任务内容填写，段落文字多行显示，这段文字是样式参考。调度指挥方案任务内容填写，段落文字多行显示，这段文字是样式参考。调度指挥方案任务内容填写，段落文字多行显示，这段文字是样式参考。调度指挥方案任务内容填写，段落文字多行显示，这段文字是样式参考。调度指挥方案任务内容填写，段落文字多行显示，这段文字限制200字。</div>
          <div class="det_pic_box">
            <div class="img" v-for="item in '123456789'" :key="item.id">
              <img src="//via.placeholder.com/117x117" alt="">
            </div>
          </div>
        </div>
      </div>
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
.mes_notice_det{
  width: 100%;
  position: relative;
  .notice_det_box{
    margin: 0 20px 20px 20px;
    padding: 20px;
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    > div:nth-child(1){
      margin-bottom: 15px;
    }
    > div:nth-child(2){
      display: flex;
      > div:nth-child(1){
        width: 77px;
      }
      > div:nth-child(2){
        line-height: 20px;
      }
      .det_pic_box{
        width: 400px;
        padding-top: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .img{
          width: 33%;
          height: 137px;
          padding-right: 20px;
          padding-bottom: 20px;
        }
      }
    }
  }
 
}
</style>
