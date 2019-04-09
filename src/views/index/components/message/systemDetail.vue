<template>
  <div class="mes_system_det">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)" class="mes_back">公告管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="system_det_box" v-if="detail">
      <div><span class="vl_f_666">消息标题：</span><span class="vl_f_333">{{detail.title}}</span></div>
      <div><span class="vl_f_666">消息内容：</span><span class="vl_f_333">{{detail.details}}</span></div>
    </div>
  </div>
</template>
<script>
import {getMsgNoteDetail} from '@/views/index/api/api.js';
export default {
  props: ['systemId'],
  data () {
    return {
      detail: null,
    }
  },
  mounted () {
    this.getMsgNoteDetail();
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    },
    // 获取系统消息详情
    getMsgNoteDetail () {
      getMsgNoteDetail(this.systemId).then(res => {
        if (res && res.data) {
          this.detail = res.data;
        }
      })
    },
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
      line-height: 20px;
      > span:nth-child(2){
        flex: 1;
      }
    }
  }
}
</style>
