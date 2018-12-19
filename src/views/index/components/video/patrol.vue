<template>
  <div class="vl_vid">
    <div class="vid_title">
      <ul class="vid_show_type">
        <li class="vl_icon vl_icon_061" :class="{'vl_icon_sed': showType === 1}" @click="showType = 1"></li>
        <li class="vl_icon vl_icon_062" :class="{'vl_icon_sed': showType === 2}" @click="showType = 2"></li>
        <li class="vl_icon vl_icon_063" :class="{'vl_icon_sed': showType === 3}" @click="showType = 3"></li>
        <li class="vl_icon vl_icon_064" :class="{'vl_icon_sed': showType === 4}" @click="showType = 4"></li>
        <li class="vl_icon vl_icon_065" :class="{'vl_icon_sed': showType === 5}" @click="showType = 5"></li>
      </ul>
    </div>
    <div class="vid_content">
      <ul class="vid_list" :class="'vid_list_st' + showType">
        <li v-for="item in 16" :key="item">
          <div>
            <img src="../../../../assets/img/temp/video_pic.png" alt="">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showType: 2
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.vl_vid {
  height: 100%;
  position: relative;
  > .vid_title {
    position: absolute; top: 0; left: 0;
    width: 100%;
    height: 60px;
    padding-top: 10px;
    .vid_show_type {
      overflow: hidden;
      padding-left: 20px;
      > li {
        height: 40px;
        float: left;
        margin-top: 5px; margin-right: 10px;
        cursor: pointer;
        &.vl_icon_sed {
          cursor: default;
        }
      }
    }
  }
  > .vid_content {
    height: 100%;
    padding: 60px 10px 10px 10px;
  }
}
.vid_list {
  width: 100%; height: 100%;
  > li {
    float: left;
    padding: 10px;
    width: 50%; height: 50%;
    transition: all .3s;
    > div {
      position: relative;
      width: 100%; height: 100%;
      overflow: hidden;
      > img {
      }
    }
  }
  &.vid_list_st1 > li {
    width: 100%; height: 100%;
  }
  &.vid_list_st2 > li {
    width: 50%; height: 50%;
  }
  &.vid_list_st3 > li {
    width: 33.33%; height: 40%;
    &:nth-child(1) {
      width: 50%; height: 60%;
    }
    &:nth-child(2) {
      width: 50%; height: 60%;
    }
  }
  &.vid_list_st4 > li {
    width: 33.33%; height: 33.33%;
  }
  &.vid_list_st5 > li {
    width: 25%; height: 25%;
  }
}
</style>
