<template>
  <div class="mes_notice_det">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)" class="mes_back">公告管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="notice_det_box" v-if="detail">
      <div><span class="vl_f_666">消息标题：</span><span class="vl_f_333">{{detail.title}}</span></div>
      <div>
        <div class="vl_f_666">消息内容：</div>
        <div>
          <div class="vl_f_333">{{detail.details}}</div>
          <div class="det_pic_box">
            <img v-for="(item, index) in imgList" :src="item.path" alt="" :key="index" class="bigImg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getMsgNoteDetail} from '@/views/index/api/api.message.js';
export default {
  props: ['msgNoteId'],
  data () {
    return {
      detail: null,
      imgList: []
    }
  },
  mounted () {
    this.getMsgNoteDetail();
  },
  methods: {
    // 获取公告消息详情
    getMsgNoteDetail () {
      getMsgNoteDetail(this.msgNoteId).then(res => {
        if (res && res.data) {
          this.detail = res.data;
          this.imgList = this.detail.sysAppendixList;
        }
      })
    },
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
    min-height: 740px;
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    > div:nth-child(1){
      margin-bottom: 15px;
    }
    > div:nth-child(2){
      display: flex;
      line-height: 20px;
      > div:nth-child(2){
        flex: 1;
      }
      .det_pic_box{
        width: 400px;
        padding-top: 20px;
        display: flex;
        flex-wrap: wrap;
        > img{
          width: 33%;
          height: 137px;
          padding-right: 20px;
          padding-bottom: 20px;
          cursor: pointer;
        }
      }
    }
  }
 
}
</style>
