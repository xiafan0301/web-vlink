<template>
  <div class="um_imgzoom_mask" :id="maskId">
    <i class="um_imgzoom_close el-icon-circle-close" :id="imgCloseId"></i>
    <span><i class="el-icon-loading"></i>请稍后...</span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      imgClass: 'bigImg', // 图片加上这个CLASS即可点击触发图片放大效果

      imgId: 'um_imgZoomImg',
      maskId: 'um_imgZoomMask',
      imgCloseId: 'um_imgZoomClose'
    }
  },
  mounted () {
    let _this = this;
    let nMask = $('#' + _this.maskId), nClose = $('#' + _this.imgCloseId);
    nMask.appendTo($('body'));
    nClose.appendTo($('body'));
    $('body').on('click', '.' + _this.imgClass, function () {
      let nImg = $(this);
      if (nImg && nImg.length > 0) {
        let src = nImg.attr('src');
        nMask.show();
        nMask.children('span').show();
        nClose.show();
        _this.imgHandler(src);
      }
    });
    // 遮盖层点击事件，关闭放大效果
    nMask.on("click", function (event) {
      let e = (event) ? event : window.event;
      if (window.event && e.cancelBubble) {
        e.cancelBubble = true; // ie下阻止冒泡
      } else {
        e.stopPropagation(); // 其它浏览器下阻止冒泡
      }
      nMask.hide();
      nClose.hide();
      $('#' + _this.imgId).fadeOut().remove();
    });
    // 关闭按钮点击事件，关闭放大效果
    nClose.on("click", function (event) {
      let e = (event) ? event : window.event;
      if (window.event && e.cancelBubble) {
        e.cancelBubble = true; // ie下阻止冒泡
      } else {
        e.stopPropagation(); // 其它浏览器下阻止冒泡
      }
      nMask.hide();
      nClose.hide();
      $('#' + _this.imgId).fadeOut().remove();
    });
    /* $(document).keyup(function (event) {
      if (event && (event.keyCode === 27 || event.keyCode === 96)) {
        $('#' + _this.maskId).hide();
        $('#' + _this.imgId).fadeOut().remove();
      }
    }); */
  },
  methods: {
    imgHandler (src) {
      let _this = this;
      let windowWidth = $(window).width(), windowHeight = $(window).height();
      let img = new Image();
      img.src = src;
      img.onload = function() {
        if ($('#' +  _this.imgId) && $('#' +  _this.imgId).length > 0) {
          $('#' +  _this.imgId).remove();
        }
        // 此时为关闭遮盖才能添加到 body
        let nMask = $('#' + _this.maskId);
        if (!nMask.is(':hidden')) {
          let dom = '', style = '';
          let displayWidth = 0, displayHeight = 0, swh = '';
          if (img.width > img.height) {
            displayWidth = windowWidth / 2;
            displayHeight = img.height * displayWidth / img.width;
            swh = ' width="50%"';
          } else {
            displayHeight = windowHeight / 2;
            displayWidth = displayHeight * img.width / img.height;
            swh = ' height="50%"';
          }
          style = 'z-index: 20002; position: absolute;' +
            ' top:' + (windowHeight / 2 -  displayHeight / 2) + 'px;' +
            ' left:' + (windowWidth / 2 - displayWidth / 2) + 'px;' +
            ' cursor: pointer;';
          dom = '<img draggable="true" src = "' + src + '"' +
            swh + ' style="' + style + '" id="' + _this.imgId + '">';

          $('body').append(dom);
          nMask.children('span').hide();
          let nImg = $('#' +  _this.imgId);
          nImg.dragging({
              move: 'both', //拖动方向，x y both
              direction:'all',
              randomPosition: false //初始位置是否随机
          });
          nImg.on('mousewheel', function(e, d) {
            //d 1 上 -1 下
            let iFex = 1.1;
            if (d === 1) {
              let iT = Number(nImg.css('top').replace(/px/g, '')), 
                  iL = Number(nImg.css('left').replace(/px/g, '')), 
                  width = nImg.width(),
                  height = nImg.height();
              nImg.css({
                top: (iT - height * ((iFex - 1) / 2))  + 'px',
                left: (iL - width * ((iFex - 1) / 2)) + 'px',
                width: width * iFex,
                height: height * iFex
              });
            }
            if (d === -1) {
              let iT = Number(nImg.css('top').replace(/px/g, '')), 
                  iL = Number(nImg.css('left').replace(/px/g, '')), 
                  width = nImg.width(),
                  height = nImg.height();
              nImg.css({
                top: (iT + height * ((iFex - 1) / 2))  + 'px',
                left: (iL + width * ((iFex - 1) / 2)) + 'px',
                width: width - (iFex - 1) * width,
                height: height - (iFex - 1) * height
              });
            }
          });
        }
      }
    }
  }
}
</script>
<style lang="scss" paged>
.um_imgzoom_mask {
  display: none;
  position: fixed; top: 0;left: 0; z-index: 20001;
  width: 100%;height: 100%;
  background: rgba(0, 0, 0, 0.5);
  > span {
    display: inline-block;
    position: absolute; top: 50%; left: 50%;
    color: #fff;
    margin-left: -50px; margin-top: -12px;
    > i {
      position: relative; top: 2px;
      display: inline-block;
      font-size: 20px;
      margin-right: 10px;
    }
  }
}
.um_imgzoom_close {
  display: none;
  position: fixed; top: 10px; right: 10px; z-index: 20003;
  cursor: pointer;
  color: #fff; font-size: 26px;
}
</style>


