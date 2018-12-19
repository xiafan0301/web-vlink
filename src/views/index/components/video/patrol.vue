<template>
  <div class="vl_vid">
    <div class="vid_title">
      <ul class="vid_show_type">
        <li @click="showType = 1">
          样式1
        </li>
        <li @click="showType = 2">
          样式2
        </li>
        <li @click="showType = 3">
          样式3
        </li>
        <li @click="showType = 4">
          样式4
        </li>
        <li @click="showType = 5">
          样式5
        </li>
        <li @click="showType = 6">
          样式5
        </li>
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
    height: 50px;
    .vid_show_type {
      overflow: hidden;
      > li {
        height: 50px;
        line-height: 50px;
        float: left;
        margin-right: 10px;
        cursor: pointer;
        padding: 0 10px;
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
    width: 33.33%; height: 33.33%;
  }
  &.vid_list_st4 > li {
    width: 33.33%; height: 33.33%;
    &:first-child {
      width: 100%; height: 66.66%;
    }
  }
  &.vid_list_st5 > li {
    width: 50%; height: 40%;
    &:first-child {
      width: 100%; height: 60%;
    }
  }
  &.vid_list_st6 > li {
    width: 25%; height: 25%;
  }
}
</style>
