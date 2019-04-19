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
          <div class="det_pic_box" id="imgs">
            <!-- <div class="img" v-for="item in detail.sysAppendixList" :key="item.id">
              <img :src="item.path" alt="" width="117" height="117">
            </div> -->
            <!-- <div ></div> -->
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
      detail: null
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
          if (this.detail.sysAppendixList && this.detail.sysAppendixList.length > 0) {
            this.previewPictures();
          }
        }
      })
    },
    skip (pageType) {
      this.$emit('changePage', pageType)
    },
    // 预览图片
    previewPictures () {
      setTimeout(() => {
        let imgs = this.detail.sysAppendixList.map(m => m.path);
        // 图片数组2
        let imgs2 = []
        // 获取图片列表容器
        let $el = document.getElementById('imgs');
        let html = '';
        // 创建img dom
        imgs.forEach(function (src) {
          // 拼接html结构
          html += '<div class="item" style="width: 33%;height: 137px;padding-right: 20px;padding-bottom: 20px;cursor: pointer;" data-angle="' + 0 + '"><img src="' + src + '" style="width: 100%;height: 100%;"></div>';
          // 生成imgs2数组
          imgs2.push({
            url: src,
            angle: 0
          })
        })
        // 将图片添加至图片容器中
        $el.innerHTML = html;
        // 使用方法
        let ziv = new ZxImageView(null, imgs2);
        // console.log(ziv);
        // 查看第几张
        let $images = $el.querySelectorAll('.item');
        for (let i = 0; i < $images.length; i++) {
          (function (index) {
            $images[i].addEventListener('click', function () {
              ziv.view(index);
            })
          }(i))
        }
      }, 50)
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
        // .img{
        //   width: 33%;
        //   height: 137px;
        //   padding-right: 20px;
        //   padding-bottom: 20px;
        // }
      }
    }
  }
 
}
</style>
