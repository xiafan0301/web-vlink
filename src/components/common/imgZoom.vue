<template>
  <div class="imgz_mask" id='imgZoomMask'>
    <i class="el-icon-circle-close"></i>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    let _this = this;
    // $('#imgZoomMask').appendTo($('body'));
    $('body').on('click', '.bigImg', function () {
      let nImg = $(this);
      if (nImg && nImg.length > 0) {
        let src = $(this).attr('src');
        $('#imgZoomMask').show();
        _this.imgHandler(src);
      }
    });
    $('#imgZoomMask').on("click", function (event) {
      let e = (event) ? event : window.event;
      if (window.event && e.cancelBubble) {
        e.cancelBubble = true; // ie下阻止冒泡
      } else {
        //e.preventDefault();
        e.stopPropagation(); // 其它浏览器下阻止冒泡
      }
      $('#imgZoomMask').hide();
      $('#imgZoomImg').fadeOut().remove();
    });
    $(document).keyup(function (event) {
      if (event && (event.keyCode === 27 || event.keyCode === 96)) {
        $('#imgZoomMask').hide();
        $('#imgZoomImg').fadeOut().remove();
      }
    });
  },
  methods: {
    imgHandler (src) {
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();
      var img = new Image();
      img.src = src;
      img.onload = function() {
        var dom = "";
        var displayWidth = 0;
        var displayHeight = 0;
        var style = "";
        if (img.width > img.height) {
            displayWidth = windowWidth / 2;
            displayHeight = img.height * displayWidth / img.width;
            style = "z-index:16666;position:absolute;top:" +
                windowHeight / 2 +
                "px;margin-top:-" +
                displayHeight / 2 +
                "px;left:" +
                windowWidth / 2 +
                "px;margin-left:-" +
                displayWidth / 2 +
                "px;cursor:pointer;";
            dom = "<img draggable='true' src = '" +
                src +
                "' width = '50%' style='" +
                style +
                "' id='imgZoomImg'>";
        } else {
            displayHeight = windowHeight / 2;
            displayWidth = displayHeight * img.width / img.height;
            style = "z-index: 16666;position:absolute;top:" +
                windowHeight / 2 +
                "px;margin-top:-" +
                displayHeight / 2 +
                "px;left:" +
                windowWidth / 2 +
                "px;margin-left:-" +
                displayWidth / 2 +
                "px;cursor:pointer;";
            dom = "<img draggable='true' src = '" +
                src +
                "' height = '50%' style=' " +
                style +
                "' id='imgZoomImg'>";
        }
        $("body").append(dom);
        $("#imgZoomImg").dragging({
            move: "both", //拖动方向，x y both
            direction:'all',
            randomPosition: false //初始位置是否随机
        });
        $("#imgZoomImg").on("mousewheel", function(e, d) {
          //d 1 上 -1 下
          let iFex = 1.1, iFex2 = 1.05;
          if (d === 1) {
            let nI = $('#imgZoomImg');
            let iT = Number(nI.css('top').replace(/px/g, '')), 
              iL = Number(nI.css('left').replace(/px/g, '')), 
              width = nI.width(), height = nI.height();
            $("#imgZoomImg").css({
              top: iT / iFex2 + 'px',
              left: iL / iFex2 + 'px',
              width: width * iFex,
              height: height * iFex
            });
          }
          if (d === -1) {
            let nI = $('#imgZoomImg');
            let iT = Number(nI.css('top').replace(/px/g, '')), 
              iL = Number(nI.css('left').replace(/px/g, '')), 
              width = nI.width(), height = nI.height();
            $("#imgZoomImg").css({
              top: iT * iFex2 + 'px',
              left: iL * iFex2 + 'px',
              width: width / iFex,
              height: height / iFex
            });
          }
        });
      }
    }
  }
}
</script>
<style lang="scss" paged>
.imgz_mask {
  display: none;
  position: fixed; top: 0;left: 0; z-index: 15555;
  width: 100%;height: 100%;
  background: rgba(0, 0, 0, 0.5);
  > i {
    position: absolute; top: 10px; right: 10px; z-index: 17000;
    cursor: pointer;
    color: #fff; font-size: 26px;
  }
}
</style>


